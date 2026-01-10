// Test line: Verified compatibility check - 2026-01-10
const container = document.getElementById("container");
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
const areaRevisao = document.getElementById("area-revisao");
const corpoTabela = document.getElementById("corpo-tabela");
const listaTemasBotoes = document.getElementById("lista-temas-botoes");

const meusDicionarios = ["verbos"]; 
let vocabulario = []; 
let palavrasParaOJogo = [];
let acertos = 0;
let erros = 0;
let usuarioAtual = ""; 

window.onload = () => {
    menuUsuarios.style.display = "flex";
    menuHub.style.display = "none";
    gerarMenuTemas();
};

function selecionarUsuario(nome) {
    usuarioAtual = nome;
    menuUsuarios.style.display = "none";
    menuHub.style.display = "flex";
}

function sair() { window.location.reload(); }

function irParaTemas() { menuHub.style.display = "none"; menuTemas.style.display = "flex"; }
function voltarParaHub() { menuTemas.style.display = "none"; menuHub.style.display = "flex"; }
function voltarAoMenuPraticar() { menuNiveis.style.display = "none"; menuIntervalos.style.display = "none"; menuPrincipal.style.display = "flex"; }
function voltarParaDicionarios() { menuPrincipal.style.display = "none"; menuTemas.style.display = "flex"; }

// ==========================================
// REVISÃO
// ==========================================

function registrarErro(objeto) {
    if (!usuarioAtual) return;
    const chave = `erros_${usuarioAtual}`;
    let lista = JSON.parse(localStorage.getItem(chave)) || [];
    if (!lista.some(item => item.exibir === objeto.exibir)) {
        lista.push(objeto);
        localStorage.setItem(chave, JSON.stringify(lista));
    }
}

function abrirRevisao() {
    menuHub.style.display = "none";
    areaRevisao.style.display = "flex";
    // Faz o container crescer para a tabela ficar larga
    container.classList.add("container-largo");
    renderizarTabela();
}

function fecharRevisao() {
    areaRevisao.style.display = "none";
    menuHub.style.display = "flex";
    // Volta o container ao tamanho normal
    container.classList.remove("container-largo");
}

function renderizarTabela() {
    corpoTabela.innerHTML = "";
    const chave = `erros_${usuarioAtual}`;
    const lista = JSON.parse(localStorage.getItem(chave)) || [];

    if (lista.length === 0) {
        corpoTabela.innerHTML = "<tr><td colspan='3' style='padding:30px'>Lista vazia</td></tr>";
        return;
    }

    lista.forEach((item) => {
        let p = item.exibir;
        let pron = "";
        if (p.includes("(")) {
            const m = p.match(/(.*)\((.*)\)/);
            if (m) { p = m[1].trim(); pron = m[2].trim(); }
        }
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="col-palavra">${p}</td>
            <td class="col-pronuncia">${pron.toLowerCase()}</td>
            <td class="col-significado">${item.correta.replace(/\//g, ", ").toLowerCase()}</td>
        `;
        corpoTabela.appendChild(tr);
    });
}

function limparTudo() {
    if (confirm("Deseja apagar todos os seus erros salvos?")) {
        localStorage.removeItem(`erros_${usuarioAtual}`);
        renderizarTabela();
    }
}

// ==========================================
// JOGO (IGUAL)
// ==========================================

function carregarVocabulario(arquivo) {
    document.getElementById("status-load").style.display = "block";
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
            document.getElementById("status-load").style.display = "none";
        });
}

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

function abrirMenuNiveis() { menuPrincipal.style.display = "none"; menuNiveis.style.display = "flex"; }
function abrirMenuIntervalos() { menuPrincipal.style.display = "none"; menuIntervalos.style.display = "none"; menuIntervalos.style.display = "flex"; }
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
    const atual = palavrasParaOJogo.shift();
    palavraBox.textContent = atual.exibir;
    opcoesContainer.innerHTML = "";
    let opcoes = [atual.correta];
    while (opcoes.length < 4) {
        const sorteio = vocabulario[Math.floor(Math.random() * vocabulario.length)].correta;
        if (!opcoes.includes(sorteio)) opcoes.push(sorteio);
    }
    opcoes.sort(() => Math.random() - 0.5).forEach(opcao => {
        const btn = document.createElement("button");
        btn.className = "opcao-btn"; btn.textContent = opcao;
        btn.onclick = () => {
            const todos = document.querySelectorAll(".opcao-btn");
            todos.forEach(b => b.disabled = true);
            if (opcao === atual.correta) { btn.classList.add("correta"); acertos++; acertosBox.textContent = acertos; }
            else { btn.classList.add("errada"); erros++; errosBox.textContent = erros; registrarErro(atual); 
                   todos.forEach(b => { if (b.textContent === atual.correta) b.classList.add("correta"); }); }
            setTimeout(proximaRodada, 1400);
        };
        opcoesContainer.appendChild(btn);
    });
}

function finalizarTeste() {
    palavraBox.textContent = "Fim!";
    opcoesContainer.style.display = "none";
    btnReiniciar.style.display = "block";
}

// Test line: Git 25 update confirmed.
