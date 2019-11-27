import { url, $viewer, generateHeader, viewerChange, viewHasNoPermission } from "./main.js";

let data;
async function fetch_campaign(campaignUrl) {

    let token = sessionStorage.getItem('token');

    if (token === null) {
        viewHasNoPermission();
    } else {
        let header = {
            'Access-Control-Allow-Origin': url + '/campaign/search' + campaignUrl,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${token}`
        };

        data = await fetch(url + "/campaign" + campaignUrl, {
            mode: 'cors',
            'method': 'GET',
            'headers': header
        }).then(r => r.json());

        return data;
    }
}

let campaignURL;
export async function showCampaign(campaignUrl) {
    campaignURL = campaignUrl;
    let response = await Promise.all([fetch_campaign(campaignUrl)]);
    
    if (response[0] !== undefined) {
        let campaign = JSON.parse(JSON.stringify(response))[0];

        createView(campaign);
        if (campaign.user.email === sessionStorage.getItem('userEmail')) loadOwnerFunctions();
    }

}

let $box;

function createView(c) {
    removeViews();
    $box = document.createElement('div');

    let status;

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
    <p>Campanha criada por: <a href="/#user/${c.user.username}">${c.user.firstName} ${c.user.lastName}</a></p>
    <div class="campaign-description">
        <h4 style="text-align:center; padding-bottom: 0.5em">Uma breve descrição desta campanha:</h4>
        <p>${c.description}</p>
    </div>
    <ul class="ul-info flex-box" style="justify-content: space-between;">
        <li id="goal" class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="goal-img" src="images/piggy-bank.svg" class="img-inverter" alt="Meta" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong>${c.received}/${c.goal}</strong></p>
        </li>
         <li id="deadline" class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="deadline-img" src="images/calendar.svg" class="img-inverter" alt="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
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
    <button id="donate">Fazer doação</button>`;

    loadComments(c.comments);

    $viewer.appendChild($box);

    let $likeButton = document.querySelector("#img-like");
    $likeButton.addEventListener('click', async () => {
        await Promise.all([addLike()]);
        showCampaign(campaignURL);
    });

    let $dislikeButton = document.querySelector("#img-dislike");
    $dislikeButton.addEventListener('click', async () => {
        await Promise.all([addDislike()]);
        showCampaign(campaignURL);
    });

    let $commentBtn = document.querySelector('#comment-btn');
    $commentBtn.addEventListener('click', async () => {
        let $comment = $viewer.querySelector('#form');

        await Promise.all([addComment($comment.value)]);
        showCampaign(campaignURL);
    });

    let $donateBtn = document.querySelector('#donate');
    $donateBtn.addEventListener('click', donate);
}

function loadComments(comments) {

    comments.forEach(comment => {
        let $crate = document.createElement('div');
        $crate.id = "comment-box";
        $crate.innerText = comment.comment;
        $box.appendChild($crate);
    })
}

function removeViews() {
    $viewer.innerHTML = '';
    generateHeader();
}

function donate() {
    $box.innerHTML =
        '<h3>Insira aqui o valor da doação</h3>' +
        '<input id="donation-value" type="number" placeholder="Valor" required="required" class="input-form">' +
        '<button id="confirm-btn" type="submit" class="confirm-btn">Confirmar</button>';
    let $btn = $box.querySelector('#confirm-btn');
    $btn.addEventListener('click', async () => {
        let value = $viewer.querySelector('#donation-value').value;
        await Promise.all([realizeDonate(value)]);
        showCampaign(campaignURL);
    });
}

async function addComment(comment) {
    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/comment',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };

    let data = await fetch(url + '/campaign' + campaignURL + '/comment', {
        mode: 'cors',
        'method': 'POST',
        'body': `{"comment":"${comment}"}`,
        'headers': header
    }).then(r => r.json());
}

async function addLike() {

    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/like',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };

    let data = await fetch(url + '/campaign' + campaignURL + '/like', {
        mode: 'cors',
        'method': 'POST',
        'body': "{}",
        'headers': header
    }).then(r => r.json());
}

async function addDislike() {

    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/dislike',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };

    let data = await fetch(url + '/campaign' + campaignURL + '/dislike', {
        mode: 'cors',
        'method': 'POST',
        'body': "{}",
        'headers': header
    }).then(r => r.json());
}

function loadOwnerFunctions() {
    let $goal = document.querySelector('#goal');
    $goal.addEventListener('click', changeGoal);

    let $deadline = document.querySelector('#deadline');
    $deadline.addEventListener('click', changeDeadline);

    let $deleteCampaignBtn = document.createElement('button');
    $deleteCampaignBtn.innerText = "Deletar campanha";
    $deleteCampaignBtn.addEventListener('click', deleteCampaign);
    $box.appendChild($deleteCampaignBtn);
}

function changeGoal() {
    $box.innerHTML =
        '<h3>Insira a nova meta</h3>' +
        '<input id="campaign-goal" type="number" placeholder="Meta" required="required" class="input-form">' +
        '<button id="confirm-btn" type="submit" class="confirm-btn">Confirmar</button>';
    let $btn = $box.querySelector('#confirm-btn');
    let $goal = $viewer.querySelector('#campaign-goal');
    $btn.addEventListener('click', async () => {
        await Promise.all([setGoal($goal.value)]);
        showCampaign(campaignURL);
    });
}

function changeDeadline() {
    $box.innerHTML =
        '<h3>Insira o novo deadline</h3>' +
        '<input type="date" placeholder="Data de vencimento" required="required" id="campaign-deadline" class="input-form">' +
        '<button id="confirm-btn" type="submit" class="confirm-btn">Confirmar</button>';
    let $btn = $box.querySelector('#confirm-btn');
    let $deadline = $viewer.querySelector('#campaign-deadline');

    $btn.addEventListener('click', async () => {
        await Promise.all([setDeadline($deadline.value + " 23:59:59")]);
        showCampaign(campaignURL);
    });
}

async function setGoal(newGoal) {
    let token = await sessionStorage.getItem('token');

    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/setGoal',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    let data = await fetch(url + '/campaign' + campaignURL + '/setGoal', {
        mode: 'cors',
        'method': 'PUT',
        'body': `{"goal": "${newGoal}"}`,
        'headers': header
    }).then(r => r.json());

}

async function setDeadline(newDeadline) {
    let token = sessionStorage.getItem('token');

    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/setDeadline',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    let data = await fetch(url + '/campaign' + campaignURL + '/setDeadline', {
        mode: 'cors',
        'method': 'PUT',
        'body': `{"deadline": "${newDeadline}"}`,
        'headers': header
    }).then(r => r.json());
}

async function realizeDonate(value) {
    let token = sessionStorage.getItem('token');

    let body = `{"value": "${value}"}`;

    let header = {
        'Access-Control-Allow-Origin': `${url}/campaign${campaignURL}/donate`,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    let data = await fetch(`${url}/campaign${campaignURL}/donate`, {
        mode: 'cors',
        'method': 'POST',
        'body': body,
        'headers': header
    }).then(r => r.json());
}

function deleteCampaign() {
    console.log("campanha deletada");
    removeViews();
}
