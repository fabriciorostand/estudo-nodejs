const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const generateToken = require('../services/auth.service'); // Ajuste o caminho conforme necessário
const fs = require('fs');
const path = require('path');

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao obter todos os usuários:', error.message);
        res.status(500).json({ message: 'Erro ao obter usuários', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id, 'name email profilePic'); // Inclua o campo profilePic aqui
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao obter usuário por ID:', error.message);
        res.status(500).json({ message: 'Erro ao obter usuário', error: error.message });
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
            role: req.body.role, // Certifique-se de que o papel está incluído
            profilePic: req.body.profilePic // Adicione a propriedade profilePic
        });

        await user.save();
        const token = generateToken(user); // Gera o token para o novo usuário
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (req.user.id !== id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso não autorizado' });
        }

        if (req.body.name) {
            user.name = req.body.name;
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.body.profilePic) {
            user.profilePic = req.body.profilePic;
        }

        await user.save();
        res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id); // Usar findByIdAndDelete para deletar o usuário
        if (!user) {
            console.error(`Usuário com ID ${id} não encontrado`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        console.log(`Usuário com ID ${id} deletado com sucesso.`);
        res.status(200).json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
        console.error(`Erro ao excluir usuário com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro ao excluir usuário', error: error.message });
    }
};

const uploadProfilePic = async (req, res) => {
    try {
        console.log(`Requisição recebida para upload de foto de perfil de usuário: ${req.user ? req.user.id : 'undefined'}`);
        if (!req.user || !req.user.id) {
            console.error('Usuário não autenticado');
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const userId = req.user.id;
        console.log(`Processando upload de foto de perfil para o usuário com ID: ${userId}`);

        const user = await UserModel.findById(userId);
        if (!user) {
            console.error(`Usuário com ID ${userId} não encontrado`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Apagar a imagem antiga, se existir
        if (user.profilePic) {
            const oldImagePath = path.resolve(user.profilePic);
            console.log(`Tentando apagar a imagem antiga: ${oldImagePath}`);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log(`Imagem antiga apagada: ${oldImagePath}`);
            } else {
                console.log(`Imagem antiga não encontrada: ${oldImagePath}`);
            }
        }

        user.profilePic = req.file.path; // Salvar o caminho da nova imagem no banco de dados
        await user.save();

        console.log(`Foto de perfil atualizada com sucesso para o usuário com ID: ${userId}`);
        res.status(200).json({ message: 'Foto de perfil atualizada com sucesso!', profilePic: user.profilePic });
    } catch (error) {
        console.error('Erro ao atualizar foto de perfil:', error.message);
        res.status(500).json({ message: 'Erro ao atualizar foto de perfil', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    uploadProfilePic
};