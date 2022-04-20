/* paso 1: abrir la consola gitbash y dirigirme a la carpeta master jwt-example-desafio latam */
/* paso 2: reconstruir la carpeta node module utilizando gitbash y el comando: npm install (se creara la carpeta node_modules) */
/* paso 3: levanto la configuracion del archivo index.js para que active el puerto escribiendo el comando: node index.js */
/* paso 4: cortar la ejecucion del codigo con las teclas CTRL + C */
/* paso 5: en la consola de gitbash levanto los servicios de nodemosn, para ello debo escribir el comando: npm run watch */
/* paso 6: abro cualquier navegador y voy a la url http://localhost:3000/desafio-instafake/ */
/* paso 7: comienzo a programar */

/* creo las variables que necesitare del index.html. */
const formLogin = document.querySelector('#formLoginInsta');
const btnCerrar = document.querySelector('#btnCerrar');
const btnMostrarMas = document.querySelector('#btnMostrarMas');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');

/* creo un contador para ir sumando las demas imagenes que se agregen con el boton "Ver mas". */
var contadorDeFotos = 1;

/* evento submit que se activa al presionar el botón entrar. */
/* como debo utilizar validarUsuario() y es una promesa, debo declararla utilizando el await. */
/* y como regla extra tambien debo agregar async antes del callback. */
formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = await validarUsuario(txtEmail.value, txtPassword.value);
    
    obtenerFotografias(token);
    limpiarFormulario();
});


const validarUsuario = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ 
                
                /* el primer "email" es el título del atributo de una de las propiedades de la DB user.json */
                /* el segundo "email" es el parámetro que declare en esta función. */
                /* es lo mismo con password. */
                    email: email, 
                    password: password 
                })
            })
        
        /* Un token es un código alfanumérico que tiene caracteres tanto mayúsculas como minúsculas. */
        const { token } = await response.json();

        /* el token queda almacenado en el localStorage o sessionStorage en el navegador. */
        /* en cada petición http que hagamos a nuestro servidor viajará en las cabeceras (header) */
        /* el método setItem() recibe una clave y un valor, añadirá estos al Storage, o actualizará el valor si la clave ya existe. */
        /* el formato para declararlo es: storage.setItem(keyName, keyValue) */
        localStorage.setItem('llaveJwt', token);
        
        /* condición if para comprobar si el valor de token es distinto de "null" o "undefined". */
        /* creo una sentencia if para comprobar si la variable token trae algún valor o si viene vacía. */
        /* si el email y password son correctos retorna el valor de token, si es incorrecto o esta vacio, retorna un mensaje. */
        if (token) {
            return token;
        } else {
            alert('Error al verificar los datos. Vuelva a ingresar su email y password.');
        }

    } catch (error) {
        console.error(error);
    }
};


const obtenerFotografias = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/photos?page=${contadorDeFotos}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            })
        
        /* toda función fetch retorna una promesa, así que debo crear una nueva constante para pasarle la respuesta como json. */
        /* debo utilizar la palabra "data" para que funcione, si uso otro nombre puede dar error o no compilar. */
        const { data } = await response.json();
        
        /* condición if para comprobar si el valor de data es distinto de "null" o "undefined". */
        /* si la condición es correcta, le paso "data" a la función construirCard. Sino imprimo un mensaje de error. */
        if (data) {
            construirCard(data);
        } else {
            console.log('Error al tratar de imprimir las fotografias.');
        }

    } catch (error) {
        console.error(error);
    }
};


const construirCard = (data) => {

    /* creo un nuevo arreglo y utilizo slice() para imprimir de a UNA imagen a la vez en el index. */
    /* si cambio el segundo valor por otro número, aparecerán mas imágenes en el index. */
    /* el método slice() devuelve una copia de una parte del array dentro de un nuevo array empezando por inicio hasta fin. El array original no se modificará */
    /* el formato para declararlo es: arr.slice(inicio , fin) */
    nuevoArreglo = data.slice(0, 1);
    
    /* utilizando las clases de bootstrap, hago un cambio a la clase del formulario para que desaparesca con d-none. */
    formLogin.className = "col-md-6 d-none";
    
    nuevoArreglo.forEach(elemento => {
        document.getElementById('cardImagenes').innerHTML += `
            <div class="card mt-3 mb-4">
                <img src="${elemento.download_url}" class="card-img-top">
                <div class="card-body">
                    <p class="card-text">Autor: ${elemento.author}</p>
                </div>
            </div>`;
    });

    /* utilizando las clases de bootstrap, hago un cambio a la clase de la sección de fotografías para que sea visible cambiándole d-none por d-block. */
    document.getElementById("contenedorSeccionImagenes").className = "col-md-8 mt-3 d-block";
};


const limpiarFormulario = () => {
    txtEmail.value = "";
    txtPassword.value = "";
};


btnCerrar.addEventListener('click', () => {
    
    //clear() método que al invocarlo, elimina todos los registros del almacén local.
    localStorage.clear();

    //reload() método que carga de nuevo la URL actual, como lo hace el botón de Refresh de los navegadores.
    location.reload();
});


btnMostrarMas.addEventListener('click', () => {

    /* creo un nuevo token al cual le asigno el valor de llaveJwt que estoy liberando para su uso en validarUsuario() */
    const token = localStorage.getItem('llaveJwt');
    if (token) {
        /* si token tiene un valor diferente a "null o undefined", le sumo 1 al contadorDeFotos. */
        /* llamo a la funcion para imprimir una nueva fotografia. */
        contadorDeFotos++;
        obtenerFotografias(token);
    }
});