//encapsulamos todo en 1 objeto juego
let game;

let ganador = document.getElementById("ganador");
//para posiciones del storage
let pos;
//traigo el storage
const app = Storage.get("app");


/* ESTA FUNCION CREA LA TABLA DESDE CERO, LA VACIA Y LA LLENA
function draw() {
    // traigo la tabla
    const table = document.querySelector("table");
    // cada vez que la creo la vacio
    table.innerHTML = null;

    // este for recorre cada una de las filas 
    for(let r = 0; r < board.length ; r++) {
        //genero un tr para cada fila
        const tr = document.createElement("tr");
        for(let c=0; c < board[r].length; c++) {
            const td = document.createElement("td");
            td.appendChild(document.createTextNode(board[r][c]));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    
}*/

function initGame() {
    game = {
        board : [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
          ],
          jugadas: 0,
          turno: tirarMoneda(),
          puedeSeguir: true, // le agregamos el flag
          score: 10
    };

    draw();
}

function draw() {

    //des-habilitar el boton si (no) puedeSeguir 
    if(game.puedeSeguir) {
        document.getElementById("cartel").classList.add("nodisp");
    } 
  //document.getElementById("turno").innerHTML = game.turno;
    if(game.turno === "X") {
        document.getElementById("turno").innerHTML = app.profiles[0].nick;
        document.getElementById("turno").style.color = app.profiles[0].color;
    }
    else {
        document.getElementById("turno").innerHTML = app.profiles[1].nick;
        document.getElementById("turno").style.color = app.profiles[1].color;
    }
    
    for(let r = 0; r < game.board.length ; r++) {
        for(let c=0; c < game.board[r].length; c++) {
            //nth-of-type me selecciona el elemento tr de orden 1/2/3 con el td 1/2/3 // son necesarios porque mis arrays estan basados enese orden
            const cell =  document.querySelector("table tr:nth-of-type(" + (r + 1) + ") td:nth-of-type(" + (c + 1) + ")");
            // primero vacio lo que tenia 
            cell.innerHTML = null;
            // obtengo lo que tengo en la r sub c 
            cell.appendChild(document.createTextNode(game.board[r][c]));
        
        }
    }

}


function play(r, c){
    console.log("click ", r,c);
    const cell = document.querySelector("table tr:nth-of-type(" + (r+1) + ") td:nth-of-type(" + (c+1) + ") ");
    
    if(game.turno === "X"){
        pos = 1;
    }else{
        pos = 0;
    }
    if(game.puedeSeguir && game.board[r][c] === "")
    {
        game.jugadas++;
        game.board[r][c] = game.turno;
    
       // hay que chequiar aca quien gano porque sino le daria al otro quien es el que gano
       if(wonDiag2(game.turno) || wonHoriz(game.turno) || wonVert(game.turno)) {
           // la funcion won tambien llama a draw
           cell.style.color = app.profiles[pos].color;
           won();
           if(game.turno === "X") {
            ganador.innerHTML = "EL GANADOR FUE " + app.profiles[0].nick + ""; 
            ganador.style.color = app.profiles[0].color;
            //sumarle a score
            app.profiles[0].score.tateti = app.profiles[0].score.tateti + game.score;
            // acordarse de acumular en total 
            //alert("el jugador 0 tiene " + app.profiles[0].score.tateti + "puntos");
            } else {
            cell.style.color = app.profiles[1].color;
            ganador.innerHTML = "EL GANADOR FUE " + app.profiles[1].nick + ""; 
            ganador.style.color = app.profiles[1].color;
            app.profiles[1].score.tateti = app.profiles[1].score.tateti + game.score;
             // acordarse de acumular en total 
            // alert("el jugador 1 tiene " + app.profiles[1].score.tateti + "puntos");
            }
          // document.querySelector("table").classList.add("nodisp");
           Storage.put("app", app); 
           
        } else if (game.jugadas === 9) {  
            //funcion deuce que es empate y en deuce voy a tener que llamar a draw para poder ver que es un empate
            cell.style.color = app.profiles[pos].color;
            deuce();
            ganador.innerHTML = "EMPATE";
            //document.querySelector("table").classList.add("nodisp");
            
        }
        else {
            // si  no gano ni empato le doy el turno al otro
           
            
            //game.turno = game.turno === "X" ? "O" : "X";
            if(game.turno === "X"){
                game.turno = "O";
                cell.style.color = app.profiles[0].color;
                
            }else{
                game.turno = "X";
                cell.style.color = app.profiles[1].color;
                
            }
            
           draw();
            
        }
       
    }
 
}

function tirarMoneda() {
    // eleijo un numero aleatorio entre 0 y 1 y como son dos opciones hago 1 sola pregunta para determinar cual es la primera que sale
    return((Math.random() >= 0.5) ? "O" : "X");
}

function won() {
    draw();
   
    document.getElementById("cartel").classList.remove("nodisp");
    game.puedeSeguir = false;
    playAgain();   
}

function deuce() {
    
    document.getElementById("cartel").classList.remove("nodisp");
    draw();
    game.puedeSeguir = false;
    playAgain();   
    
}

function wonHoriz(who) {
    return((game.board[0][0] === who && game.board[0][1] === who && game.board[0][2] === who) ||
       (game.board[1][0] === who && game.board[1][1] === who && game.board[1][2] === who ) ||
       (game.board[2][0] === who && game.board[2][1] === who && game.board[2][2] === who));
}

function wonVert(who) {
    return((game.board[0][0] === who && game.board[1][0] === who && game.board[2][0] === who) ||
       (game.board[0][1] === who && game.board[1][1] === who && game.board[2][1] === who ) ||
       (game.board[0][2] === who && game.board[1][2] === who && game.board[2][2] === who));
}

/*
function wonDiag(who) {
    // si esto sucede gano game.turno o no gano
    return ((game.board[0][0] === who && game.board[1][1] === who && game.board[2][2] === who) || 
    (game.board[0][2] === who && game.board [1][1] === who && game.board[2][0]==who));
}
*/

function wonDiag2(who) {
    return game.board[1][1] === who && 
        (   (game.board[0][0] === who && game.board[2][2] === who)
         || (game.board[0][2] === who && game.board [2][0] === who)
        );
}


function playAgain(){
    
      setTimeout(function(){
        
      document.getElementById("ganador").innerHTML = null;
      document.querySelector("table").classList.remove("nodisp");
      ganador.style.backgroundColor= null;
      
      initGame();

    }, 2000);
    
  }
  