// import User from './user.js';

let url = 'https://apiajude.herokuapp.com/api';

//let $viewer = document.querySelector('#viewer');
let $box = document.querySelector("#box");

// let registerUserBtn = document.querySelector('#register-button');
// registerUserBtn.addEventListener('click', createUser);
//
// function createUser() {
//     let firstNameInput = document.querySelector("#user-first-name");
//     let lastNameInput = document.querySelector("#user-last-name");
//     let emailInput = document.querySelector("#user-email");
//     let creditCardInput = document.querySelector("#user-credit-card");
//     let passwordInput = document.querySelector("#user-password");
//
//     let u = new User(
//         firstNameInput.value,
//         lastNameInput.value,
//         emailInput.value,
//         creditCardInput.value,
//         passwordInput.value
//     );
//
//     firstNameInput.value = "";
//     lastNameInput.value = "";
//     emailInput.value = "";
//     creditCardInput.value = "";
//     passwordInput.value = "";
//
//     registerUser(u);
// }
//
// function showConfirmView() {
//     let $body = document.querySelector('body');
//     let $div = document.createElement('div');
//     let $p = document.createElement('p');
//     let $img = document.createElement('img');
//
//     $div.className = 'opaque-div flex-box';
//     $div.id = 'confirm-view'
//     $p.innerText = "Você agora está cadastrado!";
//     $img.id = 'check-img';
//     $img.src = 'images/check.svg';
//     $img.style.filter = 'invert(100%)';
//
//     $div.appendChild($img);
//     $div.appendChild($p);
//     $body.appendChild($div);
// }
//
// function showFailureView() {
//     let $body = document.querySelector('body');
//     let $div = document.createElement('div');
//     let $p = document.createElement('p');
//     let $img = document.createElement('img');
//
//     $div.className = 'opaque-div flex-box';
//     $div.id = 'confirm-view'
//     $p.innerText = "Opa! Parece que você já está cadastrado...";
//     $img.id = 'check-img';
//     $img.src = 'images/fail.svg';
//     $img.style.filter = 'invert(100%)';
//
//     $div.appendChild($img);
//     $div.appendChild($p);
//     $body.appendChild($div);
// }
//
// async function registerUser(user) {
//     try {
//         let body = JSON.stringify(user);
//         let header = {
//             'Content-Type': 'application/json;charset=utf-8'
//         };
//
//         let response = await fetch(url + '/user', {
//             'method': 'POST',
//             'body': body,
//             'headers': header
//         });
//
//         if (response.status == 201) {
//             showConfirmView();
//         } else if (response.status == 400) {
//             showFailureView();
//         }
//     } catch (e) {
//         console.log(e);
//     }
// }

let $listingCampaignsTemplate, $home;
async function fetch_templates() {
    let listingCampaignsTemplate = await (fetch('/html/listingCampaignsTemplate.html').then(r => r.text()));
    let home = await (fetch('/html/homeTemplate.html').then(r => r.text()));

    let div = document.createElement("div");

    div.innerHTML = listingCampaignsTemplate;
    $listingCampaignsTemplate = div.querySelector('#listing-campaigns');

    div.innerHTML = home;
    $home = div.querySelector('#home');
}

(async function main(){

    await Promise.all([fetch_templates()]);
    let hash = location.hash;

    $box.innerHTML = "";

    if (["","#home"].includes(hash)){
        home();
    }
    else if (["#listagem"].includes(hash)) {
        listingCampaigns();
    }

}());

function home()
{
    $box.innerHTML = $home.innerHTML;
    let $a = document.querySelector('a');
    $a.addEventListener('click', listingCampaigns);
}

function listingCampaigns()
{
    $box.innerHTML = $listingCampaignsTemplate.innerHTML;
    let $a = document.querySelector('a');
    $a.addEventListener('click', home);
}
