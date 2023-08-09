const DIEZMIL = 10000;
const DICE_SIZE = 50;
const DOT_RADIUS = 0.1 * DICE_SIZE;
const AT_QUARTER = 0.25  * DICE_SIZE;
const AT_HALF = 0.5 * DICE_SIZE;
const AT_3QUARTER = 0.75 * DICE_SIZE;
const GAME_NAMES = ["Total"];
//creo el audio element para que suene cuando le pongo play
const audioElementDados = new Audio("../audio/dados.mp3");

//para posiciones del storage
let pos;
//traigo el storage
const app = Storage.get("app");

// el objeto de juego
const game = {
   players: 2, // Cantidad de jugadores 
   turn: 1, // Jugador actual
   scores: [], //Puntaje de los jugadores
   dices: [0, 0, 0, 0, 0, 0], // Estado de los 6 dados 
   score: 30 // puntaje del juego
};

/// inicializo turno y playedRounds para volver a jugar y los scores de cada uno en un numero lo valido
function initGame() {
    game.turn = 1;
     // inicializar tablero de puntos - con el 0 vamos a reemplazar que se lo tacho
    for(let player = 0; player < game.players; player++){
        game.scores[player] = 0;
    }
    
    initDicesPlay(); // inicio los dados
    showScores(); // muestro la tabla    

}

/* DADOS */
//inicializo los dados  
function initDicesPlay() {
    game.dices = [0, 0, 0, 0, 0, 0];
    //habilitar boton
    document.getElementById("btn-roll").removeAttribute("disabled");
     //muestro los dados
    showDices();
}

//dentro del div dices hago el append child de los 6 dados
function showDices() {
    let cont = document.getElementById("dices");
    cont.innerHTML = null;
    for(let i = 0; i< game.dices.length;i++) {
        cont.appendChild(showDice(i,game.dices[i]));
    }
    /*
    if(!game.dices.includes(5) && !game.dices.includes(1) && !esTripleSeis() && !esTripleCinco() && !!esTripleCuatro() && !esTripleTres() && !esTripleDos() && !esTripleUno() && !esEscalera()){
        openDlg("wrn","Ningun dado contiene puntos le toca a " + app.profiles[game.turn].nick,  "<button id='button-yes' onclick=\"closeDlg();\">OK");
        changePlayer();
    }*/
}

function showDice(i, number) {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("data-dice", i);
    canvas.setAttribute("width", "" + DICE_SIZE);
    canvas.setAttribute("height", "" + DICE_SIZE);
    drawDice(canvas, number);

    return canvas;
 }
 
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

//vamos a dibujar 1 puntito en el canvas (contexto,centro del circulo, centro del ciruculo)
function drawDot(ctx,x,y) {
    ctx.beginPath(); // empiezo a dibujar, apoyta el lapiz
    ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI, false); // dibujo un arco como si fuera un compas (x,y) = medio, le paso un radio , 2 PI = 360 grados para que me dibuje el circulo, false es para el sentido de orientacion del dibujo
    let dadoColor = game.turn;
    //console.log("el turno del dado es" + dadoColor);
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

//para tirar numeros al azar del dado entre 1 y 6 
function rollDice() {
    return Math.floor(Math.random() * (6 - 1 + /* este uno es fijo a diferencia de los otros */1)) + 1;
}


//tirar todos los dados
function rollDices() {
    audioElementDados.play();

    for (let i = 0; i < game.dices.length; i++) {
        game.dices[i] = rollDice();
    }   
    game.dices.sort((a, b) => a - b); //ordena los dados de menor a mayor --> los muestra --> cambia movimietno del jugador
    showDices();

}

/* HACER PUNTAJE */

// expresiones regulares del 10 mil
const reEscalera = /123456/; /* forma de escribir una  expresion regular */
function esEscalera() {
    return game.dices.join('').match(reEscalera) !== null;/* el join los pega y los devuelve todos juntos como  un string / el match cuando no es nada va a devolver null y si esta devuelve otra cosa */
}
const reTripleUnos = /111/;
function esTripleUno() {
    return game.dices.join('').match(reTripleUnos) !== null;
}

const reTripleDos= /222/;
function esTripleDos() {
    return game.dices.join('').match(reTripleDos) !== null;
}

const reTripleTres= /333/;
function esTripleTres() {
    return game.dices.join('').match(reTripleTres) !== null;
}

const reTripleCuatros= /444/;
function esTripleCuatro() {
    return game.dices.join('').match(reTripleCuatros) !== null;
}

const reTripleCincos= /555/;
function esTripleCinco() {
    return game.dices.join('').match(reTripleCincos) !== null;
}

const reTripleSeis= /666/;
function esTripleSeis() {
    return game.dices.join('').match(reTripleSeis) !== null;
}

// para calcular puntaje
let theScore = 0;
// calculo puntaje - ver anotaciones 
function doScore(){
    if(!game.dices.includes(5) && !game.dices.includes(1) && !esTripleSeis() && !esTripleCinco() && !esTripleCuatro() && !esTripleTres() && !esTripleDos() && !esTripleUno()){
        openDlg("wrn","Ningun dado contiene puntos le toca a " + app.profiles[game.turn - 1].nick,  "<button id='button-yes' onclick=\"closeDlg();\">OK");
    } else {
        if (esEscalera()) {
            console.log("es escalera, suma 1500 puntos");
            theScore += 1500;
        } else {
            if (esTripleUno()) {
                console.log("es triple 1, suma 1000 puntos");
            theScore += 1000;
            }
            if (esTripleDos()) {
                console.log("es triple 2, suma 200 puntos");
            theScore += 200;
            }
            if (esTripleTres()) {
                console.log("es triple 3, suma 300 puntos");
            theScore += 300;
            }
            if (esTripleCuatro()) {
                console.log("es triple 4, suma 400 puntos");
            theScore += 400;
            }
            if (esTripleCinco()) {
                console.log("es triple 5, suma 500 puntos");
            theScore += 500;
            }
            if (esTripleSeis()) {
                console.log("es triple 6, suma 600 puntos");
            theScore += 600;
            }
            if (game.dices.includes(1) && !esTripleUno() ) {
                console.log("tiene un uno");
            theScore += game.dices.filter(num => num === 1).length * 100;    
            }
            if (game.dices.includes(5) && !esTripleCinco()) {
                console.log("tiene un cinco");
            theScore += game.dices.filter(num => num === 5).length * 50;    
            }  
        }

        game.scores[game.turn - 1] += theScore;

        if(game.scores[game.turn - 1] >= 750){
            openDlg("inf","Sumaste " + theScore + " puntos","<button id='button-yes' onclick=\"closeDlg();\">OK");
            showScores();
            if (game.scores[game.turn-1] >= DIEZMIL) {
                //document.getElementById("btn-reset").removeAttribute("disabled"); //rehabilito botón de reiniciar
                const winner = whoWon();
                //score
                openDlg("inf","Juego terminado","<div> Ganó " + winner.winner + " con " + winner.score + " puntos</div><button id='button-yes' onclick=\"initGame();closeDlg();\">Juegar de nuevo</button>", false);//para poder escribir la comilla doble adentro de un string con comillas, tengo que ponerle estas contrabarras
            } else {
                changePlayer();
            }
            
        } else{
            document.getElementById("btn-roll").setAttribute("disabled", "disabled");
            openDlg("err","Todavia no puede anotar el puntaje porque no llego a 750",  "<button id='button-yes' onclick=\"closeDlg();\">OK"); 
            //game.scores[game.turn - 1] = 0;
            changePlayer();
        }
        
    }
}


function whoWon() {

            who = app.profiles[game.turn-1].nick;
            //le sumo el score al personaje
            app.profiles[game.turn -1].score.misuperjuego += game.score;
            //acordarse de sumarle al total
            //alert("el jugador ganador tiene " + app.profiles[player].score.generala + "puntos");
    Storage.put("app", app);
    return {winner: who, score:game.scores[game.turn-1]}; 
}

function showScores() {
    //dibu encabezado
    const thead = document.querySelector("#scores thead");
    thead.innerHTML = null;
    const tr = document.createElement("tr")
    const thGames = document.createElement("th");
    thGames.appendChild(document.createTextNode(""));
    tr.appendChild(thGames);
    for (let player = 0; player < game.players; player++) {
        const thPlayer = document.createElement("th");
        //aca le asigno el nombre a la table de cada jugador
        thPlayer.style.width = "60px";
        thPlayer.appendChild(document.createTextNode("" + app.profiles[player].nick + ""));
        //agrego una clase al th que corresponda para que me lo pinte diferente
        thPlayer.classList.remove("current"); //forzosamente, primero le quito la clase que tenía (porque )el turno se va alternando)
        thPlayer.style.color = app.profiles[player].color;
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
    for (let row = 0; row < 1; row++) {
        const tr = document.createElement("tr");
        const tdGame= document.createElement("td");
        tdGame.appendChild(document.createTextNode(GAME_NAMES[row]));
        tr.appendChild(tdGame);
        for (let player = 0; player < game.players; player++) {
            const tdPlayer = document.createElement("td");
            tr.appendChild(tdPlayer);
            const gameScore = game.scores[player];
            tdPlayer.appendChild(document.createTextNode(gameScore));
        }
        tbody.appendChild(tr);
    }
}

function changePlayer() {
   // document.getElementById("btn-reset").removeAttribute("disabled"); //rehabilito botón de reiniciar
    game.turn++; // incremento el turno y si me pase lo reseteo, vuelvo al primero
    if(game.turn > game.players){
         game.turn = 1;
    }
   theScore = 0;
    initDicesPlay();
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



