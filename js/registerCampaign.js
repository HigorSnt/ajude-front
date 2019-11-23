import {Campaign} from "./entities.js";
import {$viewer, url, showFailureView, showConfirmView} from "./main.js";
export {viewCampaignRegister}

async function fetchRegisterCampaign(campaign) {
    try {
        let body = JSON.stringify(campaign);
        let header = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + sessionStorage.getItem("token")
        }

        let response = await fetch(url + '/campaign/register', {
            'method': 'POST',
            'body': body,
            'headers': header,
        });

        if (response.status == 201) {
            showConfirmView("Campanha Cadastrada com sucesso")
            // TODO Link pra acessar a campanha

        } else if (response.status == 400) {
            showFailureView("Erro ao cadastrar campanha");
        }

    } catch (e) {
        console.log(e);
    }
}

function viewCampaignRegister() {

    if (sessionStorage.getItem('token') != null) {
        let $template = document.querySelector('#view-campaign-register');
        $viewer.innerHTML = $template.innerHTML;

        let $registerCampaignBtn = document.querySelector('.confirm-btn');
        $registerCampaignBtn.addEventListener('click', registerCampaign);
    } else {
        viewHasNoPermission();
    }
}

function registerCampaign() {
    let shortNameInput = document.querySelector("#campaign-short-name");
    let descriptionInput = document.querySelector("#campaign-description");
    let deadlineInput = document.querySelector("#campaign-deadline");
    let goalInput = document.querySelector("#campaign-goal");

    let values = [shortNameInput.value, descriptionInput.value, deadlineInput.value, goalInput.value];

    if (!values.includes("")) {
        let urlIdentifier = genereteUrlIdentifier(shortNameInput.value);
        let deadline = normalizeDate(deadlineInput.value)
        let c = new Campaign(
            values[0],
            urlIdentifier,
            values[1],
            deadline,
            values[3]
        );

        /*shortNameInput.value = "";
        descriptionInput.value = "";
        deadlineInput.value = "";
        goalInput.value = "";
        */
        fetchRegisterCampaign(c);
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

function genereteUrlIdentifier(shortName) {
    let urlIdentifier = shortName.toLowerCase();
    urlIdentifier = urlIdentifier.normalize('NFD').replace(/[^0-9a-zA-Z\u0300-\u036f]/g, ' ');
    urlIdentifier = urlIdentifier.replace(/  +/g, ' ');
    urlIdentifier = urlIdentifier.trim();
    urlIdentifier = urlIdentifier.replace(/ /g, "-");
    urlIdentifier = urlIdentifier.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return urlIdentifier;
}

function normalizeDate(date) {
    let l = date.split('-');
    return l[2] + '-' + l[1] + '-' + l[0];
}

function viewHasNoPermission() {
    let $body = document.querySelector('body');
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

    let $template = document.querySelector('#header-not-user-logged');
    $viewer.innerHTML = $template.innerHTML;
    let $iptSearchCampaigns = $viewer.querySelector('#search-campaigns');
    let $header = document.querySelector('header');
    $header.removeChild($iptSearchCampaigns);

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);
}
