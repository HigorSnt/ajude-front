import { url, $viewer, generateHeader, searchListener, viewHasNoPermission } from "./main.js";

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
        }).then();

        return data;
    }
}

let campaignURL, campaign;
export async function showCampaign(campaignUrl) {
    campaignURL = campaignUrl;
    let response = await fetch_campaign(campaignUrl);

    if (response.status === 200) {
        campaign = await response.json();

        createView(campaign);
    }
    else {
        let $h2 = document.createElement('h2');
        $h2.id = "tittle";
        $h2.innerText = `A campanha ${campaignUrl} não existe`;
        $viewer.appendChild($h2);
    }

}

let $box;
function createView(c) {
    removeViews();
    searchListener();
    $box = document.createElement('div');

    let status;

    if (c.status === 'A') {
        status = "Esta campanha está ativa!";
    } else if (c.status === 'F') {
        status = "Esta campanha foi concluída!";
    } else if (c.status === 'E') {
        status = "Esta campanha está vencida!";
    } else if (c.status === 'C') {
        status = "Esta campanha foi encerrada pelo seu criador!";
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
            <img id="goal-img" src="images/piggy-bank.svg" class="img-inverter" title="Doações/Meta" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong>${c.received}/${c.goal}</strong></p>
        </li>
         <li id="deadline" class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="deadline-img" src="images/calendar.svg" class="img-inverter" title="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong>${c.deadline}</strong></p>
        </li>
        </li>
            <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="img-like" class="img-inverter" src="images/heart.svg" title="Dar like" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong id ="like">${c.numLikes}</strong></p>
        </li>
        </li>
            <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
            <img id="img-dislike" class="img-inverter" src="images/broken-heart.svg" title="Dar dislike" width="40px" height="40px" style="margin-right: 0.3em">
            <p><strong id ="dislike">${c.numDislikes}</strong></p>
        </li>
        
    </ul>`;

    $viewer.appendChild($box);
    if (c.user.email === sessionStorage.getItem('userEmail')) {
        loadOwnerFunctions();
    } else {
        $box.innerHTML += '<button id="donate">Realizar doação</button>';
    }

    let $div = document.createElement('div');
    $div.innerHTML =
        `<div id="comment-text" class="flex-box flex-box-justify-center flex-box-align-center flex-box-column">
            <textarea rows="3" cols="100" name="comment" id="form" form="comment-text$" placeholder="Deixe um comentário aqui..."></textarea>
            <button type="submit" id="comment-btn" width="1.5em" height="1.5em">Comentar</button>
        </div>`;
    $box.appendChild($div);

    let $commentBtn = document.querySelector('#comment-btn');
    $commentBtn.addEventListener('click', async () => {
        let $comment = $viewer.querySelector('#form');

        await addComment($comment.value);
        showCampaign(campaignURL);
    });


    loadComments(c.comments);

    let $likeButton = document.querySelector("#img-like");
    $likeButton.addEventListener('click', async () => {
        await addLike();
        showCampaign(campaignURL);
    });

    let $dislikeButton = document.querySelector("#img-dislike");
    $dislikeButton.addEventListener('click', async () => {
        await addDislike();
        showCampaign(campaignURL);
    });

    let $donateBtn = document.querySelector('#donate');
    $donateBtn.addEventListener('click', donate);
}

function loadComments(comments) {
    comments.forEach(comment => {
        if (comment.comment !== "") {
            let $div = document.createElement('div');
            $div.id = `comment${comment.id}`;
            $div.className = "flex-box flex-box-column flex-box-align-center";
            $div.style.width = '80%';
            let $commentBox = document.createElement('div');
            $commentBox.className = 'comment-box flex-box flex-box-column';
            if (sessionStorage.getItem('userEmail') === comment.user.email) {
                $commentBox.innerHTML = `<div class="flex-box flex-box-row" style="justify-content: space-between; margin: 0.6em">
                <div class="flex-box flex-box-row">
                <a class="owner-comment" href="/#user/${comment.user.username}">${comment.user.firstName} ${comment.user.lastName}</a>
                <h4>${comment.comment}</h4>
            </div>
            <button id="button${comment.id}" style="width: fit-content; height: fit-content; font-size: 10px">Apagar comentário</button>
            </div>`;
                let $deleteBtn = $commentBox.querySelector(`#button${comment.id}`);
                $deleteBtn.addEventListener('click', async () => {
                    await fetchDeleteComment(comment.id, campaignURL.substring(1));
                    showCampaign(campaignURL);
                });
            } else {
                $commentBox.innerHTML = `<div class="flex-box flex-box-row" style="justify-content: space-between; margin: 0.6em">
            <div class="flex-box flex-box-row">
                <a class="owner-comment" href="/#user/${comment.user.username}">${comment.user.firstName} ${comment.user.lastName}</a>
                <h4>${comment.comment}</h4>
            </div>
            </div>`;
            }

            let $seeReplies = document.createElement('strong');
            $seeReplies.id = `strong${comment.id}`;
            $seeReplies.style = 'cursor:pointer;'
            $seeReplies.innerText = "Ver respostas";
            $div.appendChild($commentBox);

            $seeReplies.addEventListener('click', () => loadReplies(comment, $commentBox));
            $div.appendChild($seeReplies);
            $box.appendChild($div)
        }
    });
}

function loadReplies(comment, box) {
    let $strongReply = $viewer.querySelector(`#strong${comment.id}`);
    let $divStrongParent = $viewer.querySelector(`#comment${comment.id}`);
    $divStrongParent.removeChild($strongReply);
    let $repliesBox = document.createElement('div');
    $repliesBox.className = "replies";
    let mainComment = comment;
    while (comment.reply != null) {
        let $reply = document.createElement('div');
        $reply.class = "campaign-description";
        $reply.innerHTML = `<div class="flex-box flex-box-row">
        <a class="owner-comment" href="/#user/${comment.reply.user.username}">${comment.reply.user.firstName} ${comment.reply.user.lastName}</a>
        <h4>${comment.reply.comment}</h4></div>`;
        $repliesBox.appendChild($reply);
        comment = comment.reply;
    }

    box.appendChild($repliesBox);
    let $div = document.createElement('div');
    $div.innerHTML =
        `<div id="comment-text" class="flex-box flex-box-justify-center flex-box-align-center flex-box-column">
            <textarea rows="3" cols="100" name="comment" id="reply${comment.id}" form="comment-text$" placeholder="Responda esse comentário..."></textarea>
            <button type="submit" id="reply-btn${comment.id}" width="1.5em" height="1.5em">Responder</button>
        </div>`;
    box.appendChild($div);

    let $commentBtn = document.querySelector(`#reply-btn${comment.id}`);
    $commentBtn.addEventListener('click', async () => {
        let $comment = $viewer.querySelector(`#reply${comment.id}`);
        await addReply(mainComment.id, $comment.value);
        showCampaign(campaignURL);
    });
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
        await realizeDonate(value);
        showCampaign(campaignURL);
    });
}

async function addComment(comment) {
    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/comment/',
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
async function addReply(id, comment) {
    let header = {
        'Access-Control-Allow-Origin': url + '/campaign' + campaignURL + '/comment/' + id,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    };

    let data = await fetch(url + '/campaign' + campaignURL + '/comment/' + id, {
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

    let $goalImg = $viewer.querySelector('#goal-img');
    $goalImg.title = 'Alterar Meta';
    let $deadlineImg = $viewer.querySelector('#deadline-img');
    $deadlineImg.title = 'Alterar deadline';

    let $deadline = document.querySelector('#deadline');
    $deadline.addEventListener('click', changeDeadline);

    let $div = document.createElement('div');
    $div.className = 'flex-box flex-box-align-center flex-box-row';
    $div.style.justifyContent = 'space-between';
    $div.style.width = '80%';
    $div.style.margin = '1em';


    let $donateCampaignBtn = document.createElement('button');
    $donateCampaignBtn.id = 'donate';
    $donateCampaignBtn.style.width = '12em';
    $donateCampaignBtn.innerText = "Realizar doação";
    $div.appendChild($donateCampaignBtn);

    if(campaign.status != "C"){
        let $deleteCampaignBtn = document.createElement('button');
        $deleteCampaignBtn.style.width = '12em';
        $deleteCampaignBtn.innerText = "Encerrar campanha";
        $deleteCampaignBtn.addEventListener('click', deleteCampaign);
        $div.appendChild($deleteCampaignBtn);
    }

    $box.appendChild($div);
}

function changeGoal() {
    $box.innerHTML =
        '<h3>Insira a nova meta</h3>' +
        '<input id="campaign-goal" type="number" placeholder="Meta" required="required" class="input-form">' +
        '<button id="confirm-btn" type="submit" class="confirm-btn">Confirmar</button>';
    let $btn = $box.querySelector('#confirm-btn');
    let $goal = $viewer.querySelector('#campaign-goal');
    $btn.addEventListener('click', async () => {
        await setGoal($goal.value);
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
        await setDeadline($deadline.value + " 23:59:59");
        showCampaign(campaignURL);
    });
}

async function setGoal(newGoal) {
    let token = sessionStorage.getItem('token');

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

async function deleteCampaign() {
    await fetchDeleteCampaign();
    removeViews();
}

async function fetchDeleteCampaign() {
    let token = sessionStorage.getItem('token');

    let header = {
        'Access-Control-Allow-Origin': `${url}/campaign${campaignURL}/closeCampaign`,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'PUT',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    let data = await fetch(`${url}/campaign${campaignURL}/closeCampaign`, {
        mode: 'cors',
        'method': 'PUT',
        'headers': header
    }).then(r => r.json());
}

async function fetchDeleteComment(commentId, campaignUrl) {
    let token = sessionStorage.getItem('token');

    let header = {
        'Access-Control-Allow-Origin': `${url}/campaign${campaignURL}/comment/${commentId}`,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    let data = await fetch(`${url}/campaign${campaignURL}/comment/${commentId}`, {
        mode: 'cors',
        'method': 'DELETE',
        'headers': header
    }).then(r => r.json());
}