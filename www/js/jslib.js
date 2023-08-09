// metodos utilitarios -- ejemplo elegir un numero aleatorios // funciones que se reutilizan 

// me va a abstraer las llamadas al local storage 
const Storage = {
    put: (key, obj) => {
        // para agregar informacion = 2 parametros
        localStorage.setItem(key, JSON.stringify(obj));
    },
    // 
    get: key => {
        // get item devuelve el string almacenado el key almacenado en el local storage // json.parse de null tira error por eso no puedo hacer return de 1   --> entonces lo guardo en un lugar y por eso si es null devuelvo null sino devuelvo el parametro 
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : null;
    },
    del: key => {
        // borra 1 objeto del local storage 
        localStorage.removeItem(key);
    },
    // para borrar toodo lo que tenia guardado - en el emulador es borrar todo lo que habia guardado 
    kill: () => {
        localStorage.clear();
    }
};


