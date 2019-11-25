import {url, $viewer, generateHeader} from "./main.js";

let data;
async function fetch_campaign(campaignUrl) {

    let token = await sessionStorage.getItem('token');
    
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
    
    let status;
    console.log(c);

    if (c.status === 'A') {
        status = "Esta campanha está ativa!";
    } else if (c.status === 'F') {
        //
    }

    $box.id = "box";
    $viewer.className = 'flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $box.className = 'flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $box.innerHTML =
    `<h1>${c.shortName}</h1>
    <h4>Status: ${status}</h4>
    <div id="comment">
        <h4 style="text-align:center; padding-bottom: 0.5em">Uma breve descrição desta campanha:</h4>
        <p>${c.description}</p>
    </div>
    <ul class="ul-info flex-box" style="justify-content: space-between;">
        <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img src="images/piggy-bank.svg" class="img-inverter" alt="Meta" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong>${c.goal}</strong></p>
        </li>
            <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img src="images/calendar.svg" class="img-inverter" alt="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong>${c.deadline}</strong></p>
        </li>
        </li>
            <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="img-like" class="img-inverter" src="images/heart.svg" alt="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong id ="like">${c.numLikes}</strong></p>
        </li>
        </li>
            <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="img-dislike" class="img-inverter" src="images/broken-heart.svg" alt="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong id ="dislike">${c.numDislikes}</strong></p>
        </li>
    </ul>
    <div id="comment-text" class="flex-box flex-box-justify-center flex-box-align-center flex-box-column">
        <textarea rows="3" cols="100" name="comment" id="form" form="comment-text$" placeholder="Deixe um comentário aqui..."></textarea>
        <button type="submit" id="comment-btn" width="1.5em" height="1.5em">Comentar</button>
    </div>
    <button id="donate">Fazer doação</button>
    </textarea>`;

    c.comments.forEach(comment=>{
        let $crate = document.createElement('div');
        $crate.class = "comment-box";
        $crate.innerText = comment;
        $box.appendChild($crate);
    })

    $viewer.appendChild($box);

    let $likeButton = document.querySelector("#img-like");
    $likeButton.addEventListener('click', ()=>{
        addLike();
    });

    let $dislikeButton = document.querySelector("#img-dislike");
    $dislikeButton.addEventListener('click', ()=>{
        addDislike();
    });

    let $commentBtn = document.querySelector('#comment-btn');
    $commentBtn.addEventListener('click', ()=>{
        let $comment = $viewer.querySelector('#form');
        addComment($comment.value);
    });

    let $donateBtn = document.querySelector('#donate');
    $donateBtn.addEventListener('click', ()=>{
        donate();
    });
}

function removeViews() {
    $viewer.innerHTML = '';
    generateHeader();
}

function addComment(comment) {
    console.log(comment);
}

function addLike(){
    console.log("DEU LIKE");
}

function addDislike() {
    console.log("DEU DISLIKE");
}

function donate(){
    console.log("FAZER DOAÇÃO");
}