const fs = require('fs');

/* FUNÇÕES DA QUESTÃO 1 */

/** 
 * Lê um arquivo JSON e transforma-o em objeto. Referência para criação da função: http://bit.ly/rwJSONfile
 * @param {string} filePath caminho do arquivo a ser lido 
 * @returns o objeto em caso de sucesso ou 0 em caso de erro
 */  
function jsonReader(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (e) {
        return 0;
    }
}

/**
 * Escreve um JSON em um arquivo. Referência para criação da função: http://bit.ly/rwJSONfile
 * @param {string} newFilePath caminho do arquivo a ser escrito. Sobrescreve caso já exista
 * @param {JSON} jsonObj JSON a ser escrito no arquivo
 * @returns 1 em caso de sucesso ou 0 em caso de erro
 */
function jsonWriter(newFilePath, jsonObj) {
    try {
        fs.writeFileSync(newFilePath, JSON.stringify(jsonObj, null, 2));
        return 1;
    } catch (e) {
        return 0;
    }
}

/**
 * Recebe o JSON do banco de dados corrompido e corrige o nome dos produtos, que estão com caracteres errados
 * @param {JSON} data JSON com os nomes corrompidos
 */
function fixDataNames(data) {
    for (const i in data) {
        data[i].name = data[i].name.replace(/æ/g, 'a').replace(/¢/g, 'c').replace(/ø/g, 'o').replace(/ß/g, 'b');
    }
}

/**
 * Recebe o JSON do banco de dados corrompido e corrige o preço dos produtos, que estão com o tipo de dado errado
 * @param {JSON} data JSON com os preços corrompidos
 */
function fixDataPrices(data) {
    for (const i in data) {
        if (typeof (data[i].price) == 'string') {
            data[i].price = parseFloat(data[i].price);
        }
    }
}

/**
 * Recebe o JSON do banco de dados corrompido e corrige os produtos que não estavam em estoque, que estão sem a quantidade marcada
 * @param {JSON} data JSON com o atributo quantidadade faltando
 */
function fixDataQuantity(data) {
    for (const i in data) {
        if (!data[i].hasOwnProperty('quantity')) {
            data[i].quantity = 0;
        }
    }
}

/* FUNÇÕES DA QUESTÃO 2 */

/**
 * Ordena os objetos do JSON do banco de dados já corrigido de acordo com sua categoria, desempatando pelo ID do produto. Imprime o nome dos produtos ao fim da ordenação
 * @param {JSON} data JSON do banco de dados com dados corrigidos
 */
function sortAndPrintData(data) {
    //compara um objeto com o próximo pela categoria em caixa alta (evitando erros), colocando em ordem alfabética. Repete para todos os objetos
    data.sort(function(a, b) {
        a = a.category.toUpperCase();
        b = b.category.toUpperCase();
        return (a > b) ? 1 : (a < b) ? -1 : 0;
    });

    //compara um objeto com o próximo, colocando produtos de mesma categoria em ordem crescente de ID's. Repete para todos os objetos
    data.sort(function(a, b) {
        if(a.category == b.category) {
            return a.id - b.id;
        }
    });

    //imprime os nomes dos produtos após ambas as ordenações
    for(i in data) {
        console.log(data[i].name);
    }
}

/**
 * Calcula a quantidade total de uma categoria somando as quantidades dos produtos da mesma.
 * @param {JSON} data JSON do banco de dados com dados corrigidos e ordenados por categoria
 * @returns vetor em que cada posição contém a quantidade total de produtos de uma categoria diferente de produtos
 */
function stockQuantityByCategory(data) {
    let catQuantities = [], catIndex = -1;

    for(i in data) {
        //como as categorias estão ordenadas, basta comparar a categoria do objeto atual com a do anterior.
        if((i > 0 && data[i].category != data[i - 1].category) || (i == 0)) {
            //se a categoria for diferente ou se for o primeiro produto da lista, inclui um novo item no vetor de valores de categoria
            catIndex++;
            catQuantities.push({
                'category': data[i].category,
                'quantity': 0
            });
        }

        //soma na quantidade total de produtos da categoria atual a quantidade do produto atual
        catQuantities[catIndex].quantity += data[i].quantity;
    }

    return catQuantities;
}

/* PROGRAMA PRINCIPAL */

const brokenDBPath = 'broken-database.json';
const fixedDBPath = 'saida.json';

//leitura do banco de dados corrompido
let brokenJSON = jsonReader(brokenDBPath);

//correção e exportação dos dados para um banco de dados corrigido em caso de leitura bem sucedida
if(brokenJSON != 0) {
    fixDataNames(brokenJSON);
    fixDataPrices(brokenJSON);
    fixDataQuantity(brokenJSON);
    jsonWriter(fixedDBPath, brokenJSON);
}

//leitura do banco de dados corrigido (nessa etapa, a variável 'brokenJSON' já foi corrigida, mas ler o arquivo gerado garante que a função de exportação está correta)
let fixedJSON = jsonReader(fixedDBPath);

//verificação dos dados corrigidos em caso de leitura bem sucedida
if(fixedJSON != 0) {
    sortAndPrintData(fixedJSON);
    console.log(stockQuantityByCategory(fixedJSON));
}