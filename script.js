// Test line: Verified compatibility check - 2026-01-10
const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

const menuUsuarios = document.getElementById("menu-usuarios");
const menuHub = document.getElementById("menu-hub");
const menuTemas = document.getElementById("menu-temas");
const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");
const listaTemasBotoes = document.getElementById("lista-temas-botoes");

// Adição da Versão no menu de login
menuUsuarios.insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem; margin-top:20px;">Version 0.71</p>');

const meusDicionarios = ["verbos"]; 
let vocabulario = []; 
let palavrasParaOJogo = [];
let palavraAtualObjeto = null;
let acertos = 0;
let erros = 0;
let historicoResultados = []; 

window.onload = gerarMenuTemas;

// ==========================================
// FUNÇÕES DE NAVEGAÇÃO (CORRIGIDAS)
// ==========================================

function selecionarUsuario(nome) {
    menuUsuarios.style.display = "none";
    menuHub.style.display = "flex";
}

function irParaTemas() {
    menuHub.style.display = "none";
    menuTemas.style.display = "flex";
}

function voltarParaHub() {
    menuTemas.style.display = "none";
    menuHub.style.display = "flex";
}

// NOVO: Volta dos Níveis/Intervalos para o menu "Como deseja praticar?"
function voltarAoMenuPraticar() {
    menuNiveis.style.display = "none";
    menuIntervalos.style.display = "none";
    menuPrincipal.style.display = "flex";
}

// NOVO: Volta do "Como deseja praticar?" para os dicionários
function voltarParaDicionarios() {
    menuPrincipal.style.display = "none";
    menuTemas.style.display = "flex";
}

// ==========================================
// LÓGICA DO JOGO
// ==========================================

function gerarMenuTemas() {
    listaTemasBotoes.innerHTML = "";
    meusDicionarios.forEach(tema => {
        const btn = document.createElement("button");
        btn.textContent = tema.charAt(0).toUpperCase() + tema.slice(1);
        btn.className = "btn-azul"; 
        btn.onclick = () => carregarVocabulario(tema);
        listaTemasBotoes.appendChild(btn);
    });
}

function carregarVocabulario(arquivo) {
    const statusLoad = document.getElementById("status-load");
    statusLoad.style.display = "block";
    statusLoad.textContent = `Carregando ${arquivo}...`;
    vocabulario = []; 
    fetch(`dicionarios/${arquivo}.txt`)
        .then(res => res.text())
        .then(texto => {
            const linhas = texto.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "" && l.includes("="));
            linhas.forEach(linha => {
                const [esquerda, direita] = linha.split("=");
                vocabulario.push({ exibir: esquerda.trim(), correta: direita.split("/")[0].trim() });
            });
            menuTemas.style.display = "none";
            menuPrincipal.style.display = "flex";
            statusLoad.style.display = "none";
        });
}

function abrirMenuNiveis() {
    menuPrincipal.style.display = "none";
    menuNiveis.style.display = "flex";
}

function abrirMenuIntervalos() {
    menuPrincipal.style.display = "none";
    menuIntervalos.style.display = "flex";
}

function iniciarNivel(quantidade) {
    palavrasParaOJogo = vocabulario.slice(0, quantidade);
    iniciarJogo();
}

function iniciarIntervalo(inicio, fim) {
    palavrasParaOJogo = vocabulario.slice(inicio, fim);
    iniciarJogo();
}

function iniciarJogo() {
    menuNiveis.style.display = "none";
    menuIntervalos.style.display = "none";
    palavraBox.style.display = "flex";
    opcoesContainer.style.display = "flex";
    contadorContainer.style.display = "flex";
    palavrasParaOJogo.sort(() => Math.random() - 0.5);
    acertos = 0; erros = 0;
    acertosBox.textContent = "0"; errosBox.textContent = "0";
    proximaRodada();
}

function proximaRodada() {
    if (palavrasParaOJogo.length === 0) { finalizarTeste(); return; }
    palavraAtualObjeto = palavrasParaOJogo.shift();
    palavraBox.textContent = palavraAtualObjeto.exibir;
    opcoesContainer.innerHTML = "";
    criarOpcoes(palavraAtualObjeto);
}

function criarOpcoes(objetoAtual) {
    let opcoes = [objetoAtual.correta];
    while (opcoes.length < 4) {
        const sorteio = vocabulario[Math.floor(Math.random() * vocabulario.length)].correta;
        if (!opcoes.includes(sorteio)) opcoes.push(sorteio);
    }
    opcoes.sort(() => Math.random() - 0.5).forEach(opcao => {
        const btn = document.createElement("button");
        btn.className = "opcao-btn";
        btn.textContent = opcao;
        btn.onclick = () => {
            const todos = document.querySelectorAll(".opcao-btn");
            todos.forEach(b => b.disabled = true);
            if (opcao === objetoAtual.correta) {
                btn.classList.add("correta");
                acertos++; acertosBox.textContent = acertos;
            } else {
                btn.classList.add("errada");
                erros++; errosBox.textContent = erros;
                todos.forEach(b => { if (b.textContent === objetoAtual.correta) b.classList.add("correta"); });
            }
            setTimeout(proximaRodada, 1400);
        };
        opcoesContainer.appendChild(btn);
    });
}

function finalizarTeste() {
    palavraBox.textContent = "Teste finalizado!";
    opcoesContainer.style.display = "none";
    btnReiniciar.style.display = "block";
}

// Test line: Git 25 update confirmed.
