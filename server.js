const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./src/database/connect');
const userRoutes = require('./src/routes/user.routes');
const loginRoutes = require('./src/routes/login.routes');

// Configurações de ambiente
dotenv.config();

// Conectar ao banco de dados
connectToDatabase();

// Inicialização do aplicativo Express
const app = express();
app.use(express.json());

// Configuração dinâmica do CORS
const allowedOrigins = ['https://fabriciorostand.github.io', 'http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Permitir requisições sem origem (como Postman)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`Origin not allowed by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
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

// Redirecionar para HTTPS em Produção
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

// Rotas
app.use('/api', userRoutes);
app.use('/login', loginRoutes);

// Middleware para lidar com endpoints não encontrados
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint não encontrado' });
});

// Inicialização do servidor
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));