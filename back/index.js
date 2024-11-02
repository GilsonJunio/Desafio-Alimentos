/*
TODO:
Definir função para validar valores
*/
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const app = express();
const port = 6000;
const address = 'http://localhost:';
require('dotenv').config({path:'.env.development'})

const createPool = () => { 
    if (process.env.NODE_ENV === "production") {
        return new Pool({ connectionString: process.env.DB_URL, ssl: { rejectUnauthorized: false } });
    } 
    else {
        return new Pool({
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            host: process.env.DB_URL,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
        });
    }
};

async function buscarDados(){
    const buscar = await pool.query("SELECT * FROM alimentos ORDER BY id")
    const dados =  await buscar.rows
    console.log(buscar)
    console.log(dados)
    return dados
}



const pool = createPool()

app.use(express.json());
app.use(cors());

app.get('/buscarAlimentos', async(req, res) => {

    const buscar = buscarDados()
    buscar.then(dados =>{
    res.status(200).send(dados);    
    })

});


app.post('/enviarAlimentos', (req, res) => {
    const dadosRecebidos = req.body
   console.log(dadosRecebidos)

    const dadosParaEnviar = {
        Nome_Do_Alimento_Recebido: dadosRecebidos.dadosfornecidos.alimento,
        Data_De_Validade_Recebida: dadosRecebidos.dadosfornecidos.data_de_validade,
        Estoque_Recebido: dadosRecebidos.dadosfornecidos.estoque,
        Preco_Recebido: dadosRecebidos.dadosfornecidos.preco,
        Imagem_Recebida: dadosRecebidos.dadosfornecidos.imagem,
        Descricao_Recebida: dadosRecebidos.dadosfornecidos.descricao,
        Fornecedor_Recebido: dadosRecebidos.dadosfornecidos.fornecedor,
        Tipo_De_Alimento_Recebido: dadosRecebidos.tipodealimento,
    };
    //console.log(dadosParaEnviar)
    if(dadosParaEnviar.AlimentoRecebido === ''|| dadosParaEnviar.TipoDeAlimentoRecebido === ''){
        res.status(400).json('Alimento vazio ou nenhum tipo de alimento especificado');        
    }
    else {
     pool.query(`
        INSERT INTO alimentos(nome,tipo_de_alimento,data_de_validade,preco,fornecedor,url_imagem,descricao,estoque)
        values($1,$2,$3,$4,$5,$6,$7,$8)`,[
        dadosParaEnviar.Nome_Do_Alimento_Recebido,
        dadosParaEnviar.Tipo_De_Alimento_Recebido,
        dadosParaEnviar.Data_De_Validade_Recebida,
        dadosParaEnviar.Preco_Recebido,
        dadosParaEnviar.Fornecedor_Recebido,
        dadosParaEnviar.Imagem_Recebida,
        dadosParaEnviar.Descricao_Recebida,
        dadosParaEnviar.Estoque_Recebido,
        ])

        
    }
});

app.put('/editarAlimentos', (req, res) => {
    const dados = req.body.dadosparaeditar;
    
    console.log(dados.campo_tipodealimento)
    pool.query(
        `UPDATE alimentos SET nome=$1, tipo_de_alimento=$2, data_de_validade=$3, preco=$4, estoque=$5, fornecedor=$6, descricao=$7, url_imagem=$8 WHERE id=$9 `
        ,[
            dados.campo_fruta,
            dados.campo_tipodealimento,
            dados.campo_datadevalidade,
            dados.campo_preco,
            dados.campo_estoque,
            dados.campo_fornecedor,
            dados.campo_descricao,
            dados.url_imagem,
            dados.campo_iddalinha])

    res.status(200).json('Alimentos editados com sucesso!');
});

app.delete('/removerAlimentos', (req, res) => {
    const dadosDeletar = req.body;
    console.log(dadosDeletar)
    pool.query(`DELETE FROM alimentos WHERE id=$1`,[dadosDeletar.linhaParaApagar])
    res.status(200).json('Alimentos removidos com sucesso!');
});

app.listen(port, () => {
    console.log('Servidor aberto na porta ' + port);
});
