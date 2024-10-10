/*
TODO:
Definir função para validar valores
*/

const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const app = express();

require('dotenv').config({path:'.env.development'})
/*console.log(process.env)
*/

const client = new Pool({
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
})

async function buscarDados(){
    const buscar = await client.query("SELECT * FROM alimentos")
    const dados =  await buscar.rows
    console.log(buscar)
    console.log(dados)
    return dados
}
buscarDados()
/*const createPool = () => { 
    if (process.env.NODE_ENV === "production") {
        return new Pool({ connectionString: process.env.DB_URL, ssl: { rejectUnauthorized: false } });
    } 
    else {
        return new Pool({
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: 'admin',
            port: process.env.DB_PORT
        });
    }
};*/


const port = 6000;
const address = 'http://localhost:';

function Validar_Valores(DadoRecebido,DadoNecessario){
    const tipoDeDadoRecebido = typeof DadoRecebido
    const tipoDeDadoNecessario = typeof DadoNecessario[1]
    if(tipoDeDadoRecebido!=tipoDeDadoNecessario){
        console.log('Dados incompatíveis!')
    }
}
Validar_Valores('olá!',0)

app.use(express.json());
app.use(cors());

app.get('/buscarAlimentos', (req, res) => {
    const buscar = buscarDados()
    buscar.then(dados =>{
    res.status(200).send(dados);    
    })
//    res.send(dados)
    
});

app.post('/enviarAlimentos', (req, res) => {
    const dadosRecebidos = req.body
   // console.log(dadosRecebidos)

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
    console.log(dadosParaEnviar)
    if(dadosParaEnviar.AlimentoRecebido === ''|| dadosParaEnviar.TipoDeAlimentoRecebido === ''){
        res.status(400).json('Alimento vazio ou nenhum tipo de alimento especificado');        
    }
    else {
     client.query(`
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
    const dadosEditar = req.body;
    res.status(200).json('Alimentos editados com sucesso!');
});

app.delete('/removerAlimentos', (req, res) => {
    const dadosDeletar = req.body;
    res.status(200).json('Alimentos removidos com sucesso!');
});

app.listen(port, () => {
    console.log('Servidor aberto na porta ' + port);
});
