const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o seu HTML acesse o servidor

const uri = "mongodb://localhost:27017/";
// const uri = "mongodb://127.0.0.1:27017?directConnection=true";
const client = new MongoClient(uri);
// const dbName = "restaurante";
const dbName = "cliente";

async function main() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB com sucesso!");
        const db = client.db(dbName);
        const cardapio = db.collection('cardapio');
        const pedidos = db.collection('pedidos');

        // --- MÉTODOS DO TRABALHO ---

        // // 1. INSERT: Adicionar novo prato
        // app.post('/cardapio', async (req, res) => {
        //     const novoPrato = req.body;
        //     const result = await cardapio.insertOne(novoPrato);
        //     res.send(result);
        // });

        // // 2. FIND: Buscar pratos por tipo (ex: sobremesa)
        // app.get('/cardapio/:tipo', async (req, res) => {
        //     const tipo = req.params.tipo;
        //     const pratos = await cardapio.find({ tipo: tipo }).toArray();
        //     res.send(pratos);
        // });

        // // 3. UPDATE: Atualizar preço de um prato
        // app.put('/cardapio/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const novoPreco = req.body.preco;
        //     const result = await cardapio.updateOne(
        //         { _id: new ObjectId(id) },
        //         { $set: { preco: novoPreco } }
        //     );
        //     res.send(result);
        // });

        // // 4. DELETE: Excluir prato
        // app.delete('/cardapio/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const result = await cardapio.deleteOne({ _id: new ObjectId(id) });
        //     res.send(result);
        // });

        // // 5. AGGREGATE: Valor total de pedidos por cliente
        // app.get('/relatorio-pedidos', async (req, res) => {
        //     const resultado = await pedidos.aggregate([
        //         {
        //             $group: {
        //                 _id: "$cliente",
        //                 totalGasto: { $sum: "$valorTotal" }
        //             }
        //         }
        //     ]).toArray();
        //     res.send(resultado);
        // });

        // Adicione isso no seu server.js
        // app.get('/debug-banco', async (req, res) => {
        //     try {
        //         const db = client.db("restaurante");
                
        //         // Isso vai listar todas as coleções que existem nesse banco
        //         const colecoes = await db.listCollections().toArray();
        //         const nomesColecoes = colecoes.map(c => c.name);
                
        //         // Tenta buscar na coleção 'cliente'
        //         const dados = await db.collection("cliente").find().toArray();
                
        //         res.json({ 
        //             banco_conectado: "restaurante",
        //             colecoes_existentes: nomesColecoes,
        //             total_dados_na_colecao_cliente: dados.length,
        //             dados: dados 
        //         });
        //     } catch (err) {
        //         res.status(500).json({ erro: err.message });
        //     }
        // });
        
        // app.get('/teste-escrita', async (req, res) => {
        //     try {
        //         const db = client.db("cliente");
        //         const colecao = db.collection("cliente");
                
        //         // Vamos inserir um cliente de teste
        //         await colecao.insertOne({ nome: "Teste Conexao Node", data: new Date() });
                
        //         // Vamos listar o que o Node vê agora
        //         const colecoesNoBanco = await db.listCollections().toArray();
        //         const dadosAtuais = await colecao.find().toArray();
                
        //         res.json({ 
        //             mensagem: "Documento de teste inserido!",
        //             colecoes_que_o_node_ve: colecoesNoBanco.map(c => c.name),
        //             dados_na_colecao: dadosAtuais
        //         });
        //     } catch (err) {
        //         res.status(500).json({ erro: err.message });
        //     }
        // });

        // Adicione isso no seu server.js
        app.get('/teste-conexao', async (req, res) => {
            try {
                const db = client.db("cliente");
                const listaClientes = await db.collection("cliente").find().toArray();
                res.json({ status: "Conectado!", dados: listaClientes });
            } catch (err) {
                res.status(500).json({ status: "Erro", mensagem: err.message });
            }
        });

        app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));

    } catch (e) {
        console.error(e);
    }
}

main();