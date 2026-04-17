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
                if(req.query.nome){
                    filtro.nome = { $regex: req.query.nome, $options: 'i' };
                }
            
                const itens = await db.collection('cardapio').find(filtro).toArray();
                res.json(itens);
                
            } catch (err) {
                res.status(500).json({ erro: "Erro ao buscar cardápio" });
            }
        });

        app.get('/pedidos/:id', async (req, res) => {
            try {
                const pedido = await pedidos.findOne({ idPedido: req.params.id });

                if (!pedido) {
                    return res.status(404).json({ erro: "Pedido nao encontrado" });
                }

                res.json(pedido);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao buscar pedido" });
            }
        });

        app.put('/pedidos/:id', async (req, res) => {
            try {
                const pedidoAtualizado = {
                    idPedido: req.params.id,
                    cliente: req.body.cliente,
                    mesa: req.body.mesa || "",
                    status: req.body.status,
                    dataPedido: req.body.dataPedido || "",
                    itens: req.body.itens,
                    observacoes: req.body.observacoes || "",
                    total: Number(req.body.total)
                };

                if (!pedidoAtualizado.cliente || !pedidoAtualizado.status || !pedidoAtualizado.itens || Number.isNaN(pedidoAtualizado.total)) {
                    return res.status(400).json({ erro: "Preencha os campos obrigatorios do pedido." });
                }

                const result = await pedidos.replaceOne(
                    { idPedido: req.params.id },
                    pedidoAtualizado
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ erro: "Pedido nao encontrado" });
                }

                res.json({ mensagem: "Pedido alterado com sucesso." });
            } catch (err) {
                res.status(500).json({ erro: "Erro ao alterar pedido" });
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

        app.get('/pedidos-total-por-cliente', async (req, res) => {
            try {
                const totais = await pedidos.aggregate([
                    {
                        $group: {
                            _id: '$cliente',
                            totalGasto: { $sum: { $toDouble: '$total' } }
                        }
                    },
                    {
                        $sort: { totalGasto: -1 }
                    }
                ]).toArray();
            
                res.json(totais);
            } catch (err) {
                res.status(500).json({ erro: "Erro ao calcular total por cliente" });
            }
        });     

         app.delete('/pedidos/:id', async (req, res) => {
            try {
                const result = await pedidos.deleteOne({ idPedido: req.params.id });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ erro: "Pedido nao encontrado" });
                }

                res.json({ mensagem: "Pedido excluido com sucesso." });
            } catch (err) {
                res.status(500).json({ erro: "Erro ao excluir pedido" });
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