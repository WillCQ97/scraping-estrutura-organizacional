const puppeteer = require("puppeteer");
const fs = require("fs");

async function robo() {
  console.log("Inicializando o robozinho");

  const baseLink = "https://servidor.ufes.br/EstruturaOrganizacional/index.jsp";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Acessando página " + baseLink);
  await page.goto(baseLink);

  // Realizando scraping dos dados da tabela
  const nodos = await page.evaluate(() => {
    function getPropertiesFromTableData(colunas, idNodo, idNodoPai) {
      nodo = {};
      nodo.id = idNodo;
      nodo.idNodoPai = idNodoPai;
      nodo.nomeUnidade = colunas[0].innerText.trim();
      nodo.sigla = colunas[1].innerText.trim();
      nodo.codigo = colunas[2].innerText.trim();
      nodo.codigoSiape = colunas[3].innerText.trim();
      nodo.tipo = colunas[4].innerText.trim();
      nodo.situacao = colunas[5].innerText.trim();
      nodo.chefe = colunas[6].innerText.trim();
      return nodo;
    }

    // Obtém a tabela pelo ID
    const tabela = document.getElementById("tree");
    let listaDeNodos = [];

    // Obtém todas as linhas da tabela
    const linhas = tabela.getElementsByTagName("tr");
    for (let i = 1; i < linhas.length; i++) {
      let linha = linhas[i];
      let colunas = linha.getElementsByTagName("td");

      let atributoIdLinha = linha.attributes.getNamedItem("data-tt-id");
      let atributoIdLinhaPai =
        linha.attributes.getNamedItem("data-tt-parent-id");

      let idLinha = -1;
      if (atributoIdLinha) {
        idLinha = atributoIdLinha.value;
      }

      idLinhaPai = -1;
      if (atributoIdLinhaPai) {
        idLinhaPai = atributoIdLinhaPai.value;
      }

      listaDeNodos.push(
        getPropertiesFromTableData(colunas, idLinha, idLinhaPai)
      );
    }
    return listaDeNodos;
  });

  await browser.close();

  // Após obter os nós, criar a árvore
  function criarArvore(lista) {
    const nodes = {};
    const arvore = [];

    // Passo 1: Crie um objeto com nós indexados por id
    lista.forEach((item) => {
      const { id, idNodoPai } = item;
      nodes[id] = { ...item, unidades: [] }; // renomeado filhos para unidades
    });

    // Passo 2 e 3: Adicione cada nó à lista de filhos do nó pai
    lista.forEach((item) => {
      const { id, idNodoPai } = item;
      if (idNodoPai === -1) {
        arvore.push(nodes[id]);
      } else {
        nodes[idNodoPai].unidades.push(nodes[id]); // renomeado filhos para unidades
      }
    });

    // Passo 4: Retorne a árvore resultante
    return arvore;
  }

  arvore = criarArvore(nodos);

  let json = JSON.stringify(arvore);
  let file = "./estruturaOrganizacional.json";

  console.log("Salvando os dados em " + file);
  fs.writeFile(file, json, "utf-8", function (err) {
    if (err) return console.log(err);
  });

  console.log("Finalizando por hoje!");
}

robo();
