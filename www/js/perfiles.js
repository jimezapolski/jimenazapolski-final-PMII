// variable que va a tener los perfiles de los jugadores 
let profiles;

function loadProfiles() {
    const app = Storage.get("app");
    profiles = app.profiles;
    //profiles.length es el perfil de que usuario estoy cargando (1, 2, 3, ...)
    if(profiles.length === app.players){ // app.perfiles es la parte del objeto de app que tiene la cantidad de perfiles, yo si a futuro en mi app voy a agregar mas jugadores es ahi el que me va a determinar cuantos
        console.info("todos los perfiles ya estan cargados, cargando el menú...")
       window.location = "index.html"; // voy al index cunado son 2
       
    } else { // sino cargo
        console.info("cargando el perfil del jugador " + (profiles.length + 1))
        document.getElementById("btn-save").onclick = () => {
            saveProfile(profiles.length); //guarda el primer usuario / la proxima guarda en la posicion del segundo usuario
        }
    }

}

function saveEditedProfile(pos, editMode = false) { // guarda perfil editado --> editar-perfil.html
    const app = Storage.get("app");
        if (validarDatos(app, pos)) {
            const profile = editMode ? app.profiles[pos] : {};
            profile.name = document.getElementById("name").value;
            profile.nick = document.getElementById("nick").value;
            profile.color = document.getElementById("color").value;
            profile.photo = document.getElementById("photo").src.replace("data:image/jpeg;base64,", "");
            if (!editMode) {
                profile.score = {
                    tateti: 0,
                    generala: 0,
                    misuperjuego: 0,
                    total: 0
                };
            }
            app.profiles[pos] = profile;
            Storage.put("app", app);
            window.location = "perfiles.html";
        }
}

  
function editProfile() {
    const searchParams = new URLSearchParams(window.location.search);
    const pos = parseInt(searchParams.get("profile"));
    const app = Storage.get("app"); // traigo los datos del jugador que estoy editando
   const profile = app.profiles[pos];
   document.getElementById("name").value = profile.name;
   document.getElementById("nick").value = profile.nick;
   document.getElementById("color").value = profile.color;
   document.getElementById("photo").src = "data:image/jpeg;base64," + profile.photo;
  
   document.getElementById("btn-save").setAttribute("onclick", "saveEditedProfile(" + pos + ",true)");
    //console.info("editando el perfil del jugador " + (pos + 1));

}

function saveProfile(pos, editMode = false) {
    const app = Storage.get("app");
        if (validarDatos(app, pos)) {
            const profile = editMode ? app.profiles[pos] : {};
            profile.name = document.getElementById("name").value;
            profile.nick = document.getElementById("nick").value;
            profile.color = document.getElementById("color").value;
            profile.photo = document.getElementById("photo").src.replace("data:image/jpeg;base64,", "");
            if (!editMode) {
                profile.score = {
                    tateti: 0,
                    generala: 0,
                    misuperjuego: 0,
                    total: 0
                };
            }
            app.profiles[pos] = profile;
            Storage.put("app", app);
            window.location = "perfiles.html";
        }
    
        
    }

// funcion de valida que no sea vacio / que nombre no sea mayor a 8 / nick no mayor a 4 / y que la imagen 
function validarDatos(app, who){ //Validar datos del formulario

    let nombre = document.getElementById("name").value;
    if(nombre === ""){
        alert("Tu nombre está vacio");
        return false;
    }

    let nick = document.getElementById("nick").value;
    if(nick === ""){
        alert("Tu apodo está vacio");
        return false;
    }
    if(nick.length > 8){
        alert("Tu apodo solo puede tener 8 letras");
        return false;
    }
    let photo = document.getElementById("photo").src;
    if(photo === "http://localhost:8000/img/user.jpg") {
        alert("Sacate una foto por favor");
        return false;
    }

    
    for (let i = 0; i < app.profiles.length; i++) {
        const nickOtro = app.profiles[i].nick;

        if (nick == nickOtro && who != i) {
            alert("Ese nick ya fue seleccionado!");
            return false;
        }
    }

    let color = document.getElementById("color").value;

    for (let i = 0; i < app.profiles.length; i++) {
        const colorOtro = app.profiles[i].color;

        if (color == colorOtro && who != i) {
            alert("Ese color ya fue seleccionado!");
            return false;
        }
    }


    return true;

}
/* 
function valido(){
    const perfiles = Storage.get("app").profiles;
    let nick = document.getElementById("nick").value;
    let foundNick = false;
    for(let i = 0; !foundNick && i<perfiles.length; i++) {
        foundNick = nick === perfiles[i].nick; 
    } 
    if(foundNick) {
        alert("ese nick ya fue elegido");
        return false;
    }

    let color = document.getElementById("color").value;
    let found = false;
    for(let i = 0; !found && i<perfiles.length; i++) {
        found = color === perfiles[i].color; 
    } 
    if(found) {
        alert("ese color ya fue elegido");
        return false;
    }

    let photo = document.getElementById("photo").src;
    if(photo === "http://localhost:8000/img/usuario.png") {
        alert("Ponete una foto porfa!");
        return false;
    }
    
    return true;

    
    
    /*let color = document.getElementById("color").value;
    if(color === Storage.get("app").profiles[0].color) {
        alert("Ese color ya esta elegido");
        return false;
    }*/
   /* if(Storage.get("app").profiles.length > 1) {
         if(Storage.get("app").profiles[1].color === Storage.get("app").profiles[0].color) {
        alert("Ese color ya esta elegido");
        return false;
    }
    //
    
}
*/
  



function takePicture() {
    navigator.camera.getPicture(imageData => {
        document.getElementById("photo").src = "data:image/jpeg;base64," + imageData;
    }, error => { 
        console.error("No se puede tomar la foto", error);
    },
    {
        destinationType: device.platform === "browser" ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL
    });
}

