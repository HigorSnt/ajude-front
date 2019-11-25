import {viewLogin} from './login.js'
import {viewUserRegister, viewRequestChangePassword, viewChangePassword} from './userFunctions.js'
import {viewCampaignRegister} from "./registerCampaign.js";
import {searchCampaigns} from "./listingCampaigns.js";
import {showCampaign} from "./campaign.js"
export {$viewer, url, viewerChange, viewHome, viewCampaign};

let url = 'https://apiajude.herokuapp.com/api';
let $viewer = document.querySelector('#viewer');

window.onload = viewerChange;
window.addEventListener('hashchange', viewerChange);

async function viewerChange() {
    let campaignURL = window.location.hash.substring(9);
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
    } else if(['#campaign' + campaignURL].includes(hash)){
        viewCampaign(campaignURL);
    }
}

function viewHome() {
    generateHeader();
}

export function showConfirmView(message) {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');
    let $headerTemplate = document.querySelector('#header-not-logged-without-search');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = message;
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/check.svg';
    $img.className = 'img-inverter';

    $viewer.innerHTML = $headerTemplate.innerHTML;
    let $searchBtn = $viewer.querySelector("#search-btn");
    if ($viewer.querySelector('#search-btn') !== null) {
        $searchBtn.addEventListener('click', function (event) {
            viewHasNoPermission();
            event.preventDefault();
        });
    }

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 1000);
}

export function showFailureView(message) {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');
    let $headerTemplate = document.querySelector('#header-not-logged-without-search');
    //let $headerTemplate = getHeaderTemplate();

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = message;
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/fail.svg';
    $img.className = 'img-inverter';

    $viewer.innerHTML = $headerTemplate.innerHTML;
    let $searchBtn = $viewer.querySelector("#search-btn");
    if ($viewer.querySelector('#search-btn') !== null) {
        $searchBtn.addEventListener('click', function (event) {
            viewHasNoPermission();
            event.preventDefault();
        });
    }

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
    let $headerTemplate = document.querySelector('#header-not-logged');
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = "É necessário realizar login para ter acesso à esse conteúdo...";
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/crying-face.svg';
    $img.className = 'img-inverter';

    $viewer.innerHTML = $headerTemplate.innerHTML;
    let $searchBtn = $viewer.querySelector("#search-btn");

    if ($viewer.querySelector('#search-btn') !== null) {
        $searchBtn.addEventListener('click', function (event) {
            viewHasNoPermission();
            event.preventDefault();
        });
    }

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);
}

export function generateHeader() {
    let $headerTemplate;

    if (sessionStorage.getItem('token') == null) {
        $headerTemplate = document.querySelector("#header-not-logged");
        $viewer.innerHTML = $headerTemplate.innerHTML;
        let $searchBtn = $viewer.querySelector("#search-btn");
        $searchBtn.addEventListener('click', function (event) {
            viewHasNoPermission();
            event.preventDefault();
        });
    } else {
        $headerTemplate = document.querySelector("#header-user-logged");
        $viewer.innerHTML = $headerTemplate.innerHTML;
        searchListener();
    }
}

function viewCampaign(url) {
    generateHeader()
    showCampaign(url);
}

export function searchListener() {
    let $searchBtn = $viewer.querySelector("#search-btn");
    let $searchInput = $viewer.querySelector("#input-search");
    console.log($searchInput.value);
    $searchBtn.addEventListener('click', (event) => {
        window.location.hash = '';
        searchCampaigns($searchInput.value);
        event.preventDefault();
    });
}
