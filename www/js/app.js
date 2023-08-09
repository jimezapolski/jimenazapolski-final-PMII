function initApp() {
   // let exists = true; 
    const app = Storage.get("app");

    if(app === null) {
       // exists = false;
        Storage.put("app", {profiles: [], players: 2 });
        window.location = "perfiles.html";
       // value = Storage.get("app"); // para mostrarlo lo tengo que volver a leer, por eso me tengo que asegurar que no es null
    } else {
        //ya tengo app cargada entonces tengo los perfiles y puedo generar los opcions del input de select de index
        const sel = document.getElementById("perfil");
        let  opt0 = document.createElement("option");
        opt0.appendChild(document.createTextNode("..."));
        opt0.setAttribute("value", "-1");
        sel.appendChild(opt0);
        app.profiles.forEach((profile, i) => {
            const opt = document.createElement("option");
            opt.setAttribute("value",i);
            opt.appendChild(document.createTextNode(profile.name));
            sel.appendChild(opt);
;        });
    }
    // muestro objeto en el html, y si lo acaba de cargar --> dice valor nuevo 
    // sino value mo va a ser null y va a funcionar y todo va a ser verdadero 
    // la primera vez dice valor nuevo / la segunda que ejecutes y siguientes: valor existente y el objeto
  //  document.getElementById("value").innerHTML = (exists ? "Valor existente " : "Valor nuevo:") + JSON.stringify(value);
}


function editProfile() {
    window.location = "editar-perfil.html?profile=" + document.getElementById("perfil").value;
}

function reset() {
    Storage.kill();
    initApp();
}