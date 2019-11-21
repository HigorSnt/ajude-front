import User from './user.js';

let url = 'https://apiajude.herokuapp.com/api';

let registerUserBtn = document.querySelector('#register-button');
registerUserBtn.addEventListener('click', createUser);

function createUser() {
    let firstNameInput = document.querySelector("#user-first-name");
    let lastNameInput = document.querySelector("#user-last-name");
    let emailInput = document.querySelector("#user-email");
    let creditCardInput = document.querySelector("#user-credit-card");
    let passwordInput = document.querySelector("#user-password");

    let u = new User(
        firstNameInput.value,
        lastNameInput.value,
        emailInput.value,
        creditCardInput.value,
        passwordInput.value
    );

    firstNameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";
    creditCardInput.value = "";
    passwordInput.value = "";

    registerUser(u);
}

function showConfirmView() {
    let $body = document.querySelector('body');
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box';
    $div.id = 'confirm-view'
    $p.innerText = "Você agora está cadastrado!";
    $img.id = 'check-img';
    $img.src = 'images/check.svg';
    $img.style.filter = 'invert(100%)';

    $div.appendChild($img);
    $div.appendChild($p);
    $body.appendChild($div);

}

async function registerUser(user) {
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

        let json = await response.json();
        if (json.status == 201) {
            showConfirmView();
        } else if (json.status == 400) {
            console.log('deu ruim');
        }
    } catch (e) {
        console.log(e);
    }
}