const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.tuc1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('Conexão ao banco de dados realizada com sucesso!');
    } catch (error) {
        console.log('Ocorreu um erro ao tentar se conectar com o banco de dados: ', error);
    }
};

module.exports = connectToDatabase;