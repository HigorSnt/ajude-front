import {viewLogin} from './login.js'
import {viewUserRegister, viewRequestChangePassword, viewChangePassword} from './userFunctions.js'
import {viewCampaignRegister} from "./registerCampaign.js";
import {searchCampaigns} from "./listingCampaigns.js";
export {$viewer, url, viewHome};

let url = 'https://apiajude.herokuapp.com/api';
let $viewer = document.querySelector('#viewer');

window.onload = viewerChange;
window.addEventListener('hashchange', viewerChange);

async function viewerChange() {
    let hash = location.hash;

    if ([''].includes(hash)) {
        viewHome("Listagem de Campanhas");
    } else if (['#user-register'].includes(hash)) {
        viewUserRegister();
    } else if (['#login'].includes(hash)) {
        viewLogin();
    } else if (['#campaign-register'].includes(hash)) {
        viewCampaignRegister();
    } else if (['#logout'].includes(hash)) {
        logout();
    } else if (['#search'].includes(hash)) {
        searchCampaigns();
    } else if (['#reset-password'].includes(hash)) {
        viewChangePassword();
    } else if (['#request-change-password'].includes(hash)) {
        viewRequestChangePassword();
    }
}

function viewHome(tittle) {
    let $headerTemplate;
    let $h2 = document.createElement('h2');
    $h2.id = "tittle";
    $h2.innerText = tittle;
    
    if (sessionStorage.getItem('token') == null) {
        $headerTemplate = document.querySelector("#header-not-logged-without-search");
        $viewer.innerHTML = $headerTemplate.innerHTML;
    } else {
        $headerTemplate = document.querySelector("#header-user-logged");
        $viewer.innerHTML = $headerTemplate.innerHTML;
        let $searchBtn = $viewer.querySelector("#search-btn");
        $searchBtn.href = "/#search";
    }

    $viewer.appendChild($h2);
}

export function showConfirmView(message) {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');
    let $headerTemplate = getHeaderTemplate();

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = message;
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/check.svg';
    $img.style.filter = 'invert(100%)';

    $viewer.innerHTML = $headerTemplate.innerHTML;

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 1000);
}

export function showFailureView(message) {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');
    let $headerTemplate = getHeaderTemplate();

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = message;
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/fail.svg';
    $img.style.filter = 'invert(100%)';

    $viewer.innerHTML = $headerTemplate.innerHTML;

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 800);
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');

    window.setTimeout("location.href = '/'", 0);
}

export function viewHasNoPermission() {
    let $headerTemplate = document.querySelector('#header-not-logged-without-search');
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = "É necessário realizar login para ter acesso à esse conteúdo...";
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/crying-face.svg';
    $img.style.filter = 'invert(100%)';

    $viewer.innerHTML = $headerTemplate.innerHTML;

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);
}

export function getHeaderTemplate() {
    let template;

    if (sessionStorage.getItem('token') == null) {
        template = document.querySelector('#header-not-logged-without-search');
    } else {
        template = document.querySelector('#header-user-logged');
    }

    return template;
}