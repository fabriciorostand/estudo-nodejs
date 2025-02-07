const checkRole = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (roles.includes(role)) {
            next();
        } else {
            res.status(403).json({ message: 'Acesso negado: permissões insuficientes' });
        }
    };
};

module.exports = checkRole;