<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Treino de Inglês</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    #container {
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    #palavra-box {
      background-color: #ff7f50;
      color: white;
      font-size: 2rem;
      font-weight: bold;
      padding: 40px 20px;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      margin-bottom: 20px;
      min-height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #progresso-box {
      background-color: #333;
      color: #fff;
      font-size: 1.2rem;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      margin-bottom: 20px;
    }

    #resposta {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      margin-bottom: 5px;
      border-radius: 8px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      margin-bottom: 5px;
      border-radius: 8px;
      cursor: pointer;
      background-color: #4CAF50;
      color: white;
      border: none;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #45a049;
    }

    #mensagem {
      font-size: 16px;
      min-height: 20px;
      margin-bottom: 2px;
      color: #333;
    }

    #traducao-box {
      background-color: #fff;
      color: #333;
      font-size: 24px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      margin-bottom: 15px;
      min-height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: color 0.3s;
    }

    #contador-container {
      display: flex;
      justify-content: space-between;
      margin-top: 2px;
    }

    #acertos-box, #erros-box {
      flex: 1;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      padding: 12px 0;
      border-radius: 12px;
      color: white;
      margin: 0 5px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    }

    #acertos-box { background-color: #4CAF50; }
    #erros-box { background-color: #f44336; }

    /* Menu inicial */
    #menu-inicial {
      background-color: #fff;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      margin-bottom: 20px;
    }

    .menu-btn {
      width: 48%;
      padding: 12px;
      font-size: 16px;
      margin: 5px 1%;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      color: white;
    }

    .btn-ingles { background-color: #2196F3; }
    .btn-portugues { background-color: #FF9800; }

    .menu-titulo {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }

  </style>
</head>
<body>

  <div id="container">

    <!-- Menu inicial -->
    <div id="menu-inicial">
      <div class="menu-titulo">Responder em:</div>
      <button class="menu-btn btn-ingles" onclick="escolherLingua('ingles')">Inglês</button>
      <button class="menu-btn btn-portugues" onclick="escolherLingua('portugues')">Português</button>
    </div>

    <!-- Retângulo da palavra -->
    <div id="palavra-box" style="display:none;">Carregando...</div>

    <!-- Retângulo do progresso -->
    <div id="progresso-box" style="display:none;">Acertos: 0 / 0</div>

    <!-- Input -->
    <input id="resposta" type="text" placeholder="Digite a tradução" autocomplete="off" style="display:none;">

    <!-- Retângulo da tradução correta -->
    <div id="traducao-box" style="display:none;"></div>

    <!-- Botão -->
    <button onclick="responder()" style="display:none;">Responder</button>

    <!-- Mensagem -->
    <div id="mensagem" style="display:none;"></div>

    <!-- Contadores de acertos/erros -->
    <div id="contador-container" style="display:none;">
      <div id="acertos-box">0</div>
      <div id="erros-box">0</div>
    </div>

  </div>

  <script src="vocabulario.js"></script>
  <script src="script.js"></script>

</body>
</html>

