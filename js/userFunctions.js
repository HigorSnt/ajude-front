import { $viewer, url, showConfirmView, showFailureView, generateHeader } from "./main.js";
import { User } from "./entities.js";
export { viewUserRegister, viewRequestChangePassword, viewChangePassword }


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

function viewRequestChangePassword() {
    let $headerTemplate = document.querySelector('#header-not-logged-without-search');
    let $template = document.querySelector("#request-change-password");

    $viewer.innerHTML = $headerTemplate.innerHTML + $template.innerHTML;

    let $confirmButton = document.querySelector("#confirm-request");
    $confirmButton.addEventListener('click', fetchRequestChangePassword);
}

function viewChangePassword() {
    let $headerTemplate = document.querySelector('#header-not-logged-without-search');
    let $template = document.querySelector("#change-password");

    $viewer.innerHTML = $headerTemplate.innerHTML + $template.innerHTML;

    let $confirmButton = $viewer.querySelector("#confirm-change");
    $confirmButton.addEventListener('click', fetchChangePassword);
}

async function fetchRequestChangePassword() {
    let $emailInput = document.querySelector("#request-email");
    let email = $emailInput.value;

    if (![""].includes(email)) {
        try {
            let body = `{ "email" : "${email}" }`;
            let token = sessionStorage.getItem('token');

            let header = {
                'Access-Control-Allow-Origin': url + '/forgotPassword',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            };

            let data = await fetch(url + "/forgotPassword", {
                'mode': 'cors',
                'method': 'POST',
                'body': body,
                'headers': header
            });

            if (data.status === 200) {
                showConfirmView("Verifique seu email!");
            } else {
                showFailureView("Ocorreu algum erro durante a solicitação do serviço!");
            }

        } catch (e) {
            console.log(e);
        }
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

async function fetchChangePassword() {
    let $newPassword = document.querySelector("#new-password");
    let $confirmNewPassword = document.querySelector("#confirm-new-password");

    if ($newPassword.value === $confirmNewPassword.value) {

        if (![""].includes($newPassword.value)) {
            try {
                let body = `{ "password" : "${$newPassword.value}" }`;
                let token = location.search.substring(1);

                let header = {
                    'Access-Control-Allow-Origin': url + `/resetPassword/${token}`,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${token}`
                };

                let data = await fetch(url + `/resetPassword/${token}`, {
                    'mode': 'cors',
                    'method': 'POST',
                    'body': body,
                    'headers': header
                });
                /*
                if (data.status === 200) {
                    showConfirmView("Senha alterada!");
                } else {
                    showFailureView("Ocorreu algum erro durante a solicitação do serviço!");
                }*/
                
            } catch (e) {
                console.log(e);
            }
        } else {
            alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
        }
    } else {
        alert("AS SENHAS PRECISAM SER IGUAIS");
    }
}