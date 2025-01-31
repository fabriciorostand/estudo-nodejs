const express = require('express');
const cors = require('cors');
const UserModel = require('../src/models/user.model');
const { login } = require('../src/controllers/login.controller');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.use(express.json());

// Configuração do CORS
const corsOptions = {
    origin: 'https://fabriciorostand.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware de Logging
app.use((req, res, next) => {
    console.log(`Request Type: ${req.method}`);
    console.log(`Content Type: ${req.headers["content-type"]}`);
    console.log(`Date: ${new Date()}`);

    next();
});

// Adicionando Log na Rota de Login
app.post('/login', (req, res, next) => {
    console.log('Login route accessed');
    next();
}, login);

// Outras Rotas
app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'O e-mail fornecido é inválido.' });
        }

        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já foi usado para cadastrar uma conta.' });
        }

        const user = await UserModel.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.patch('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint não encontrado' });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));