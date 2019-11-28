import { $viewer, url, generateHeader, viewCampaign, viewHasNoPermission, searchListener } from './main.js';
export { searchCampaigns, campaignURL };

let data;
async function listingCampaigns(substring) {
    let token = sessionStorage.getItem('token');

    if (token !== null && token !== undefined) {
        let header = {
            'Access-Control-Allow-Origin': `${url}/campaign/search`,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${token}`
        };

        data = await fetch(`${url}/campaign/search`, {
            mode: 'cors',
            'method': 'POST',
            'body': `{"substring": "${substring}"}`,
            'headers': header
        }).then(r => r.json());

        return data;
    } else {
        viewHasNoPermission();
    }
}

let $filterDiv, $list, $campaign;
let campaignsJSON, currentCampaigns, campaignURL;
async function searchCampaigns() {
    let $search = document.querySelector('#input-search');
    let substring = $search.value;

    let campaigns = await Promise.all([listingCampaigns(substring)]);

    if (campaigns[0] !== undefined) {
        removeCampaigns();
        generateHeader();
        searchListener();
        if (data[0] === undefined) {
            let $h2 = document.createElement('h2');
            $h2.id = "tittle";
            $h2.innerText = `A busca por ${substring} não resultou em nenhuma campanha!`;
            $viewer.appendChild($h2);
        } else {
            let campaignsString = JSON.stringify(campaigns);
            campaignsJSON = JSON.parse(campaignsString)[0];
    
            currentCampaigns = getActiveCampaigns(campaignsJSON);
    
            $filterDiv = document.createElement('div');
            $filterDiv.id = "filter";
            $filterDiv.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-column";
            let $checkbox = document.createElement('input');
            $checkbox.type = 'checkbox';
            $checkbox.name = 'check';
            $checkbox.value = 'todas';
            let $label = document.createElement('p');
            $label.innerText = " Todas as campanhas";
            $filterDiv.appendChild($checkbox);
            $filterDiv.appendChild($label);
            $filterDiv.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-row";
    
            $checkbox.addEventListener('change', () => {
                if (currentCampaigns === campaignsJSON) currentCampaigns = getActiveCampaigns(campaignsJSON);
                else currentCampaigns = campaignsJSON;
                removeCampaigns();
                showCampaigns(currentCampaigns);
            });
    
            $list = document.createElement('div');
            $list.id = "list-campaigns";
            $list.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-column";
    
            let $h5 = document.createElement('h5');
            $h5.innerText = `A busca por ${substring} retornou os seguintes resultados:`;
            $h5.id = 'inform';
            $h5.className = 'flex-box flex-box-justify-center flex-box-align-center';
    
            $viewer.appendChild($h5);
            $viewer.appendChild($filterDiv);
            $viewer.appendChild($list);
    
            showCampaigns(currentCampaigns);
        }
    }
}

/*
let $filterDiv, $list, $campaign;
let campaignsJSON, currentCampaigns, campaignURL;
async function searchCampaigns() {
    let $search = document.querySelector('#input-search');
    let substring = $search.value;

    let campaigns = await listingCampaigns(substring);

    removeCampaigns();
    generateHeader();
    searchListener();
    if (campaigns === []) {
        let $h2 = document.createElement('h2');
        $h2.id = "tittle";
        $h2.innerText = `A busca por ${substring} não resultou em nenhuma campanha!`;
        $viewer.appendChild($h2);
    } else {

        currentCampaigns = getActiveCampaigns(campaigns);

        $filterDiv = document.createElement('div');
        $filterDiv.id = "filter";
        $filterDiv.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-column";
        let $checkbox = document.createElement('input');
        $checkbox.type = 'checkbox';
        $checkbox.name = 'check';
        $checkbox.value = 'todas';
        let $label = document.createElement('p');
        $label.innerText = " Todas as campanhas";
        $filterDiv.appendChild($checkbox);
        $filterDiv.appendChild($label);
        $filterDiv.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-row";

        $checkbox.addEventListener('change', () => {
            if (currentCampaigns === campaigns) currentCampaigns = getActiveCampaigns(campaigns);
            else currentCampaigns = campaigns;
            removeCampaigns();
            showCampaigns(currentCampaigns);
        });

        $list = document.createElement('div');
        $list.id = "list-campaigns";
        $list.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-column";

        let $h5 = document.createElement('h5');
        $h5.innerText = `A busca por ${substring} retornou os seguintes resultados:`;
        $h5.id = 'inform';
        $h5.className = 'flex-box flex-box-justify-center flex-box-align-center';

        $viewer.appendChild($h5);
        $viewer.appendChild($filterDiv);
        $viewer.appendChild($list);

        showCampaigns(currentCampaigns);
    }

}*/

function removeCampaigns() {
    if (document.querySelector('#infom') != undefined) document.querySelector('#infom').innerHTML = '';
    if ($list != undefined) $list.innerHTML = '';
}

function showCampaigns(campaigns) {
    campaigns.forEach(c => {
        $campaign = document.createElement('div');
        $campaign.id = "listing";
        $campaign.className = "flex-box flex-box-justify-center flex-box-align-center flex-box-column";
        $campaign.innerHTML =
            `<h3 id="name" style="margin: 0.5em; text-align: center;">${c.shortName.toUpperCase()}</h3>
            <div class="campaign-description">${c.description}</div>
                <ul class="ul-info flex-box" style="justify-content: space-between; flex-wrap: wrap">
                    <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                        <img src="images/piggy-bank.svg" title="Meta" width="30px" height="30px" style="margin-right: 0.3em">
                        <p></strong>${c.received}/${c.goal}</strong></p>
                    </li>
                    <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                        <img src="images/calendar.svg" title="Deadline" width="30px" height="30px" style="margin-right: 0.3em">
                        <p></strong>${c.deadline}</strong></p>
                    </li>
                    </li>
                    <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                        <img id="img-like" class="img-inverter" src="images/heart.svg" title="Likes" width="30px" height="30px" style="margin-right: 0.3em">
                        <p><strong id ="like">${c.numLikes}</strong></p>
                    </li>
                    </li>
                        <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                        <img id="img-dislike" class="img-inverter" src="images/broken-heart.svg" title="Dislikes" width="35px" height="35px" style="margin-right: 0.3em">
                        <p><strong id ="dislike">${c.numDislikes}</strong></p>
                    </li>
                    <li> 
                        <a href="#campaign/${c.urlIdentifier}" >Ver mais</a> 
                    </li>
                </ul>
            </div>`;
        $list.appendChild($campaign);
    })
}

window.goToCampaign = goToCampaign;
function goToCampaign(url) {
    removeCampaigns();
    viewCampaign(url);
}

function getActiveCampaigns(campaigns) {
    var activedCampaignsArray = [];

    campaigns.forEach((c) => {
        if (c.status === "A") {
            activedCampaignsArray.push(c);
        }
    });

    return activedCampaignsArray;
}
