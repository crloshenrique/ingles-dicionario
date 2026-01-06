// Elementos
const palavraBox = document.getElementById("palavra-box");
const progressoBox = document.getElementById("progresso-box");
const input = document.getElementById("resposta");
const mensagemDiv = document.getElementById("mensagem");
const traducaoBox = document.getElementById("traducao-box");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");

// Recorde
let recorde = 0;
fetch("recorde.txt")
  .then(res => res.text())
  .then(texto => {
    recorde = parseInt(texto) || 0;
  })
  .catch(() => {
    recorde = 0;
  });

// Embaralhar palavras
const palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);

let i = 0;
let acertos = 0;
let erros = 0;
const totalPalavras = palavras.length;

// Atualizar progresso
function atualizarProgresso() {
  progressoBox.textContent = `Acertos: ${acertos} / ${totalPalavras}`;
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

// Mostrar palavra atual
function mostrarPalavra() {
  if (i >= palavras.length) {
    finalizar();
    return;
  }

  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const pronuncia = Array.isArray(dados) ? dados[0].pronuncia : dados.pronuncia;

  // Palavra em inglês com inicial maiúscula
  const palavraExibir = palavra.charAt(0).toUpperCase() + palavra.slice(1);
  palavraBox.textContent = `${palavraExibir} (${pronuncia})`;
  palavraBox.style.color = "white";

  input.value = "";
  input.focus();
  mensagemDiv.textContent = "";

  // Resetar retângulo de tradução
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

  let correto = false;
  let significadosArray = [];

  if (Array.isArray(dados)) {
    significadosArray = dados.map(d => d.significado);
    const significadosLower = significadosArray.map(d => d.toLowerCase());
    if (significadosLower.includes(resposta)) correto = true;
  } else {
    significadosArray = [dados.significado];
    if (resposta === dados.significado.toLowerCase()) correto = true;
  }

  // Mostrar tradução correta com cor
  traducaoBox.textContent = significadosArray.join(" / ");
  traducaoBox.style.color = correto ? "green" : "red";

  // Atualizar acertos e erros
  if (correto) {
    acertos++;
  } else {
    erros++;
  }

  i++;
  atualizarProgresso();

  // Pequeno delay para permitir ver a tradução antes de ir para a próxima palavra
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

// Enter no input envia
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    responder();
  }
});

// Começa o jogo
mostrarPalavra();
