const fs = require('fs');
const path = require('path');

// Criar uma pasta
// fs.mkdir(path.join(__dirname, '/test'), (error) => {
//     if (error) {
//         return console.log("Erro: ", error);
//     }

//     console.log("Pasta criada com sucesso!");
// });

// Criar um arquivo 
// fs.writeFile(path.join(__dirname, '/test', 'test.txt'), 'Hello, Node!', (error) => {
//     if (error) {
//         return console.log("Erro: ", error);
//     }

//     console.log("Aqruivo criado com sucesso!");
// });

// Adicionar à um arquivo
// fs.appendFile(path.join(__dirname, '/test', 'test.txt'), ' Hello, World!', (error) => {
//     if (error) {
//         return console.log('Erro: ', error);
//     }

//     console.log('Arquivo modificado com sucesso!')
// });

// Ler arquivo
// fs.readFile(path.join(__dirname, '/test', 'test.txt'), 'utf-8', (error, data) => {
//     if (error) {
//         return console.log("Erro: ", error);
//     }

//     console.log(data);
// });