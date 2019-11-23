import {$viewer, url} from './main.js';
import {viewHome} from "./main.js";
export {searchCampaigns};

async function listingCampaigns(substring) {

    let token = await sessionStorage.getItem('token');

    let header = {
        'Access-Control-Allow-Origin': url + '/campaign/register',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Authorization': `Bearer ${token}`
    };

    let data = await fetch(url + "/campaign/" + substring, {
         mode: 'cors',
        'method': 'GET',
        'headers': header
    }).then(r => r.json());

    console.log(data);
    return data;
}

let $campaign
// async function fetch_templates(){
//     let template = await fetch('/html/listingCampaignsTemplate.html').then(r => r.text());
//
//     let $div = document.createElement('div');
//     $div.innerHTML = template;
//
//     let $template = $div.querySelector('#listing-campaigns');
//     let $outraDiv = document.createElement('div');
//     $outraDiv.innerHTML = $template.innerHTML;
//
// }

async function searchCampaigns() {
    let $search = document.querySelector('#input-search');
    let substring = $search.value;
    let campaigns = await Promise.all([listingCampaigns(substring)]);

    // let campaigns = [
    //     {
    //         "shortName": "Cadeira para Maria filha de Joao",
    //         "urlIdentifier": "cadeira-para-maria-filha-de-joao",
    //         "description": "Cadeira de rodas",
    //         "deadline": "30-11-2019",
    //         "goal": "2000.00"
    //     },
    //     {
    //         "shortName": "Uma bolsa para Higor",
    //         "urlIdentifier": "uma-bolsa-para-higor",
    //         "description": "Vamos conseguir uma bolsa para Higor",
    //         "deadline": "25-12-2019",
    //         "goal": "3000.00"
    //     },
    //     {
    //         "shortName": "Projeto X",
    //         "urlIdentifier": "projeto-x",
    //         "description": "Falta de ideias",
    //         "deadline": "04-12-2019",
    //         "goal": "1000000.00"
    //     },
    //     {
    //         "shortName": "Projeto Edoe",
    //         "urlIdentifier": "projeto-edoe",
    //         "description": "Antigo projeto que tem como intuito ligar pessoas que querem doar itens a pessoas que necessitam deles.",
    //         "deadline": "01-01-2020",
    //         "goal": "2500.00"
    //     },
    //     {
    //         "shortName": "Curso comunitario de programacao",
    //         "urlIdentifier": "curso-comunitario-de-programacao",
    //         "description": "Compra de novos computadores para um curso de programacao para criancas",
    //         "deadline": "29-11-2020",
    //         "goal": "10000"
    //     },
    //     {
    //         "shortName": "Curso comunitario pre vestibular",
    //         "urlIdentifier": "curso-comunitario-pre-vestibular",
    //         "description": "Compra de material para o curso pre vestibular",
    //         "deadline": "01-01-2020",
    //         "goal": "5000"
    //     },
    //     {
    //         "shortName": "Projeto Hope",
    //         "urlIdentifier": "projeto-hope",
    //         "description": "Projeto com intuito de resgatar e cuidar de animais abandonados",
    //         "deadline": "01-01-2020",
    //         "goal": "3000.00"
    //     },
    //     {
    //         "shortName": "Curso basico de informatica",
    //         "urlIdentifier": "curso-basico-de-informatica",
    //         "description": "Compra de material para um curso gratuito de informatica",
    //         "deadline": "01-01-2020",
    //         "goal": "6000.00"
    //     },
    //     {
    //         "shortName": "Reforma da casa do Senhor Jose",
    //         "urlIdentifier": "reforma-da-casa-do-senhor-jose",
    //         "description": "O senhor Jose teve a casa devastada por uma inundacao",
    //         "deadline": "01-01-2020",
    //         "goal": "8000.00"
    //     },
    //     {
    //         "shortName": "Reforma da casa do Senhora Maria",
    //         "urlIdentifier": "reforma-da-casa-da-senhora-maria",
    //         "description": "O senhor Jose teve a casa devastada por um deslizamento",
    //         "deadline": "01-01-2020",
    //         "goal": "10000.00"
    //     },
    //     {
    //         "shortName": "Time de futebol",
    //         "urlIdentifier": "time-de-futebol",
    //         "description": "Compra de material para o projeto que visa resgatar jovens e crianças das ruas por meio do esporte",
    //         "deadline": "10-12-2019",
    //         "goal": "4000"
    //     },
    //     {
    //         "shortName": "Time de basquete",
    //         "urlIdentifier": "time-de-basquete",
    //         "description": "Compra de material para o projeto que visa resgatar jovens e crianças das ruas por meio do esporte",
    //         "deadline": "01-01-2020",
    //         "goal": "4000"
    //     }
    // ]

    let campaignsString = JSON.stringify(campaigns);
    let campaignsJSON = JSON.parse(campaignsString);

    if(campaignsJSON[0].status != 404){
        campaignsJSON.forEach( c => {
            $campaign = document.createElement('div');
            $campaign.innerHTML =
                `<div id="listing">
                     <h3 id="name">${c.shortName}</h3>
                     <div id="comment">${c.description}</div>
                     <ul id="info">
                        <li>Goal: ${c.goal}</li>
                        <li>Deadline: ${c.deadline}</li>
                        <li> <a href="/campaign/${c.urlIdentifier}">Ver mais</a> </li>
                    </ul>
                 </div>`;
            $viewer.appendChild($campaign);
        })
    }


}
