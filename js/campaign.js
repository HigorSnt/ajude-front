import {url, $viewer, generateHeader} from "./main.js";

let data;
async function fetch_campaign(campaignUrl) {

    let token = await sessionStorage.getItem('token');
    console.log(url + '/campaign/search' + campaignUrl);
    let header = {
        'Access-Control-Allow-Origin': url + '/campaign/search' + campaignUrl,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    data = await fetch(url + "/campaign/" + campaignUrl, {
        mode: 'cors',
        'method': 'GET',
        'headers': header
    }).then(r => r.json());

    return data;
}

export async function showCampaign(campaignUrl) {

    let response = await Promise.all([fetch_campaign(campaignUrl)]);
    let campaign = JSON.parse(JSON.stringify(response))[0];

    createView(campaign);
}

let $box;

function createView(c) {
    removeViews();
    $box = document.createElement('div');
    console.log(c);
    $box.id = "box";
    $box.innerHTML =
    `<h1>Nome: ${c.shortName}</h1>
    <h2>Status: ${c.status}</h2>
    <ul class="ul-info flex-box" style="justify-content: space-between;">
        <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img src="images/piggy-bank.svg" alt="Meta" width="30px" height="30px" style="margin-right: 0.3em">
            <p>${c.goal}</p>
        </li>
            <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img src="images/calendar.svg" alt="Deadline" width="30px" height="30px" style="margin-right: 0.3em">
            <p>${c.deadline}</p>
        </li>
    </ul>
    <form id="comment-text">
        <textarea rows="4" cols="100" name="comment" id="form" form="comment-text$"></textarea>
    </form>
    </textarea>
`;

    c.comments.forEach(comment=>{
        let $crate = document.createElement('div');
        $crate.id = "comment-box";
        $crate.innerText = comment;
        $box.appendChild($crate);
    })

    $viewer.appendChild($box);
}

function removeViews() {
    $viewer.innerHTML = '';
    generateHeader();
}
