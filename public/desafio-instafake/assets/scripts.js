
const formLogin = document.querySelector('#formLoginInsta');
const btnCerrar = document.querySelector('#btnCerrar');
const btnMostrarMas = document.querySelector('#btnMostrarMas');
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');

var contadorDeFotos = 1;


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
                    email: email, 
                    password: password 
                })
            })
        
        const { token } = await response.json();

        localStorage.setItem('llaveJwt', token);
        
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
        
        const { data } = await response.json();

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

    nuevoArreglo = data.slice(0, 1);
    
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

    document.getElementById("contenedorSeccionImagenes").className = "col-md-8 mt-3 d-block";
};


const limpiarFormulario = () => {
    txtEmail.value = "";
    txtPassword.value = "";
};


btnCerrar.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});


btnMostrarMas.addEventListener('click', () => {
    const token = localStorage.getItem('llaveJwt');
    if (token) {
        contadorDeFotos++;
        obtenerFotografias(token);
    }
});