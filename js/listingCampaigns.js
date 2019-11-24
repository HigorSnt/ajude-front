import {$viewer, url} from './main.js';
import {viewHome} from "./main.js";
export {searchCampaigns};

let data;
async function listingCampaigns(substring) {

    let token = await sessionStorage.getItem('token');

    let header = {
        'Access-Control-Allow-Origin': url + '/campaign/search',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    data = await fetch(url + "/campaign/search/", {
         mode: 'cors',
        'method': 'POST',
        'body': '{"substring": "' + substring + '"}',
        'headers': header
    }).then(r => r.json());

    return data;
}

let  $filterDiv, $list, $campaign;
let campaignsJSON, currentCampaigns;
async function searchCampaigns() {
    let $search = document.querySelector('#input-search');
    let substring = $search.value;

    let campaigns = await Promise.all([listingCampaigns(substring)]);

    removeCampaigns();

    if($filterDiv != undefined) $filterDiv.innerHTML = '';

    if(data[0] === undefined) {
        removeCampaigns();
        viewHome("Nenhuma campanha com esse nome");
    }


    else {
        let $h2 = $viewer.querySelector('#tittle');
        $h2.innerText = "Listagem de Campanhas";
        let campaignsString = JSON.stringify(campaigns);
        campaignsJSON = JSON.parse(campaignsString)[0];
        currentCampaigns = getActiveCampaigns(campaignsJSON);

        $filterDiv = document.createElement('div');
        $filterDiv.id = "filter";
        let $checkbox = document.createElement('input');
        $checkbox.type = 'checkbox';
        $checkbox.name = 'check';
        $checkbox.value = 'todas';
        let $label = document.createElement('p');
        $label.innerText = " Todas as campanhas";
        $filterDiv.appendChild($checkbox);
        $filterDiv.appendChild($label);

        $checkbox.addEventListener('change', () => {
            if (currentCampaigns == campaignsJSON) currentCampaigns = getActiveCampaigns(campaignsJSON);
            else currentCampaigns = campaignsJSON;
            removeCampaigns();
            console.log(campaignsJSON);
            console.log(currentCampaigns);
            console.log(getActiveCampaigns(campaignsJSON));
            showCampaigns(currentCampaigns);
        });

        $list = document.createElement('div');
        $list.id = "list";

        $viewer.appendChild($list);
        $viewer.appendChild($filterDiv);

        showCampaigns(currentCampaigns);
    }
}

function removeCampaigns()
{
    if($list != undefined) $list.innerHTML = '';
}

function showCampaigns(campaigns) {
        campaigns.forEach( c => {
            $campaign = document.createElement('div');
            $campaign.id = "listing";
            $campaign.innerHTML =
                `<h3 id="name">${c.shortName}</h3>
                 <div id="comment">${c.description}</div>
                 <ul id="info">
                    <li>Goal: ${c.goal}</li>
                    <li>Deadline: ${c.deadline}</li>
                    <li>Status: ${c.status}</li>
                    <li> <a href="/campaign/${c.urlIdentifier}">Ver mais</a> </li>
                </ul>`;
            $list.appendChild($campaign);
            $viewer.appendChild($list);
        })
}

function getActiveCampaigns(campaigns) {
    var activedCampaignsArray = [];

    campaigns.forEach((c)=>{
        if(c.status === "A") {
            activedCampaignsArray.push(c);
        }
    })
    return activedCampaignsArray;
}