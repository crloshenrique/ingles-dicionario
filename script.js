// ===============================
// ELEMENTOS
// ===============================
const palavraBox = document.getElementById("palavra-box");
const mensagemDiv = document.getElementById("mensagem");
const traducaoBox = document.getElementById("traducao-box");

// ===============================
// RECORDE
// ===============================
let recorde = 0;

fetch("recorde.txt")
  .then(res => res.text())
  .then(texto => {
    recorde = parseInt(texto) || 0;
  })
  .catch(() => {
    recorde = 0;
  });

// ===============================
// VOCABULÁRIO (arquivo txt)
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

      // Ex: Wait (uêt) = Esperar / Aguardar
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
        pronuncia: pronuncia
      }));
    });

    iniciarJogo();
  });

// ===============================
// VARIÁVEIS
// ===============================
let i = 0;

// ===============================
// FUNÇÕES
// ===============================
function iniciarJogo() {
  palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);
  mostrarPalavra();
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

  palavraBox.style.color = "white";

  traducaoBox.textContent = dados.map(d => d.significado).join(" / ");
  traducaoBox.style.color = "#333";

  mensagemDiv.textContent = "";

  i++;

  setTimeout(mostrarPalavra, 2000);
}

function finalizar() {
  palavraBox.textContent = "✅ Finalizado!";
  traducaoBox.textContent = "";
  mensagemDiv.textContent = `Total de palavras: ${palavras.length}`;
}
