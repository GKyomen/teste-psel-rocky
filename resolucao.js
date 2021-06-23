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
 * Calcula o valor total de uma categoria somando os preços dos produtos da mesma.
 * @param {JSON} data JSON do banco de dados com dados corrigidos e ordenados por categoria
 * @returns vetor em que cada posição contém o valor total de uma categoria diferente de produtos
 */
function stockValueByCategory(data) {
    let catValues = [], catIndex = -1;

    for(i in data) {
        if((i > 0 && data[i].category != data[i - 1].category) || (i == 0)) {
            catIndex++;
            catValues.push({
                'category': data[i].category,
                'quantity': 0
            });
        }

        catValues[catIndex].quantity += data[i].quantity;
    }

    return catValues;
}

/* PROGRAMA PRINCIPAL */