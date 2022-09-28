// ATENÇÃO, Insira seu script aqui

//Nome do aluno: JEYSON GABRIEL DE OLIVEIRA INNER TEXT
//----------------------------------------------------------------------------------------------------------------


//VARIÁVEIS PRINCIPAIS DA VALIDAÇÃO
let elNome = document.querySelector('#nome');
let elSobreNome = document.querySelector('#sobrenome');
let elEmail = document.querySelector('#email');
let elSite = document.querySelector('#website');
let elDataInicial = document.querySelector('#data-inicial');
let elDataFinal = document.querySelector('#data-final');
let habilidades = document.getElementsByName('habilidade');
let estado = '';
let vetorHabilidade = [];
let contatos = JSON.parse(window.localStorage.getItem('contatos')) || [];
let alterar = false;
let idAlterar = 4;
carregarContatos();

formulario = document.forms[0]; //ENCONTRA O FORMULÁRIO


//LISTENER PARA O BLUR D NOME
elNome.addEventListener('blur', (evento) => {
    if (!validarNome(evento.target.value)) {
        escreveErro(evento.target, 'O nome deve ter mais de 3 caracteres!')
    } else {
        removeErro(evento.target)
    }
});

//LISTENER PARA O BLUR DO EMAIL
elEmail.addEventListener('blur', (evento) => {
    if (!validarEmail(evento.target.value)) {
        escreveErro(evento.target, 'Email incorreto');
    } else {
        removeErro(evento.target);
    }
})

//FUNÇÕES DE VALIDAÇÃO
function validarNome(nome) {
    return nome.trim().length > 2;
}
function validarSobrenome(sobrenome) {
    return sobrenome.trim().length > 2;

}
function validarEmail(email) {
    partes = email.split('@');
    if (partes.length != 2) {
        return false;
    }

    segunda_parte = partes[1];

    return segunda_parte.indexOf('.') >= 0;
}
function validarData(dataInicial, dataFinal) {
    let validado = true;
    let vetorInicial = dataInicial.split('/');
    inicial = new Date(
        vetorInicial[2],
        vetorInicial[1] - 1,
        vetorInicial[0]
    )
    let vetorFinal = dataFinal.split('/');
    final = new Date(
        vetorFinal[2],
        vetorFinal[1] - 1,
        vetorFinal[0]
    )
    let hoje = new Date();
    if (inicial < hoje) {
        validado = false;
    }
    if (inicial > final) {
        validado = false;
    }
    return validado;
}
function validarSite(site) {
    if (site.trim().length == 0) {
        return true;
    }
    if (site.startsWith('http://') || site.startsWith('https://')) {
        return true;
    }
    else {
        return false;
    }
}
function validarHabilidade(habilidades) {
    let total = 0;
    vetorHabilidade = [];
    habilidades.forEach(habilidade => {
        if (habilidade.checked) {
            total++;
            vetorHabilidade.push(habilidade.id)
        }
    })
    return total > 0 && total < 4;
}

//A CADA EVENTO DE CHANGE ELE EXECUTA A FUNÇÃO DE VALIDAR REGIÃO
document.getElementsByName('regiao').forEach(regiao => {
    regiao.addEventListener('change', evento => {
        estado = evento.target.id;
        validarRegiao(evento.target)
    })
})
function validarRegiao(regiao) {
    let elProgramador = document.querySelector('#programador');
    let elDBA = document.querySelector('#DBA');
    if (regiao.id == 'regiao-coeste') {
        elProgramador.disabled = true;
        elProgramador.checked = false;
        elDBA.disabled = true;
        elDBA.checked = false;
    }
    else {
        elProgramador.disabled = false;
        elDBA.disabled = false;
    }
}
//VALIDAÇÃO AO EVENTO DE SUBMIT
formulario.addEventListener('submit', evento => {
    let temErro = false;

    if (!validarNome(elNome.value)) {
        escreveErro(elNome, 'O nome deve ter mais de 3 caracteres.');
        temErro = true;
    } else {
        removeErro(elNome);
    }
    if (!validarSobrenome(elSobreNome.value)) {
        escreveErro(elSobreNome, 'O sobrenome deve ter mais de 3 caracteres')
    } else {
        removeErro(elSobreNome);
    }

    if (!validarEmail(elEmail.value)) {
        escreveErro(elEmail, 'Email inválido.');
        temErro = true;
    } else {
        removeErro(elEmail);
    }

    if (!validarSite(elSite.value)) {
        escreveErro(elSite, 'URL inválida')
        temErro = true;
    } else {
        removeErro(elSite);
    }

    if (!validarData(elDataInicial.value, elDataFinal.value)) {
        escreveErro(elDataInicial, 'Datas inválidas');
        escreveErro(elDataFinal, 'Datas Inválidas')
        temErro = true;
    } else {
        removeErro(elDataInicial);
        removeErro(elDataFinal)
    }
    if (estado == '') {
        temErro = true;
        window.alert('Selecione uma região.')
    }

    if (validarHabilidade(habilidades) == false) {
        temErro = true;
        window.alert('Selecione no mínimo 1 e no máximo 3 habilidades')
    }

    if (temErro) {
        evento.preventDefault();
    } else {
        if(alterar){
            let temporaria = localStorage.getItem('contatos');
            novoTxt = JSON.parse(temporaria);
            novoTxt[idAlterar].nome = elNome.value;
            novoTxt[idAlterar].sobrenome = elSobreNome.value;
            novoTxt[idAlterar].email = elEmail.value;
            novoTxt[idAlterar].site = elSite.value;
            novoTxt[idAlterar].inicio = elDataInicial.value;
            novoTxt[idAlterar].final = elDataFinal.value;
            novoTxt[idAlterar].habilidades = vetorHabilidade;
            novoTxt[idAlterar].local = estado;
            temporaria = JSON.stringify(novoTxt);
            localStorage.setItem('contatos',temporaria)
            carregarContatos();

        }else{
            pessoa = {
                nome: elNome.value,
                sobrenome: elSobreNome.value,
                email: elEmail.value,
                site: elSite.value,
                inicio: elDataInicial.value,
                final: elDataFinal.value,
                habilidades: vetorHabilidade,
                local: estado
            };
            guardarContato(pessoa);
        }
    }
})

function guardarContato(pessoa) {
    contatos.push(pessoa);
    let textoContato = JSON.stringify(contatos);
    window.localStorage.setItem('contatos', textoContato);
    carregarContatos();
}

function carregarContatos() {
    for (x = 0; x < contatos.length; x++) {
        let pessoaNaLista = contatos[x];
        if (pessoaNaLista) {

            adicionarItemTabela(pessoaNaLista, x);
        }
    }
}
function adicionarItemTabela(pessoa, id) {
    let tabela = document.querySelector('#tabela-agenda');
    let linha = tabela.tBodies[0].insertRow();
    let celulaNome = linha.insertCell();
    let celulaSobrenome = linha.insertCell();
    let celulaEmail = linha.insertCell();
    let celulaSite = linha.insertCell();
    let celulaInicio = linha.insertCell();
    let celulaFinal = linha.insertCell();
    let celulaHabilidade = linha.insertCell();
    let celulaLocal = linha.insertCell();
    let celulaBotao = linha.insertCell();
    let celulaBotao2 = linha.insertCell();
    celulaNome.textContent = pessoa.nome;
    celulaSobrenome.textContent = pessoa.sobrenome;
    celulaEmail.textContent = pessoa.email;
    celulaSite.textContent = pessoa.site;
    celulaInicio.textContent = pessoa.inicio;
    celulaFinal.textContent = pessoa.final;
    celulaHabilidade.textContent = pessoa.habilidades;
    celulaLocal.textContent = pessoa.local;
    let botao = document.createElement('button');
    botao.className = 'btn btn-danger';
    botao.innerText = 'Excluir';
    botao.dataset.contatoid = id;
    celulaBotao.appendChild(botao);
    botao.addEventListener('click', (evento) => {
        removerContato(evento.target);
    });
    let botao2 = document.createElement('button');
    botao2.className = 'btn btn-primary';
    botao2.innerText = 'Alterar';
    botao2.dataset.contatoid = id;
    celulaBotao2.appendChild(botao2);
    botao2.addEventListener('click', (evento) => {
        alterarCadastro(evento.target);
    })

}
function alterarCadastro(botao2){
    document.querySelector('.btn-primary').innerHTML = 'Alterar cadastro';
    alterar = true;
    let id = botao2.dataset.contatoid;
    idAlterar = id;
    elNome.value = contatos[id].nome;
    elSobreNome.value = contatos[id].sobrenome;
    elEmail.value = contatos[id].email;
    elSite.value = contatos[id].site;
    elDataInicial.value = contatos[id].inicio;
    elDataFinal.value = contatos[id].final;
    if(contatos[id].habilidades == 'analista'){
        document.querySelector('#analista').checked = true;
    }if(contatos[id].habilidades == 'programador'){
        document.querySelector('#programador').ckecked = true;
    }if(contatos[id].habilidades == 'webdesigner'){
        document.querySelector('#webdesigner').checked = true;
    }if(contatos[id].habilidades == 'DBA'){
        document.querySelector('#DBA').checked = true;
    }if(contatos[id].habilidades == 'ADM-rede'){
        document.querySelector('#ADM-rede').checked = true;
    }
    
    if(contatos[id].local == 'regiao-sul'){
        document.querySelector('#regiao-sul').checked = true;
    }if(contatos[id].local == 'regiao-sudeste'){
        document.querySelector('#regiao-sudeste').checked = true;
    }if(contatos[id].local == 'regiao-coeste'){
        document.querySelector('#regiao-coeste').checked = true;
    }if(contatos[id].local == 'regiao-nordeste'){
        document.querySelector('#regiao-nordeste').checked = true;
    }if(contatos[id].local == 'regiao-norte'){
        document.querySelector('#regiao-norte').checked = true;
    }
}

function removerContato(botao) {
    let id = botao.dataset.contatoid;
    delete contatos[id];
    window.localStorage.setItem('contatos', JSON.stringify(contatos));
    let tabela = document.querySelector('#tabela-agenda');
    let linhaParaRemover = botao.parentNode.parentNode;
    tabela.tBodies[0].removeChild(linhaParaRemover);
}


//FUNÇÕES DE ERRO
function escreveErro(elemento, mensagem) {
    elemento.classList.add('is-invalid')
    let elMsg = elemento.parentNode.querySelector('.invalid-feedback');
    elMsg.textContent = mensagem;
}
function removeErro(elemento) {
    elemento.classList.remove('is-invalid')
}