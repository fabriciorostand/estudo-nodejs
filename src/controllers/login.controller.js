const UserModel = require('../models/user.model');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado.'});
        }

        if (user.password !== password) {
            return res.status(400).json({ success: false, message: 'Senha incorreta.' });
        }

        res.status(200).json({ success: true, name: user.name, message: 'Login realizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
};

module.exports = { login };