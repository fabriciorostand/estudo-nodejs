const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Verifique se o header Authorization está presente
    if (!authHeader) {
        console.error('Token de autenticação não fornecido');
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Token decodificado com sucesso: ${JSON.stringify(decoded)}`);
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        console.error('Token inválido ou expirado:', error.message);
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = authMiddleware;