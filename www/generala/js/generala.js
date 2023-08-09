//const NUMBER_OF_PLAYERS = 2;
const DICE_SIZE = 50;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25  * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;
const GAME_NAMES = ["1", "2", "3", "4", "5", "6", "ESCALERA", "FULL", "PÓKER", "GENERALA", "DOBLE GENERALA", "TOTAL"];

//para posiciones del storage
let pos;
//traigo el storage
const app = Storage.get("app");

// el objeto de juego
const game = {
   players: 2, // Cantidad de jugadores 
   playedRounds:0,
   turn: 1, // Jugador actual
   scores: [], //Puntaje de los jugadores
   moves: 0, // Cantidad de tiros que le queda al jugador actual
   dices: [0, 0, 0, 0, 0], // Estado de los 5 dados (cubilete + mesa) 
   selection: [false, false, false, false, false],
   score: 20
};

/// inicializo turno y playedRounds para volver a jugar y los scores de cada uno en un numero lo valido
function initGame() {
    game.turn = 1;
    game.playedRounds = 0;
     // inicializar tablero de puntos - con el 0 vamos a reemplazar que se lo tacho
    for(let player = 0; player < game.players; player++){
        game.scores[player] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0];
    }
    
    initDicesPlay();
    showScores(); // muestro la tabla    
    //deshabilitar el botón para reiniciar
    //document.getElementById("btn-reset").setAttribute("disabled","disabled");
}

function whoWon() {
    let who = -1;
    let score = -1;
    for (let player = 0; player < game.players; player++) {
        if(game.scores[player][11] > score) {
            score = game.scores[player][11];
            who = app.profiles[player].nick;
            //le sumo el score al personaje
            app.profiles[player].score.generala += game.score;
            //acordarse de sumarle al total
            //alert("el jugador ganador tiene " + app.profiles[player].score.generala + "puntos");
            
        }
    }
    Storage.put("app", app);
    return {winner: who, score: score}; 
}

function computeNumberScore(theNumber) {
    let theScore = 0;
    for (let i = 0; i < game.dices.length; i++) {
        if (game.dices[i] === theNumber) {
            theScore += theNumber;
            openDlg("wrn","Anotaste " + theScore + " puntos en el numero " + theNumber,"<button id='button-yes' onclick=\"closeDlg();\">OK");

        }
        else if (theScore === 0){
            openDlg("wrn","¿Desea tachar este juego?","<button id='button-yes' onclick=\"closeDlg();tacharJuego(theNumber);\">Si</button><button id='button-no' onclick=\"closeDlg();return;\">No</button>");    
        }
        else 
        {
            //openDlg("wrn","Anotaste " + theScore + " puntos en el numero " + theNumber,"<button id='button-yes' onclick=\"closeDlg();\">OK");
        }
    }
    
    return theScore;
}

function doScore(whichGame) {
    //no puedo anotarme un juego si no tiré al menos una vez los dados
    if(game.moves === 0) {
        return;
    }
    let theScore;
    switch (whichGame) {
        case 6:
            if (esEscalera()) {
                theScore = game.moves === 1 ? 25 : 20; // para considerar los juegos servidos
                game.scores[game.turn - 1][6] = theScore;
                game.scores[game.turn - 1][11] += theScore;
               // openDlg("wrn","Anotaste " + theScore + " puntos en la escalera ","<button id='button-yes' onclick=\"closeDlg();\">OK");

            } else {
                openDlg("wrn","¿Desea tachar este juego?","<button id='button-yes' onclick=\"closeDlg();tacharJuego(6);\">Si</button><button id='button-no' onclick=\"closeDlg();return;\">No</button>");    
            }
            
            break;
        case 7:
            if (esFull()) {
                theScore = game.moves === 1 ? 35 : 30;
                game.scores[game.turn - 1][7] = theScore;
                game.scores[game.turn - 1][11] += theScore;
               // openDlg("wrn","Anotaste " + theScore + " puntos en el full ","<button id='button-yes' onclick=\"closeDlg();\">OK");
            } else {
                openDlg("wrn","¿Desea tachar este juego?","<button id='button-yes' onclick=\"closeDlg();tacharJuego(7);\"> Si </button><button id='button-no' onclick=\"closeDlg();return;\"> No </button>");    
            }
            break;
        case 8:
            if (esPoker()) {
                theScore = game.moves === 1 ? 45 : 40;
                game.scores[game.turn - 1][8] = theScore;
                game.scores[game.turn - 1][11] += theScore;
               // openDlg("wrn","Anotaste " + theScore + " puntos en el poker ","<button id='button-yes' onclick=\"closeDlg();\">OK");
            } else {
                openDlg("wrn","¿Desea tachar este juego?","<button id='button-yes' onclick=\"closeDlg();tacharJuego(8);\">Si</button><button id='button-no' onclick=\"closeDlg();return;\">No</button>");    
            }
            break;
        case 9:
            if (esGenerala()) {
                theScore = game.moves === 1 ? 55 : 30;
                game.scores[game.turn - 1][9] = theScore;
                game.scores[game.turn - 1][11] += theScore;
             //   openDlg("wrn","Anotaste " + theScore + " puntos en la generala ","<button id='button-yes' onclick=\"closeDlg();\">OK");
            } else {
                if (game.scores[game.turn - 1][10] === 0) {
                    openDlg("wrn","¿Desea tachar este juego?","<button id='button-yes' onclick=\"closeDlg();tacharJuego(9);\">Si</button><button id='button-no' onclick=\"closeDlg();return;\">No</button>");    

                } else {
                    openDlg("wrn","Anotación no válida","Primero debe tacharse la doble!");
                }
            }
            break;
        case 10:
            if (esGenerala()) {
                if(game.scores[game.turn - 1][9] > 0) {
                    theScore = game.moves === 1 ? 105 : 100;
                    game.scores[game.turn - 1][10] = theScore;
                    game.scores[game.turn - 1][11] += theScore;
                    
                } else {
                    openDlg("wrn","Anotación no válida","Primero debe anotarse la generala!");
                }
            } else {
                openDlg("wrn","¿Desea tachar este juego?","<button id='button-yes' onclick=\"closeDlg();tacharJuego(10);\">Si</button><button id='button-no' onclick=\"closeDlg();return;\">No</button>");    

            }
            break;
        default:
            theScore = computeNumberScore(whichGame + 1);
            game.scores[game.turn - 1][whichGame] = theScore;
            game.scores[game.turn - 1][11] += theScore;
            doPlayerSwitchAndEndGameIfNeeded ()
    }
}

function tacharJuego(posicion) {
    game.scores[game.turn - 1][posicion] = 0;
    doPlayerSwitchAndEndGameIfNeeded();
}

function doPlayerSwitchAndEndGameIfNeeded() {
    changePlayer();
    showScores();
    if (game.playedRounds === 11) {
        //document.getElementById("btn-reset").removeAttribute("disabled"); //rehabilito botón de reiniciar
        const winner = whoWon();
        //score
        openDlg("inf","Juego terminado","<div> Ganó " + winner.winner + " con " + winner.score + " puntos</div><button onclick=\"initGame();closeDlg();\">Juegar de nuevo</button>", false);//para poder escribir la comilla doble adentro de un string con comillas, tengo que ponerle estas contrabarras
    }
}

function showScores() {
    //dibu encabezado
    const thead = document.querySelector("#scores thead");
    thead.innerHTML = null;
    const tr = document.createElement("tr")
    const thGames = document.createElement("th");
    thGames.appendChild(document.createTextNode("Juegos"));
    tr.appendChild(thGames);
    for (let player = 0; player < game.players; player++) {
        const thPlayer = document.createElement("th");
        //aca le asigno el nombre a la table de cada jugador
        thPlayer.style.width = "60px";
        thPlayer.appendChild(document.createTextNode("" + app.profiles[player].nick + ""));
        //agrego una clase al th que corresponda para que me lo pinte diferente
        thPlayer.classList.remove("current"); //forzosamente, primero le quito la clase que tenía (porque )el turno se va alternando)
        
        if ((player + 1) === game.turn) { //pregunto: si es el jugaador actual se la agrego
            console.info(game.turn, player, player + 1); 
            //thPlayer.classList.add("current");
            
            thPlayer.style.color = app.profiles[player].color;
        }

        tr.appendChild(thPlayer);
    }
    thead.appendChild(tr);
    //dibu cuerpo (tbody)
    const tbody = document.querySelector("#scores tbody");
    tbody.innerHTML = null;
    for (let row = 0; row < 12; row++) {
        const tr = document.createElement("tr");
        const tdGame= document.createElement("td");
        tdGame.appendChild(document.createTextNode(GAME_NAMES[row]));
        tr.appendChild(tdGame);
        for (let player = 0; player < game.players; player++) {
            const tdPlayer = document.createElement("td");
            const gameScore = game.scores[player][row];
            tdPlayer.appendChild(document.createTextNode(gameScore < 0 ? " " : gameScore === 0 && row !== 11 ? "X" : gameScore));
            tr.appendChild(tdPlayer);
        }
        if (row < 11) {
            tr.onclick = () => { 
                if (game.scores[game.turn - 1][row] !== -1) {
                    openDlg("err","Juego ya anotado elija otro", "<button id='button-yes' onclick=\"closeDlg();\">OK");
                } else {
                    doScore(row);
                }
            }
        }
        tbody.appendChild(tr);
    }
}

function getGameName(gameNumber) {
    let gameName = "";
    switch(gameNumber) {
        case 6:
            gameName = "E";
            break;
        case 7:
            gameName = "F";
            break;
        case 8:
            gameName = "P";
            break;
        case 9:
            gameName = "G";
            break;
        case 10:
            gameName = "DG";
            break;
        case 11:
            gameName = "TOTAL";
            break;
        default:
            gameName = "" + (gameNumber + 1); // truco para que quede como string 
    }
    return gameName;
}


//inicializo los dados y movimientos y que nada este seleccionado // habilito el boton que cuando sea  3movmientos se va a cortar
function initDicesPlay() {
    game.moves = 0;
    game.dices = [0, 0, 0, 0, 0];
    game.selection = [false, false, false, false, false];
    //habilitar boton
    document.getElementById("btn-roll").removeAttribute("disabled");
     //espera el nombre de la funcion, no hace falta poner todo

     //muestro los dados
    showDices();
    //actualizo los movimientos de la persona
    updateMovesDisplay();
}


//para tirar numeros al azar del dado entre 1 y 6 
function rollDice() {
    return Math.floor(Math.random() * (6 - 1 + /* este uno es fijo a diferencia de los otros */1)) + 1;
}


function rollDices() {
    if(game.moves === 0){
        game.moves++;
        //tirar todos los dados
        for (let i = 0; i < game.dices.length; i++) {
            game.dices[i] = rollDice();
        } 
        // si es menor a 3 tiro los seleccionados
    } else if (game.moves < 3) {
        game.moves++;
        // tirar los dados seleccionados
        for (let i = 0; i < game.dices.length; i++) {
            if(game.selection[i]) {
                game.dices[i] = rollDice();
            }
        }
        game.selection = [false, false, false, false, false];
    }
    game.dices.sort((a, b) => a - b); //ordena los dados de menor a mayor --> los muestra --> cambia movimietno del jugador
    showDices();
    updateMovesDisplay();
    
    //cuando hay que pasarle el turno al otro
    if (game.moves === 3){
        //no more moves left
        document.getElementById("btn-roll").setAttribute("disabled", "disabled");
        score();
    }
}

//le voy sacando la cantidad de jugadas
function updateMovesDisplay() {
    document.querySelector("#moves span").innerHTML = 3 - game.moves;
}

function openDlg(type, dlgTitle, dlgContent, showClose = true) {
    const dlg = document.getElementById("dlg");
    dlg.classList.remove("inf","wrn","err"); //primero le quito todas las clases para agregarle la que corresponda. type va a ser cualquiera de estos tres de acuerdo al tipo de diálogo
    dlg.classList.add(type);
    dlg.querySelector(".header .title").innerHTML = dlgTitle;
    dlg.querySelector(".body").innerHTML = dlgContent;
    if (!showClose){
        dlg.querySelector(".header .btn-close").classList.add("nodisp");
    } else{
        dlg.querySelector(".header .btn-close").classList.remove("nodisp");
    }
    dlg.classList.remove("nodisp");

}
function closeDlg() {
    document.getElementById("dlg").classList.add("nodisp");
}




const reEscalera = /12345|23456|13456/; /* forma de escribir una  expresion regular */
const reGenerala = /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/;
const rePoker = /1{4}(2|3|4|5|6)|12{4}|2{4}(3|4|5|6)|(1|2)3{4}|3{4}(4|5|6)|(1|2|3)4{4}|4{4}(5|6)|(1|2|3|4)5{4}|5{4}6|(1|2|3|4|5)6{4}/;
const reFull = /1{3}(2|3|4|5|6){2}|1{2}(2|3|4|5|6){3}|2{3}(3|4|5|6){2}|2{2}(3|4|5|6){3}|3{3}(4|5|6){2}|3{2}(4|5|6){3}|4{3}(5|6){2}|4{2}(5|6){3}|5{3}6{2}|5{2}6{3}/;
function esEscalera() {
    return game.dices.join('').match(reEscalera) !== null;/* el join los pega y los devuelve todos juntos como  un string / el match cuando no es nada va a devolver null y si esta devuelve otra cosa */
}
function esFull() {
    return game.dices.join('').match(reFull) !== null;
}
function esPoker() {
    return game.dices.join('').match(rePoker) !== null;
}
function esGenerala() {
    return game.dices.join('').match(reGenerala) !== null;
}

function score() {
    console.log("dices: %0", game.dices); // como quedaron los tiros en los juegos
    console.warn("Anotar a uno de los juegos!!!");
}

function changePlayer() {

    game.turn++; // incremento el turno y si me pase lo reseteo, vuelvo al primero
    if(game.turn > game.players){
         game.turn = 1;
         game.playedRounds++;
    }
    initDicesPlay();
}

//vamos a dibujar 1 puntito en el canvas (contexto,centro del circulo, centro del ciruculo)
function drawDot(ctx,x,y) {
    ctx.beginPath(); // empiezo a dibujar, apoyta el lapiz
    ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false); // dibujo un arco como si fuera un compas (x,y) = medio, le paso un radio , 2 PI = 360 grados para que me dibuje el circulo, false es para el sentido de orientacion del dibujo
    let dadoColor = game.turn;
    console.log("el turno del dado es" + dadoColor);
    if(dadoColor === 1 ) {
        ctx.fillStyle = app.profiles[0].color; // el color que lo voy a llenar
        dadoColor = 2;
    }
    else{
        ctx.fillStyle = app.profiles[1].color;
        dadoColor = 1;
    }
    
    ctx.fill(); // con fill le digo que me llene para que se convierta en circulo
    ctx.closePath(); // levanta el lapiz 

}

/*function drawDice(cont, number) {
    let ctx = cont.getContext("2d"); // es el mismo que uso en la otra funcion , como hago un dado plano le pido un contexto de 2 dimensiones

    // Borro - dejo transparente el contexto
    ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

    // Creo el Dado 
    ctx.beginPath(); // apoyo el lapiz
    ctx.rect(0, 0, DICE_SIZE, DICE_SIZE); // funcion rectangulo me crea el borde, y como le doy los dos mismos parametros se hace cuadrado se unen las vertices
    ctx.fillStyle = "#FFFFFF"; // el color que lo voy a llenar
    ctx.fill(); // con fill le digo que me llene para que se convierta en cuadrado
    ctx.closePath(); // levanta el lapiz 

    // le pongo numeros dependiendo que dado es
    switch(number) {
        case 1:
            drawDot(ctx,AT_HALF,AT_HALF);
            break;
        case 2:
            drawDot(ctx,AT_3QUARTER,AT_QUARTER);
            drawDot(ctx,AT_QUARTER,AT_3QUARTER);
            break;
        case 3:
            drawDot(ctx,AT_HALF,AT_HALF);
            drawDot(ctx,AT_3QUARTER,AT_QUARTER);
            drawDot(ctx,AT_QUARTER,AT_3QUARTER);
            break;
        case 4:
            drawDot(ctx,AT_3QUARTER,AT_QUARTER);
            drawDot(ctx,AT_QUARTER,AT_3QUARTER);
            drawDot(ctx,AT_QUARTER,AT_QUARTER);
            drawDot(ctx,AT_3QUARTER,AT_3QUARTER);
            break;
        case 5:
            drawDot(ctx,AT_HALF,AT_HALF);
            drawDot(ctx,AT_3QUARTER,AT_QUARTER);
            drawDot(ctx,AT_QUARTER,AT_3QUARTER);
            drawDot(ctx,AT_QUARTER,AT_QUARTER);
            drawDot(ctx,AT_3QUARTER,AT_3QUARTER);
            break;
        case 6:
            drawDot(ctx,AT_3QUARTER,AT_QUARTER);
            drawDot(ctx,AT_QUARTER,AT_3QUARTER);
            drawDot(ctx,AT_QUARTER,AT_QUARTER);
            drawDot(ctx,AT_3QUARTER,AT_3QUARTER);
            drawDot(ctx,AT_QUARTER,AT_HALF);
            drawDot(ctx,AT_3QUARTER,AT_HALF);
            break;
    } 
}*/

function drawDice(cont, number){
    let ctx = cont.getContext ("2d");

    //Borro
    ctx.clearRect(0, 0, DICE_SIZE, DICE_SIZE);

    //Dado
    ctx.beginPath(); //apoya el lapiz
    ctx.rect(0, 0, DICE_SIZE, DICE_SIZE); //hace el circulo
    ctx.fillStyle = "#ffffff"; 
    ctx.fill(); //lo pinta
    ctx.closePath();//levanta el lapiz

    switch (number){
        case 1: 
            drawDot(ctx, AT_HALF, AT_HALF);
            break;

        case 2: 
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            break;

        case 3: 
            drawDot(ctx, AT_HALF, AT_HALF);
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);

            break;

        case 4: 
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_QUARTER);
            drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
            break;

        case 5: 
            drawDot(ctx, AT_HALF, AT_HALF);
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_QUARTER);
            drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
            break;
            
        case 6: 
            drawDot(ctx, AT_3QUARTER, AT_QUARTER);
            drawDot(ctx, AT_QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_QUARTER);
            drawDot(ctx, AT_3QUARTER, AT_3QUARTER);
            drawDot(ctx, AT_QUARTER, AT_HALF);
            drawDot(ctx, AT_3QUARTER, AT_HALF);
            break;        
    }
}
function showDice(i, number) {
   let canvas = document.createElement("canvas");
   canvas.setAttribute("data-dice", i);
  // dice.classList.add("dado");
   canvas.setAttribute("width", "" + DICE_SIZE);
   canvas.setAttribute("height", "" + DICE_SIZE);
 // dice.style.borderRadius = (DICE_SIZE / 100) + "em";  
 // dice.style.margin = (DICE_SIZE / 200) + "em";  
   drawDice(canvas, number);
   canvas.onclick = function() {
     const whichDice = Number(this.getAttribute("data-dice"));
     game.selection[whichDice] = !game.selection[whichDice];
   //  console.log("Click en el dado " + /*es el contexto que se recibio el click / es el evento que de disparo el elemento*/this.getAttribute("data-dice"))
    if(game.selection[whichDice]) { /* permite que el usuario, cada vez que haga click, pueda seleccionar y des-seleccionar */
        canvas.classList.add("sel");
    }else {
        canvas.classList.remove("sel");
    }
    }
   return canvas;
}

//dentro del div dices hago el append child de los 5 dados
function showDices() {
    let cont = document.getElementById("dices");
    cont.innerHTML = null;
    for(let i = 0; i< game.dices.length;i++) {
        cont.appendChild(showDice(i,game.dices[i]));
    }
}

//function () {}
/* this -> elemento sobre el cual recayo el evento*/
function mostrarPuntos() {
    document.getElementById("tabla-puntos").classList.remove("nodisp");
}