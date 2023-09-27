// Gerado pelo chatGPT em 26/09/2023
/* PROMPT
Utilizando javascript temos o seguinte cenário: há uma lista de objetos com cada objeto possuindo um id e um idPai, 
o último referencia a algum outro objeto na lista. Dada essa lista, montar um objeto adicionando a 
propriedade filhos contendo os nós que são filhos do nó atual. Assim, para a entrada 
"[{id: 1, idPai: -1}, {id:2, idPai: -1}, {id:3, idPai: 2}, {id:4, idPai:1}]" é esperada a 
saída "[
    {id:1, idPai: -1, filhos: [{id:4, idPai:1}]},
    {id:2, idPai: -1, filhos: [{id:3, idPai:2}]}
]". Gere um código que resolva esse problema.
*/

function criarArvore(lista) {
  const nodes = {};
  const arvore = [];

  // Passo 1: Crie um objeto com nós indexados por id
  lista.forEach(item => {
    const { id, idPai } = item;
    nodes[id] = { ...item, filhos: [] };
  });

  // Passo 2 e 3: Adicione cada nó à lista de filhos do nó pai
  lista.forEach(item => {
    const { id, idPai } = item;
    if (idPai === -1) {
      arvore.push(nodes[id]);
    } else {
      nodes[idPai].filhos.push(nodes[id]);
    }
  });

  // Passo 4: Retorne a árvore resultante
  return arvore;
}

const entrada = [
  { id: 1, idPai: -1 },
  { id: 2, idPai: -1 },
  { id: 3, idPai: 2 },
  { id: 4, idPai: 1 },
  { id: 5, idPai: 4 }
];

const arvoreResultante = criarArvore(entrada);
console.log(JSON.stringify(arvoreResultante)); // apenas utilizei o JSON para imprimir no terminal todo o objeto
