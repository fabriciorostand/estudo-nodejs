const express = require('express');
const cors = require('cors');
const UserModel = require('../src/models/user.model');
const { login } = require('../src/controllers/login.controller');

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.protocol === 'http') {
            return res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.use(express.json());

const corsOptions = {
    origin: 'https://fabriciorostand.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`Request Type: ${req.method}`);
    console.log(`Content Type: ${req.headers["content-type"]}`);
    console.log(`Date: ${new Date()}`);

    next();
});

app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});

        res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.post('/login', login);

app.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const user = await UserModel.findById(id);

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error.message);
    }
})

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
})

app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const user = await UserModel.findByIdAndDelete(id);

        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});  

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));