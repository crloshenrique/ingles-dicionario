// Elementos
const menuIdioma = document.getElementById("menu-idioma");
const palavraBox = document.getElementById("palavra-box");
const progressoBox = document.getElementById("progresso-box");
const input = document.getElementById("resposta");
const mensagemDiv = document.getElementById("mensagem");
const traducaoBox = document.getElementById("traducao-box");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const botaoResponder = document.querySelector("button");

// Variáveis do jogo
let idiomaSelecionado = null;
let palavras = [];
let i = 0;
let acertos = 0;
let erros = 0;

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

// Função chamada ao escolher idioma
function escolherLingua(idioma) {
  idiomaSelecionado = idioma;

  // Inicializa palavras embaralhadas
  palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);
  i = 0;
  acertos = 0;
  erros = 0;

  // Esconde menu e mostra elementos do jogo
  menuIdioma.style.display = "none";
  palavraBox.style.display = "flex";
  progressoBox.style.display = "block";
  input.style.display = "block";
  botaoResponder.style.display = "block";
  mensagemDiv.style.display = "block";
  traducaoBox.style.display = "flex";
  document.getElementById("contador-container").style.display = "flex";

  mostrarPalavra();
}

// Atualizar progresso
function atualizarProgresso() {
  progressoBox.textContent = `Acertos: ${acertos} / ${palavras.length}`;
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

  let palavraExibir = "";
  let pronuncia = "";

  if (idiomaSelecionado === "ingles") {
    palavraExibir = palavra.charAt(0).toUpperCase() + palavra.slice(1);
    pronuncia = Array.isArray(dados) ? dados[0].pronuncia : dados.pronuncia;
    palavraBox.textContent = `${palavraExibir} (${pronuncia})`;
  } else {
    palavraExibir = Array.isArray(dados) ? dados[0].significado : dados.significado;
    palavraBox.textContent = palavraExibir;
  }

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

  let correto = false;
  let significadosArray = [];

  if (Array.isArray(dados)) {
    significadosArray = dados.map(d => d.significado);
    const significadosLower = significadosArray.map(d => d.toLowerCase());
    if (idiomaSelecionado === "ingles") {
      if (significadosLower.includes(resposta)) correto = true;
    } else {
      // Português -> responder em inglês
      const palavrasIngles = dados.map(d => d.palavra.toLowerCase ? d.palavra.toLowerCase() : d.palavra);
      if (palavrasIngles.includes(resposta)) correto = true;
    }
  } else {
    significadosArray = [dados.significado];
    if (idiomaSelecionado === "ingles") {
      if (resposta === dados.significado.toLowerCase()) correto = true;
    } else {
      if (resposta === dados.palavra.toLowerCase()) correto = true;
    }
  }

  // Mostrar tradução correta
  if (idiomaSelecionado === "ingles") {
    traducaoBox.textContent = significadosArray.join(" / ");
  } else {
    const palavrasIngles = Array.isArray(dados) ? dados.map(d => d.palavra) : [dados.palavra];
    traducaoBox.textContent = palavrasIngles.join(" / ");
  }
  traducaoBox.style.color = correto ? "green" : "red";

  // Atualizar contadores
  if (correto) acertos++;
  else erros++;

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

// Enter envia
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    responder();
  }
});
