// para crear la tabla
const GAME_NAMES = ["Ta-Te-Ti", "Generala", "El 10 MIL", "TOTAL"];
//traigo el storage
const app = Storage.get("app");

function cargarUsuarios() {
    // Dibujar el encabezado (thead)
        const thead = document.querySelector("#scores thead");
        thead.innerHTML = null;
        const tr = document.createElement("tr");
        const thGames = document.createElement("th");
        thGames.appendChild(document.createTextNode("Juegos"));
        tr.appendChild(thGames);
        for (let player = 0; player < app.players; player++) {
            const thPlayer = document.createElement("th");
            thPlayer.appendChild(document.createTextNode(app.profiles[player].nick));
            thPlayer.style.color = app.profiles[player].color;

            tr.appendChild(thPlayer);
        }
        thead.appendChild(tr);
        // Dibujar el cuerpo (tbody)
        const tbody = document.querySelector("#scores tbody");
        tbody.innerHTML = null;
        
        for (let row = 0; row < GAME_NAMES.length; row++) { 
            const tr = document.createElement("tr");
            const thGame = document.createElement("td");
            thGame.appendChild(document.createTextNode(GAME_NAMES[row]));
            tr.appendChild(thGame);
            for (let player = 0; player < 2; player++) {
                const tdPlayer = document.createElement("td");
                const playerScore = [
                    app.profiles[player].score.tateti,
                    app.profiles[player].score.generala,
                    app.profiles[player].score.misuperjuego,
                   (app.profiles[player].score.tateti + app.profiles[player].score.generala + app.profiles[player].score.misuperjuego)
                ];
                tdPlayer.style.color = app.profiles[player].color;
                tdPlayer.appendChild(document.createTextNode(playerScore[row]));
                tr.appendChild(tdPlayer);
            }
            tbody.appendChild(tr);
        }
    }