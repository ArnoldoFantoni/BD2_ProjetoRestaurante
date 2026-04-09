const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = "restaurante"; // O nome do banco

async function main() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const clientes = db.collection('cliente');

        // Rota principal para listar clientes
        app.get('/clientes', async (req, res) => {
            try {
                const dados = await clientes.find().toArray();
                res.json(dados);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao buscar clientes" });
            }
        });

        app.listen(3000, () => {
            console.log("🚀 Servidor rodando em http://localhost:3000");
        });

    } catch (e) {
        console.error("❌ Erro na conexão:", e);
    }
}

main();