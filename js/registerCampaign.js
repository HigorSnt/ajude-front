import {Campaign} from "./entities.js";
import {$viewer, url, showFailureView, showConfirmView, 
    viewHasNoPermission, viewCampaign, viewerChange} from "./main.js";

async function fetchRegisterCampaign(campaign) {
    try {
        let body = JSON.stringify(campaign);
        let token = await sessionStorage.getItem('token');

        let header = {
            'Access-Control-Allow-Origin': url + '/campaign/register',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${token}`
        }

        let response = await fetch(url + '/campaign/register', {
             mode: 'cors',
            'method': 'POST',
            'body': body,
            'headers': header,
        });

        if (response.status == 201) {
            
            response.json().then(data => ({
                data: data
            })).then(res => {
                //href = "#campaign/${res.data.urlIdentifier}"
                window.location.hash = "campaign/" + res.data.urlIdentifier;
                //viewCampaign(res.data.urlIdentifier);
                viewerChange();
            });

        } else if (response.status == 400) {
            console.log(response);
            showFailureView("Erro ao cadastrar campanha");
        }

    } catch (e) {
        console.log(e);
    }
}

export function viewCampaignRegister() {

    if (sessionStorage.getItem('token') != null) {
        let $headerTemplate = document.querySelector("#header-user-logged");
        let $template = document.querySelector('#view-campaign-register');
        $viewer.innerHTML = $headerTemplate.innerHTML + $template.innerHTML;
        let $div = document.querySelector('#search-campaigns');
        let $header = document.querySelector('header');
        $header.removeChild($div);

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
        let deadline = (deadlineInput.value) + " 23:59:59";
        let c = new Campaign(
            values[0],
            urlIdentifier,
            values[1],
            deadline,
            values[3]
        );

        shortNameInput.value = "";
        descriptionInput.value = "";
        deadlineInput.value = "";
        goalInput.value = "";
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
