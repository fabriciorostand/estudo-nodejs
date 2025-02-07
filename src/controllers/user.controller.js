const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const generateToken = require('../services/auth.service'); // Ajuste o caminho conforme necessário

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createUser = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'O e-mail fornecido é inválido.' });
        }

        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já foi usado para cadastrar uma conta.' });
        }

        const salt = await bcrypt.genSalt(10); // Gera um sal com 10 rounds
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // Hasheia a senha com o sal

        const user = new UserModel({
            email: req.body.email,
            password: hashedPassword, // Armazena a senha hasheada
            name: req.body.name,
            role: req.body.role // Certifique-se de que o papel está incluído
        });

        await user.save();
        const token = generateToken(user); // Gera o token para o novo usuário
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
