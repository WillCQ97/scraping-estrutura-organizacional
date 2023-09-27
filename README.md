# scraping-estrutura-organizacional

## Sobre
- Uso do puppeter e chat GPT para gerar um json contendo a [Estrutura Organizacional da UFES](https://servidor.ufes.br/EstruturaOrganizacional/index.jsp).
- A tabela de estrutura organizacional da ufes apresenta as unidades organizacionais em uma estrutura em árvore.
- Basicamente, uma linha pode estar recuada indicando que essa linha é filha da anterior. Conforme exemplo:
```
Linha 1
  -> Linha 1.1
     -> Linha 1.1.1
  -> Linha 1.2
Linha 2
```
- Analisando o código fonte da página, é possível verificar que para gerar essa estrutura para a tabela foi utilizado um plugin para JQuery chamado [jquery-treetable](https://github.com/ludo/jquery-treetable).

## Funcionamento
- Esse robo obtém as linhas das tabelas e as trata como nós em uma árvore.
- Então é gerado um objeto javascript para cada nó com os atributos sendo os dados das colunas, como por exemplo `{nomeUnidade: "", codigo: "", id: "", idNodoPai: ""}`.
- A lista contendo todos os nós será então percorrida e para cada elemento será verificado se ele possui um pai ou não, sendo então colocado em um array.
- Se o nó não possui pai, fica na raiz do array, senão é procurado o pai existente no array e o filho é adicionado ao array "filhos" desse nó.
