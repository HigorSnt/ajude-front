import {viewLogin} from './login.js'
import {viewUserRegister} from './registerUser.js'
import {viewCampaignRegister} from "./registerCampaign.js";
import {searchCampaigns} from "./listingCampaigns.js";
export {$viewer, url, viewHome};

let url = 'https://apiajude.herokuapp.com/api';
let $viewer = document.querySelector('#viewer');

window.onload = viewerChange;
window.addEventListener('hashchange', viewerChange);

let $loggedTemplate, $unloggedTemplate;
async function fetch_login_templates() {
    let unlogged = await fetch('/html/navUnloggedUser.html').then(r => r.text());
    let logged = await (fetch('/html/navLoggedUser.html').then(r => r.text()));

    let div = document.createElement("div");

    div.innerHTML = logged;
    $loggedTemplate = div.querySelector("#logged-menu");

    div.innerHTML = unlogged;
    $unloggedTemplate = div.querySelector("#menu");
}

async function viewerChange() {
    let hash = location.hash;

    if ([''].includes(hash)) {
        await Promise.all([fetch_login_templates()]);
        viewHome("Listagem de Campanhas");
    } else if (['#user-register'].includes(hash)) {
        viewUserRegister();
    } else if (['#login'].includes(hash)) {
        viewLogin();
    } else if (['#campaign-register'].includes(hash)) {
        viewCampaignRegister();
    } else if (['#logout'].includes(hash)) {
        logout();
    }
}

function viewHome(tittle) {

    let $nav = document.querySelector('#nav');
    let $searchBtn = document.querySelector('#search-btn');

    if (sessionStorage === undefined || sessionStorage.getItem('token') == null) {
        $nav.innerHTML = $unloggedTemplate.innerHTML;
    } else {
        $nav.innerHTML = $loggedTemplate.innerHTML;
    }

    let $h2 = $viewer.querySelector('#tittle');
    $h2.innerText = tittle;
    $searchBtn.addEventListener('click', searchCampaigns);
}

export function showConfirmView(message) {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = message;
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/check.svg';
    $img.style.filter = 'invert(100%)';

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 500);
}

export function showFailureView(message) {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = message;
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/fail.svg';
    $img.style.filter = 'invert(100%)';

    let $template = document.querySelector('#header');
    $viewer.innerHTML = $div.innerHTML;

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 500);
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');

    window.setTimeout("location.href = '/'", 0);
}


