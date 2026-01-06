// ===============================
// ELEMENTOS
// ===============================
const palavraBox = document.getElementById("palavra-box");
const mensagemDiv = document.getElementById("mensagem");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");

// ===============================
// RECORDE
// ===============================
let recorde = 0;

fetch("recorde.txt")
  .then(res => res.text())
  .then(texto => recorde = parseInt(texto) || 0)
  .catch(() => recorde = 0);

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
    finalizar();
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

  mensagemDiv.textContent = "";
  opcoesContainer.innerHTML = "";

  criarOpcoes(palavra);
  atualizarContadores();
}

function criarOpcoes(palavraAtual) {
  const dados = vocabulario[palavraAtual];

  const corretaObj =
    dados[Math.floor(Math.random() * dados.length)];
  const correta = corretaObj.significado;

  let opcoes = [correta];

  while (opcoes.length < 3) {
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

      i++;
      atualizarContadores();

      setTimeout(mostrarPalavra, 1000);
    };

    opcoesContainer.appendChild(btn);
  });
}

function finalizar() {
  palavraBox.textContent = "✅ Teste finalizado!";
  opcoesContainer.innerHTML = "";

  if (acertos > recorde) {
    fetch("recorde.txt", {
      method: "POST",
      body: String(acertos)
    });
    mensagemDiv.innerHTML = `<br>🏆 Novo recorde! (${acertos})`;
  } else {
    mensagemDiv.innerHTML = `<br>Acertos: ${acertos} | Recorde: ${recorde}`;
  }
}
