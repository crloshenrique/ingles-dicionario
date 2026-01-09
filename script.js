const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Teste de atualização:
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Version 3.00.46</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = []; 
let palavrasParaOJogo = [];
let palavraAtualObjeto = null;

let acertos = 0;
let erros = 0;
let historicoResultados = []; 

/* ===============================
   CARREGAR VOCABULÁRIO
================================ */
fetch("Dicionários/vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.split("\n")
                        .map(l => l.trim())
                        .filter(l => l.includes("="));
    
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

    document.getElementById("status-load").style.display = "none";
    document.getElementById("btn-niveis").style.display = "block";
    document.getElementById("btn-intervalos").style.display = "block";
  });

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
        acertosBox.textContent = acertos; // Atualiza placar na hora
        itemHistorico.cor = "#4CAF50";
      } else {
        btn.classList.add("errada");
        erros++;
        errosBox.textContent = erros; // Atualiza placar na hora
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
