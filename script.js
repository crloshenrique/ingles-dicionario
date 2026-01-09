// Test line: Verified compatibility check - 2026-01-09
const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

const menuTemas = document.getElementById("menu-temas");
const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");
const listaTemasBotoes = document.getElementById("lista-temas-botoes");

// Teste de atualização solicitado:
document.getElementById("menu-temas").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Version 3.00.56</p>');

// ==========================================
// CONFIGURAÇÃO DE DICIONÁRIOS (Atualizado para minúsculo)
// ==========================================
const meusDicionarios = ["verbos", "cores", "supermecado", "objetos"]; 

let vocabulario = []; 
let palavrasParaOJogo = [];
let palavraAtualObjeto = null;
let acertos = 0;
let erros = 0;
let historicoResultados = []; 

window.onload = gerarMenuTemas;

function gerarMenuTemas() {
    listaTemasBotoes.innerHTML = "";
    meusDicionarios.forEach(tema => {
        const btn = document.createElement("button");
        btn.textContent = tema.charAt(0).toUpperCase() + tema.slice(1); // Exibe bonito, mas carrega minúsculo
        btn.style.background = "#10a2dd"; 
        btn.onclick = () => carregarVocabulario(tema);
        listaTemasBotoes.appendChild(btn);
    });
}

function carregarVocabulario(arquivo) {
    const statusLoad = document.getElementById("status-load");
    statusLoad.style.display = "block";
    statusLoad.textContent = `Carregando ${arquivo}...`;
    
    vocabulario = []; 

    // Caminho corrigido para pasta sem acento e minúscula
    fetch(`dicionarios/${arquivo}.txt`)
        .then(res => {
            if(!res.ok) throw new Error("Arquivo não encontrado");
            return res.text();
        })
        .then(texto => {
            // RegEx corrigido para aceitar quebras de linha Windows e Unix
            const linhas = texto.split(/\r?\n/)
                                .map(l => l.trim())
                                .filter(l => l !== "" && l.includes("="));
            
            linhas.forEach(linha => {
                const [esquerda, direita] = linha.split("=");
                const exibir = esquerda.trim();
                const traducoes = direita.split("/").map(t => t.trim());

                vocabulario.push({
                    exibir: exibir,
                    correta: traducoes[0],
                    todas: traducoes
                });
            });

            menuTemas.style.display = "none";
            menuPrincipal.style.display = "flex";
            statusLoad.style.display = "none";
        })
        .catch(err => {
            statusLoad.textContent = "Erro ao carregar dicionário!";
            console.error(err);
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

function voltarAoPrincipal() {
    menuNiveis.style.display = "none";
    menuIntervalos.style.display = "none";
    menuPrincipal.style.display = "flex";
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
    if (palavrasParaOJogo.length === 0) return;

    menuNiveis.style.display = "none";
    menuIntervalos.style.display = "none";
    palavraBox.style.display = "flex";
    opcoesContainer.style.display = "flex";
    contadorContainer.style.display = "flex";

    palavrasParaOJogo.sort(() => Math.random() - 0.5);
    
    acertos = 0; 
    erros = 0;
    acertosBox.textContent = "0";
    errosBox.textContent = "0";
    historicoResultados = []; 
    resultadosLista.innerHTML = "";
    btnReiniciar.style.display = "none";
    
    proximaRodada();
}

function proximaRodada() {
    if (palavrasParaOJogo.length === 0) {
        finalizarTeste();
        return;
    }

    palavraAtualObjeto = palavrasParaOJogo.shift();
    palavraBox.textContent = palavraAtualObjeto.exibir;
    opcoesContainer.innerHTML = "";
    criarOpcoes(palavraAtualObjeto);
}

function criarOpcoes(objetoAtual) {
    const correta = objetoAtual.correta;
    let opcoes = [correta];

    while (opcoes.length < 4) {
        const sorteio = vocabulario[Math.floor(Math.random() * vocabulario.length)];
        const distracao = sorteio.correta;
        if (!opcoes.includes(distracao)) opcoes.push(distracao);
    }

    opcoes.sort(() => Math.random() - 0.5);

    opcoes.forEach(opcao => {
        const btn = document.createElement("button");
        btn.className = "opcao-btn";
        btn.textContent = opcao;
        btn.onclick = () => {
            const todos = document.querySelectorAll(".opcao-btn");
            todos.forEach(b => b.disabled = true);

            let itemHistorico = {
                texto: `${objetoAtual.exibir} = ${correta}`,
                cor: ""
            };

            if (opcao === correta) {
                btn.classList.add("correta");
                acertos++;
                acertosBox.textContent = acertos;
                itemHistorico.cor = "#4CAF50";
            } else {
                btn.classList.add("errada");
                erros++;
                errosBox.textContent = erros;
                itemHistorico.cor = "#f44336";
                todos.forEach(b => { if (b.textContent === correta) b.classList.add("correta"); });
            }

            historicoResultados.push(itemHistorico);
            setTimeout(proximaRodada, 1400);
        };
        opcoesContainer.appendChild(btn);
    });
}

function finalizarTeste() {
    palavraBox.textContent = "Teste finalizado!";
    opcoesContainer.style.display = "none";
    historicoResultados.forEach(item => {
        const box = document.createElement("div");
        box.textContent = item.texto;
        box.style.cssText = `background:${item.cor}; color:white; padding:12px; border-radius:10px; font-weight:bold; margin-bottom: 8px;`;
        resultadosLista.appendChild(box);
    });
    btnReiniciar.style.display = "block";
}
