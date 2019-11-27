import {$viewer, url} from "./main.js";
import {Login} from "./entities.js";
export{viewLogin}

function viewLogin() {
    let $template = document.querySelector('#view-login');
    $viewer.innerHTML = $template.innerHTML;

    let $loginBtn = $viewer.querySelector('.confirm-btn');
    $loginBtn.addEventListener('click', login);
}

function login() {
    let emailInput = document.querySelector("#user-email");
    let passwordInput = document.querySelector("#user-password");

    let values = [emailInput.value, passwordInput.value];

    if (!values.includes("")) {
        let l = new Login(
            values[0],
            values[1]
        );

        emailInput.value = "";
        passwordInput.value = "";

        
        fetchLogin(l);
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

export async function fetchLogin(userCredentials) {
    try {
        let body = JSON.stringify(userCredentials);
        let header = {
            'Content-Type': 'application/json;charset=utf-8'
        };

        let response = await fetch(url + "/auth/login", {
            'method': 'POST',
            'body': body,
            'headers': header
        });

        if (response.status == 200) {
            let json = await response.json();

            sessionStorage.setItem('token', json.token);
            sessionStorage.setItem('userEmail', userCredentials.email);
            sessionStorage.setItem('username', json.username);

            window.setTimeout("location.href = '/'", 0);
        } else {
            alert("DADOS INCORRETOS OU USUÁRIO INEXISTENTE!");
        }
    } catch (error) {
        console.log(error);
    }
}
