// ===============================
// ELEMENTOS
// ===============================
const palavraBox = document.getElementById("palavra-box");
const progressoBox = document.getElementById("progresso-box");
const input = document.getElementById("resposta");
const mensagemDiv = document.getElementById("mensagem");
const traducaoBox = document.getElementById("traducao-box");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");

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

      // Palavra e pronúncia
      const match = esquerda.match(/^(.+?)(?:\s*\((.+?)\))?$/);
      if (!match) return;

      const palavra = match[1].trim().toLowerCase();
      const pronuncia = match[2] ? match[2].trim() : "";

      // Significados
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
// VARIÁVEIS DO JOGO
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

// Atualizar progresso
function atualizarProgresso() {
  progressoBox.textContent = `Acertos: ${acertos} / ${palavras.length}`;
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

// Mostrar palavra
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

  input.value = "";
  input.focus();
  mensagemDiv.textContent = "";

  traducaoBox.textContent = "";
  traducaoBox.style.color = "#333";

  atualizarProgresso();
}

// Responder
function responder() {
  if (i >= palavras.length) return;

  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const resposta = input.value.trim().toLowerCase();

  if (!resposta) return;

  const significados = dados.map(d => d.significado);
  const significadosLower = significados.map(s => s.toLowerCase());

  const correto = significadosLower.includes(resposta);

  traducaoBox.textContent = significados.join(" / ");
  traducaoBox.style.color = correto ? "green" : "red";

  if (correto) {
    acertos++;
  } else {
    erros++;
  }

  i++;
  atualizarProgresso();

  setTimeout(mostrarPalavra, 1400);
}

// Finalizar
function finalizar() {
  palavraBox.textContent = "✅ Teste finalizado!";
  input.disabled = true;
  traducaoBox.textContent = "";
  atualizarProgresso();

  if (acertos > recorde) {
    recorde = acertos;
    fetch("recorde.txt", {
      method: "POST",
      body: String(acertos)
    });
    mensagemDiv.innerHTML = `<br>🏆 Novo recorde! Acertos: ${acertos}`;
  } else {
    mensagemDiv.innerHTML = `<br>Você acertou ${acertos} palavras. Seu recorde: ${recorde}`;
  }
}

// ===============================
// EVENTOS
// ===============================
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    responder();
  }
});
