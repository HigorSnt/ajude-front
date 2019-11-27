import { $viewer, url, showConfirmView, showFailureView, generateHeader, searchListener } from "./main.js";
import { User, Login } from "./entities.js";
import { fetchLogin } from "./login.js";
export { viewUserRegister, viewRequestChangePassword, viewChangePassword };


async function fetchRegisterUser(user) {
    try {
        let body = JSON.stringify(user);
        let header = {
            'Content-Type': 'application/json;charset=utf-8'
        };

        let response = await fetch(url + '/user', {
            'method': 'POST',
            'body': body,
            'headers': header
        });

        if (response.status == 201) {
            let l = new Login(
                user['email'],
                user['password']
            );

            showConfirmView("Você agora está cadastrado!");
            setTimeout(() => fetchLogin(l), 1000);
        } else if (response.status == 400) {
            showFailureView('Opa! Parece que você já está cadastrado...');
        }
    } catch (e) {
        console.log(e);
    }
}

function viewUserRegister() {
    let $template = document.querySelector('#view-user-register');
    $viewer.innerHTML = $template.innerHTML;

    let $registerUserBtn = document.querySelector('.confirm-btn');
    $registerUserBtn.addEventListener('click', createUser);
}

function createUser() {
    let firstNameInput = document.querySelector("#user-first-name");
    let lastNameInput = document.querySelector("#user-last-name");
    let emailInput = document.querySelector("#user-email");
    let creditCardInput = document.querySelector("#user-credit-card");
    let passwordInput = document.querySelector("#user-password");

    let values = [firstNameInput.value, lastNameInput.value, emailInput.value, creditCardInput.value, passwordInput.value];

    if (!values.includes("")) {
        let u = new User(
            values[0],
            values[1],
            values[2],
            values[3],
            values[4]
        );

        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
        creditCardInput.value = "";
        passwordInput.value = "";

        fetchRegisterUser(u);
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

function viewRequestChangePassword() {
    generateHeader();

    let $template = document.querySelector("#request-change-password");

    $viewer.innerHTML += $template.innerHTML;

    let $confirmButton = document.querySelector("#confirm-request");
    $confirmButton.addEventListener('click', fetchRequestChangePassword);

    searchListener();
}

function viewChangePassword() {
    let $headerTemplate = document.querySelector('#header-not-logged-without-search');
    let $template = document.querySelector("#change-password");

    $viewer.innerHTML = $headerTemplate.innerHTML + $template.innerHTML;

    let $confirmButton = $viewer.querySelector("#confirm-change");
    $confirmButton.addEventListener('click', fetchChangePassword);
}

async function fetchRequestChangePassword() {
    let $emailInput = document.querySelector("#request-email");
    let email = $emailInput.value;

    if (![""].includes(email)) {
        try {
            let body = `{ "email" : "${email}" }`;
            let token = sessionStorage.getItem('token');

            let header = {
                'Access-Control-Allow-Origin': url + '/forgotPassword',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            };

            let data = await fetch(url + "/forgotPassword", {
                'mode': 'cors',
                'method': 'POST',
                'body': body,
                'headers': header
            });

            if (data.status === 200) {
                showConfirmView("Verifique seu email!");
            } else {
                showFailureView("Ocorreu algum erro durante a solicitação do serviço!");
            }

        } catch (e) {
            console.log(e);
        }
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

async function fetchChangePassword() {
    let $newPassword = document.querySelector("#new-password");
    let $confirmNewPassword = document.querySelector("#confirm-new-password");

    if ($newPassword.value === $confirmNewPassword.value) {

        if (![""].includes($newPassword.value)) {
            try {
                let body = `{ "password" : "${$newPassword.value}" }`;
                let token = location.search.substring(1);

                let header = {
                    'Access-Control-Allow-Origin': url + `/resetPassword/${token}`,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${token}`
                };

                let data = await fetch(url + `/resetPassword/${token}`, {
                    'mode': 'cors',
                    'method': 'POST',
                    'body': body,
                    'headers': header
                });
                /*
                if (data.status === 200) {
                    showConfirmView("Senha alterada!");
                } else {
                    showFailureView("Ocorreu algum erro durante a solicitação do serviço!");
                }*/

            } catch (e) {
                console.log(e);
            }
        } else {
            alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
        }
    } else {
        alert("AS SENHAS PRECISAM SER IGUAIS");
    }
}

export async function viewProfile(username) {
    generateHeader();
    let u = (await Promise.all([getUser(username)]))[0];
    let campaigns = u.campaignList;
    let donations = u.donations;
    console.log(u);

    let $template = document.querySelector('#view-profile');
    $viewer.innerHTML += $template.innerHTML;

    userInformationsList(u);
    campaignsUserList(campaigns, u.firstName);
    donationsUserList(donations, u.firstName);
}

function userInformationsList(user) {
    let $userInfo = $viewer.querySelector('#user-profile');

    $userInfo.innerHTML =
        `<h3>${user.firstName} ${user.lastName}</h3>
    <h5>${user.email}</h5>`;
}

function campaignsUserList(campaigns, firstName) {
    let $campaignInfo = $viewer.querySelector('#campaign-profile');

    if (campaigns.length === 0) {
        let $h4 = document.createElement('h4');
        $h4.innerText = `${firstName} não criou nenhuma campanha ainda.`
        $campaignInfo.appendChild($h4);
    }

    campaigns.forEach(c => {
        let $div = document.createElement('div');
        $div.className = 'top-campaigns'
        $div.innerHTML =
            `<h1>${c.shortName}</h1>
            <h4>Status: ${status}</h4>
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
                    <p><strong id ="like">${c.likes}</strong></p>
                </li>
                </li>
                    <li class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                    <img id="img-dislike" class="img-inverter" src="images/broken-heart.svg" alt="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
                    <p><strong id ="dislike">${c.dislikes}</strong></p>
                </li>
                <li> 
                    <a href="#campaign/${c.urlIdentifier}" >Ver mais</a> 
                </li>
            </ul>`;
        $campaignInfo.appendChild($div);
    });
    return $campaignInfo;
}

function donationsUserList(donations, firstName) {
    let $donationsInfo = $viewer.querySelector('#donations-profile');

    if (donations.length === 0) {
        let $h4 = document.createElement('h4');
        $h4.innerText = `${firstName} não realizou nenhuma doação ainda.`
        $donationsInfo.appendChild($h4);
    }

    donations.forEach(d => {
        let $div = document.createElement('div');
        $div.className = 'top-campaigns';
        $div.innerHTML =
            `<h1>${firstName} realizou uma doação na campanha ${d.campaignTarget.shortName}</h1>
            <div class="campaign-description">
                <h4 style="text-align:center; padding-bottom: 0.5em">Uma breve descrição desta campanha:</h4>
                <p>${d.campaignTarget.description}</p>
            </div>
            <ul class="ul-info flex-box" style="justify-content: space-between;">
                <li id="goal" class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                    <img id="goal-img" src="images/piggy-bank.svg" class="img-inverter" alt="Meta" width="40px" height="40px" style="margin-right: 0.3em">
                    <p><strong>${d.value}</strong></p>
                </li>
                <li id="goal" class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                    <img id="goal-img" src="images/piggy-bank.svg" class="img-inverter" alt="Meta" width="40px" height="40px" style="margin-right: 0.3em">
                    <p><strong>${d.campaignTarget.received}/${d.campaignTarget.goal}</strong></p>
                </li>
                 <li id="deadline" class="flex-box flex-box-row flex-box-align-center" style="justify-content: space-between;">
                    <img id="deadline-img" src="images/calendar.svg" class="img-inverter" alt="Deadline" width="40px" height="40px" style="margin-right: 0.3em">
                    <p><strong>${d.donationDate.split(" ")[0]}</strong></p>
                </li>
            </ul>`;
        $donationsInfo.appendChild($div);
    });
    return $donationsInfo;
}

async function getUser(username) {
    try {
        let body = `{ "username" : "${username}" }`;

        let header = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=utf-8'
        };

        let data = await fetch(`${url}/user/profile`, {
            mode: 'cors',
            'method': 'POST',
            'body': body,
            'headers': header
        }).then(r => r.json());

        return data;

    } catch (e) {
        console.log(e);
    }
}