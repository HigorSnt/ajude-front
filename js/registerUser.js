import {$viewer, url, showConfirmView, showFailureView} from "./main.js";
import {User} from "./entities.js";
export {viewUserRegister}


async function fetchRegisterUser(user) {
    try {
        let body = JSON.stringify(user);
        let header = {
            'Content-Type': 'application/json;charset=utf-8'
        };

        let response = await fetch(url + '/user', {
            'method': 'POST',
            'body': body,
            'headers': header
        });

        if (response.status == 201) {
            showConfirmView("Você agora está cadastrado!");
        } else if (response.status == 400) {
            showFailureView('Opa! Parece que você já está cadastrado...');
        }
    } catch (e) {
        console.log(e);
    }
}

function viewUserRegister() {
    let $template = document.querySelector('#view-user-register');
    $viewer.innerHTML = $template.innerHTML;

    let $registerUserBtn = document.querySelector('.confirm-btn');
    $registerUserBtn.addEventListener('click', createUser);
}

function createUser() {
    let firstNameInput = document.querySelector("#user-first-name");
    let lastNameInput = document.querySelector("#user-last-name");
    let emailInput = document.querySelector("#user-email");
    let creditCardInput = document.querySelector("#user-credit-card");
    let passwordInput = document.querySelector("#user-password");

    let values = [firstNameInput.value, lastNameInput.value, emailInput.value, creditCardInput.value, passwordInput.value];

    if (!values.includes("")) {
        let u = new User(
            values[0],
            values[1],
            values[2],
            values[3],
            values[4]
        );

        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
        creditCardInput.value = "";
        passwordInput.value = "";

        fetchRegisterUser(u);
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}
