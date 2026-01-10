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
const areaRevisao = document.getElementById("area-revisao");
const corpoTabela = document.getElementById("corpo-tabela");
const listaTemasBotoes = document.getElementById("lista-temas-botoes");

// Versão atualizada
menuUsuarios.insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem; margin-top:20px;">Version 0.64</p>');

const meusDicionarios = ["verbos"]; 
let vocabulario = []; 
let palavrasParaOJogo = [];
let palavraAtualObjeto = null;
let acertos = 0;
let erros = 0;
let usuarioAtual = "";

window.onload = gerarMenuTemas;

// ==========================================
// NAVEGAÇÃO E USUÁRIOS
// ==========================================

function selecionarUsuario(nome) {
    usuarioAtual = nome;
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

// ==========================================
// LÓGICA DE REVISÃO
// ==========================================

function registrarErro(objeto) {
    const chave = `erros_${usuarioAtual}`;
    let lista = JSON.parse(localStorage.getItem(chave)) || [];
    if (!lista.find(item => item.exibir === objeto.exibir)) {
        lista.push(objeto);
        localStorage.setItem(chave, JSON.stringify(lista));
    }
}

function abrirRevisao() {
    menuHub.style.display = "none";
    areaRevisao.style.display = "flex";
    renderizarTabela();
}

function fecharRevisao() {
    areaRevisao.style.display = "none";
    menuHub.style.display = "flex";
}

function renderizarTabela() {
    corpoTabela.innerHTML = "";
    const chave = `erros_${usuarioAtual}`;
    const lista = JSON.parse(localStorage.getItem(chave)) || [];

    lista.forEach((item, index) => {
        const tr = document.createElement("tr");
        
        // Se houver múltiplas traduções separadas por /, mostra com vírgula
        const significadoFormatado = item.correta.replace(/\//g, ", ");

        tr.innerHTML = `
            <td class="col-palavra">${item.exibir.toUpperCase()}</td>
            <td class="col-pronuncia">/pronúncia/</td>
            <td class="col-significado">${significadoFormatado.toLowerCase()}</td>
            <td><button class="btn-remover" onclick="removerErro(${index})">X</button></td>
        `;
        corpoTabela.appendChild(tr);
    });
}

function removerErro(index) {
    const chave = `erros_${usuarioAtual}`;
    let lista = JSON.parse(localStorage.getItem(chave)) || [];
    lista.splice(index, 1);
    localStorage.setItem(chave, JSON.stringify(lista));
    renderizarTabela();
}

// ==========================================
// CORE DO JOGO
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
    statusLoad.textContent = "Carregando...";
    fetch(`dicionarios/${arquivo}.txt`)
        .then(res => res.text())
        .then(texto => {
            const linhas = texto.split(/\r?\n/).filter(l => l.includes("="));
            vocabulario = linhas.map(linha => {
                const [esq, dir] = linha.split("=");
                return { exibir: esq.trim(), correta: dir.trim() };
            });
            menuTemas.style.display = "none";
            menuPrincipal.style.display = "flex";
            statusLoad.style.display = "none";
        });
}

function abrirMenuNiveis() { menuPrincipal.style.display = "none"; menuNiveis.style.display = "flex"; }
function abrirMenuIntervalos() { menuPrincipal.style.display = "none"; menuIntervalos.style.display = "flex"; }
function iniciarNivel(qtd) { palavrasParaOJogo = vocabulario.slice(0, qtd); iniciarJogo(); }
function iniciarIntervalo(i, f) { palavrasParaOJogo = vocabulario.slice(i, f); iniciarJogo(); }

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
                registrarErro(objetoAtual); // SALVA O ERRO
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
