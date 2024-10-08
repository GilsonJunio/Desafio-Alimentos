const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const app = express();

require('dotenv').config({path:'.env.production'})
/*console.log(process.env)
*/

const client = new Pool({
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT
})
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
/*console.log(process.env)
console.log(client)*/

/*const criarTabela = client.query(`
    CREATE TABLE alimentos if not exists(
    id SERIAL PRIMARY KEY,
    Fruta VARCHAR(20) NOT NULL,
    Vegetal VARCHAR(20) NOT NULL,
    Enlatado VARCHAR(20) NOT NULL,
    )

    `)
const inserirDados = client.query(`
    CREATE TABLE alimentos if not exists(
    id SERIAL PRIMARY KEY,
    Fruta VARCHAR(20) NOT NULL,
    Vegetal VARCHAR(20) NOT NULL,
    Enlatado VARCHAR(20) NOT NULL,
    )

    `)*/


const port = 6000;
const address = 'http://localhost:';


app.use(express.json());
app.use(cors());

app.get('/buscarAlimentos',(req, res) => {
    client.query(`
        CREATE TABLE if not exists alimentos(
        id SERIAL PRIMARY KEY,
        nome VARCHAR(20) NOT NULL,
        tipo_de_alimento VARCHAR(20) NOT NULL,
        data_de_validade DATE,
        preco DECIMAL(10,2)
        estoque INT,
        fornecedor VARCHAR(50),
        descricao VARCHAR(100),
        url_imagem TEXT,
        )`
    )
//	console.log(query)

    res.status(200).json('Alimentos buscados com sucesso!');
});

app.post('/enviarAlimentos', (req, res) => {
    console.log()
    const dadosEnviados = {
        AlimentoRecebido:req.body.alimento,
        TipoDeAlimentoRecebido:req.body.tipodealimento
    };
    console.log(dadosEnviados)
    if(dadosEnviados.AlimentoRecebido === ''|| dadosEnviados.TipoDeAlimentoRecebido === ''){
        res.status(400).json('Alimento vazio ou nenhum tipo de alimento especificado');        
    }
    else {
/*     client.query(`
        INSERT INTO alimentos(fruta, vegetal, enlatado,data_de_validade,preco,fornecedor,url_imagem)
        values($1,$2,$3))`
    )
*/
        
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
