const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // serve para criptografar a senha no BD.
const db= require('../db/database');

const  app = express();
app.use(cors()); // Libera acesso de outras origens
app.use(express.json()); // Permite receber JSON no body das requisições

const PORT = 3000;
const SALT_ROUNDS = 10; // Número de rounds para o bcrypt

// Rota para registrar um novo usuário/
app.post("/api/users", async (req, res) => {
    try{
        const { nome, email, senha } = req.body;
        
        //Validação dos campos obrigatórios
        if (!nome || !email || !senha) {
            return res.status(400).json ({
                error: "Todos os campos são obrigatótios."
            });
        }

        const emaiLowerCase = email.toLowerCase();

        // Verificar se o email já está em uso
        const [rows] = await db.query("SELECT id FROM usuarios WHERE email = ?",
        [emaiLowerCase]);

        if (rows.length > 0) {
            return res.status(409).
            json({error: "Email já cadastrado. "});
        }

        //Criptografai da senha
        const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);

        // Inserir um novo usuário 
        const [result] = await db.query(
            "INSERT INTO usuarios (nome, email, passwordHash, createAT) VALUES (?,?,?, NOW())",
            [nome, emaiLowerCase, passwordHash]
        );

        const id = result.insertId;

        res.status(201).json({
            id,
            nome,
            email: emaiLowerCase
        });

    } catch (error) {
        console.error("Erro ao criar o usuário.", error);
        res.status(500).json({
            error: "Erro interno ao criar o usuário."
        });
    }
});



// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});