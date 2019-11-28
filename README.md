# ajude

[![Language](https://img.shields.io/badge/javascript-6-yellow?style=flat&logo=appveyor)](https://www.javascript.com/)
[![Language](https://img.shields.io/badge/html-5-red?style=flat&logo=appveyor)](https://www.javascript.com/)
[![Language](https://img.shields.io/badge/css-3-purple?style=flat&logo=appveyor)](https://www.javascript.com/)

Repositório do frontend do projeto _AJuDE - AquiJuntosDoandoEsperança_ da disciplina Projeto de Software 2019.2.  

<p align="center">
  <img src="images/ajude!.svg" width="250px" height="100px"/>  
</p>

## Tópicos

- [ajude](#ajude)
  - [Tópicos](#t%C3%B3picos)
    - [Caso de uso 1](#caso-de-uso-1)
    - [Caso de uso 1A](#caso-de-uso-1a)
    - [Caso de uso 2](#caso-de-uso-2)
    - [Caso de uso 3](#caso-de-uso-3)
    - [Caso de uso 3A](#caso-de-uso-3a)
    - [Casos de uso 4, 4A, 4B, 4C](#casos-de-uso-4-4a-4b-4c)
    - [Caso de uso 5](#caso-de-uso-5)
    - [Caso de uso 6](#caso-de-uso-6)
    - [Casos de uso 7 e 8](#casos-de-uso-7-e-8)
    - [Caso de uso 9](#caso-de-uso-9)
    - [Caso de uso 10](#caso-de-uso-10)
    - [Detalhes da implementação](#detalhes-da-implementa%C3%A7%C3%A3o)
    - [Links](#links)
    - [Grupo](#grupo)


### Caso de uso 1

Assim que acessa o link, no cabeçalho da página inicial possui dois links, que na verdade são âncoras, que levam para formulários de cadasatro do usuário (Sign Up) e para o login.

### Caso de uso 1A

O usuário pode solicitar a senha seja na view de login, ou após se logar. Em ambas opções o usuário terá que digitar o email cadastrado, sendo enviado o link para o mesmo. A partir daí o usuário possui 1 minuto para realizar a mudança.

### Caso de uso 2

Após realizar o usuário terá acesso à um menu dropdown no canto esquerdo superior, que possui a âncora para a view de cadastro de campanha.

### Caso de uso 3

Em praticamente todas as views é possível realizar buscas por campanhas, porém caso o usuário não esteja logado é solicitado o login do mesmo.

### Caso de uso 3A

Na view de pesquisa possui um checkbox que possibilita a visualização de todas as campanhas, que por padrão se mostra apenas as ativas, retornadas no fetch.

### Casos de uso 4, 4A, 4B, 4C

Na página principal das campanhas, que pode ser acessada pelos links `Ver mais` na página inicial ou nas buscas, cuja url é formada pela âncora `#campaign/${url_da_campanha_formado_pelo_short_name}` é possível ver as informações (doações recebida, meta, deadline, likes e dislikes), realizar doação e, se caso o usuário que estiver acessando for o dono, um botão que encerra a campanha.  
Caso o usuário que estiver acessando for o dono, os ícones de arrecadação e do calendário eles se tornam links para realizar as alterações referentes à cada informação.

### Caso de uso 5

Na mesma view de campanhas é possível digitar um comentário pelo `textarea` presente na view.

### Caso de uso 6

Se o usuário que estiver acessando for o mesmo que realizou o comentário, aparecerá um botão possibilitando a sua deleção.

### Casos de uso 7 e 8

Apenas nas views das campanhas é possível realizar likes/dislikes, se caso o usuário já realizou um like, ao clicar no ícone referente ao like ou ao dislike, o mesmo será retirado. O mesmo acontece com o dislike.

### Caso de uso 9

É a home, onde nela se pode ver 5 campanhas ordenadas e filtradas por meio do quanto falta para atingir a meta, pela maior quantidade likes e por maior proximidade da data de deadline.  
Esse filtro é acessível passando o mouse sobre o ícone de funil na canto direito da tela.

### Caso de uso 10

A partir de qualquer campanha é possível acessar o link do perfil de um usuário, ou através do menu dropdown no header da página ao se realizar login.  
A url é formada pela âncora `#user/{username}`, onde o username é formado no backend atráves dos nomes fornecidos.

### Detalhes da implementação

O frontend utiliza SPA em toda as views, ou seja, uma única página cujo conteúdo se altera de maneira dinâmica a partir da utilização de âncoras.  
O roteamento é realizado pelos scripts, mais especificamente pelo arquivo nomeado por `main.js`, presentes na pasta `js`. Na pasta é possível verificar a presença de scripts para realizar o roteamento e as mudanças das views, cada arquivo possui funções delegadas à funcionalidades referentes à alguma view em específica, por exemplo, `user.js` possui as funções que possibilitam mostrar as views para as suas ações específicas.  
No diretório `images`, estão presentes os ícones utilizados em todas as views. E em `css`, está presente a folha de estilhos de todo o site concentrado no `main.css`.  
O `main.css` e `main.js` é importado pelo `index.html`, que é quem possui todos os templates para a alteração das views.

### Links

1. Aplicação rodando: [ajude](https://meajude.netlify.com/)
2. Vídeo mostrando funcionamento: [link]()
3. Usuários cadastrados: [link](https://bit.ly/37NTTXy)

### Grupo
> [Izaquiel Cordeiro](https://github.com/IzaquielCordeiro)  
> [Higor Santos](https://github.com/HigorSnt)  
> [Mateus Alves](https://github.com/mateustranquilino)  

<p align="center">
  <img src="http://alumni.computacao.ufcg.edu.br/static/logica/images/logo.png"/>  
</p>
