const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");

// ===============================
// VOCABULÁRIO
// ===============================
let vocabulario = {};
let palavras = [];

fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.split("\n");

    linhas.forEach(linha => {
      linha = linha.trim();
      if (!linha || !linha.includes("=")) return;

      const [esquerda, direita] = linha.split("=");

      const match = esquerda.match(/^(.+?)(?:\s*\((.+?)\))?$/);
      if (!match) return;

      const palavra = match[1].trim().toLowerCase();
      const pronuncia = match[2] ? match[2].trim() : "";

      const significados = direita
        .split("/")
        .map(s => s.trim());

      vocabulario[palavra] = significados.map(sig => ({
        significado: sig,
        pronuncia
      }));
    });

    iniciarJogo();
  });

// ===============================
// VARIÁVEIS
// ===============================
let i = 0;
let acertos = 0;
let erros = 0;

// ===============================
// FUNÇÕES
// ===============================
function iniciarJogo() {
  palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);
  mostrarPalavra();
}

function atualizarContadores() {
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

function mostrarPalavra() {
  if (i >= palavras.length) {
    palavraBox.textContent = "Teste finalizado!";
    opcoesContainer.innerHTML = "";
    return;
  }

  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const pronuncia = dados[0].pronuncia;

  const palavraExibir =
    palavra.charAt(0).toUpperCase() + palavra.slice(1);

  palavraBox.textContent = pronuncia
    ? `${palavraExibir} (${pronuncia})`
    : palavraExibir;

  opcoesContainer.innerHTML = "";
  criarOpcoes(palavra);
  atualizarContadores();
}

function criarOpcoes(palavraAtual) {
  const dados = vocabulario[palavraAtual];

  // escolhe UMA tradução correta aleatória
  const corretaObj = dados[Math.floor(Math.random() * dados.length)];
  const correta = corretaObj.significado;

  let opcoes = [correta];

  // 4 opções no total, com limite de tentativas para evitar loop infinito
  let tentativas = 0;
  while (opcoes.length < 4 && tentativas < 20) {
    tentativas++;
    const palavraAleatoria =
      palavras[Math.floor(Math.random() * palavras.length)];
    if (palavraAleatoria === palavraAtual) continue;

    const traducoes = vocabulario[palavraAleatoria];
    const errada =
      traducoes[Math.floor(Math.random() * traducoes.length)].significado;

    if (!opcoes.includes(errada)) {
      opcoes.push(errada);
    }
  }

  // se ainda faltar opções, repetir algumas para completar
  while (opcoes.length < 4) {
    opcoes.push(opcoes[0]);
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.textContent = opcao;
    btn.className = "opcao-btn";

    btn.onclick = () => {
      const botoes = document.querySelectorAll(".opcao-btn");
      botoes.forEach(b => b.disabled = true);

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
      } else {
        btn.classList.add("errada");
        erros++;

        botoes.forEach(b => {
          if (b.textContent === correta) {
            b.classList.add("correta");
          }
        });
      }

      atualizarContadores();
      i++;

      setTimeout(mostrarPalavra, 1400);
    };

    opcoesContainer.appendChild(btn);
  });
}
