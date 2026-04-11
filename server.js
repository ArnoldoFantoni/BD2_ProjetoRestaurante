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

        //inserts
        const clientes = db.collection('cliente');
        const cardapio = db.collection('cardapio');
        const pedidos = db.collection('pedidos');


        // ROTA LISTAR CLIENTES
        app.get('/clientes', async (req, res) => {
            try {
                const dados = await clientes.find().toArray();
                res.json(dados);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao buscar clientes" });
            }
        });


        // ROTA INSERT CARDAPIO
        app.post('/cardapio', async (req, res) => {
            try {
                const novoItem = req.body; // Pega os dados enviados pelo fetch

                // Comando do MongoDB para inserir um documento
                const result = await cardapio.insertOne(novoItem);

                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao inserir no cardápio" });
            }
        });

        //ROTA LISTAR CARDAPIO
       app.get('/cardapio-completo', async (req, res) => {
            try {
                const filtro = {};
            
                if (req.query.tipo) {
                    filtro.tipo = req.query.tipo;
                }
            
                const itens = await db.collection('cardapio').find(filtro).toArray();
                res.json(itens);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao buscar cardápio" });
            }
        });

        //ROTA INSERT PEDIDOS
        app.post('/pedidos', async (req, res) => {
            try {
                const novoPedido = req.body; // Pega os dados enviados pelo fetch

                // Comando do MongoDB para inserir um documento
                const result = await pedidos.insertOne(novoPedido);

                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao inserir pedido" });
            }
        });

        app.get('/pedidos', async (req, res) => {
            try {
                const dados = await pedidos.find().toArray();
                res.json(dados);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao buscar pedidos" });
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