// Test line: Verified compatibility check - 2026-01-10
const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const btnReiniciar = document.getElementById("btn-reiniciar");

const menuUsuarios = document.getElementById("menu-usuarios");
const menuHub = document.getElementById("menu-hub");
const menuTemas = document.getElementById("menu-temas");
const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");
const listaTemasBotoes = document.getElementById("lista-temas-botoes");

// Versão 0.78 - Com histórico detalhado de respostas
menuUsuarios.insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem; margin-top:20px;">Version 0.79</p>');

const meusDicionarios = [
    { arquivo: "verbosi", exibicao: "Verbos I" }
]; 

let vocabulario = []; 
let palavrasParaOJogo = [];
let historicoPartida = []; // Armazena os acertos e erros da rodada atual
let acertos = 0;
let erros = 0;

window.onload = gerarMenuTemas;

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

function voltarAoMenuPraticar() {
    menuNiveis.style.display = "none";
    menuIntervalos.style.display = "none";
    menuPrincipal.style.display = "flex";
}

function voltarParaDicionarios() {
    menuPrincipal.style.display = "none";
    menuTemas.style.display = "flex";
}

function gerarMenuTemas() {
    listaTemasBotoes.innerHTML = "";
    meusDicionarios.forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = item.exibicao; 
        btn.className = "btn-azul"; 
        btn.onclick = () => carregarVocabulario(item.arquivo);
        listaTemasBotoes.appendChild(btn);
    });
}

function carregarVocabulario(arquivo) {
    const statusLoad = document.getElementById("status-load");
    statusLoad.style.display = "block";
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
        })
        .catch(err => {
            console.error("Erro ao carregar dicionário:", err);
            alert("Erro ao carregar o arquivo: " + arquivo);
            statusLoad.style.display = "none";
        });
}

function abrirMenuNiveis() { menuPrincipal.style.display = "none"; menuNiveis.style.display = "flex"; }
function abrirMenuIntervalos() { menuPrincipal.style.display = "none"; menuIntervalos.style.display = "flex"; }

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
    btnReiniciar.style.display = "none";
    
    palavrasParaOJogo.sort(() => Math.random() - 0.5);
    historicoPartida = []; // Reseta o histórico visual da rodada
    
    acertosBox.textContent = acertos; 
    errosBox.textContent = erros;
    
    proximaRodada();
}

function proximaRodada() {
    if (palavrasParaOJogo.length === 0) { finalizarTeste(); return; }
    let atual = palavrasParaOJogo.shift();
    palavraBox.textContent = atual.exibir;
    opcoesContainer.innerHTML = "";
    
    let opcoes = [atual.correta];
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
            
            if (opcao === atual.correta) {
                btn.classList.add("correta");
                acertos++; 
                acertosBox.textContent = acertos;
                historicoPartida.push(`<span style="color:#4CAF50">✔ ${atual.exibir} = ${atual.correta}</span>`);
            } else {
                btn.classList.add("errada");
                erros++; 
                errosBox.textContent = erros;
                todos.forEach(b => { if (b.textContent === atual.correta) b.classList.add("correta"); });
                historicoPartida.push(`<span style="color:#f44336">✖ ${atual.exibir} (Era: ${atual.correta})</span>`);
            }
            setTimeout(proximaRodada, 1400);
        };
        opcoesContainer.appendChild(btn);
    });
}

function finalizarTeste() {
    palavraBox.textContent = "Resumo do Teste";
    opcoesContainer.style.display = "flex"; // Usamos para mostrar o histórico
    opcoesContainer.style.flexDirection = "column";
    opcoesContainer.style.fontSize = "0.9rem";
    opcoesContainer.style.textAlign = "left";
    opcoesContainer.style.maxHeight = "300px";
    opcoesContainer.style.overflowY = "auto";
    opcoesContainer.style.background = "#fff";
    opcoesContainer.style.padding = "10px";
    opcoesContainer.style.borderRadius = "10px";

    opcoesContainer.innerHTML = historicoPartida.join("<br>");
    
    btnReiniciar.style.display = "block";
    btnReiniciar.textContent = "Voltar ao Menu";
    btnReiniciar.onclick = () => {
        opcoesContainer.style.flexDirection = "row"; // Reseta layout
        opcoesContainer.style.display = "none";
        palavraBox.style.display = "none";
        btnReiniciar.style.display = "none";
        menuPrincipal.style.display = "flex";
    };
}

// Test line: Git 25 update confirmed.
