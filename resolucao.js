const fs = require('fs');

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