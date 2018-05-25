const express = require('express');
const fs = require('fs');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');
var db = require('./dbJson.js');
let valores = [];
const file = 'c:/valor.json';


const connection = mysql.createConnection({
    host: 'localhost', 
    user:'projeti',
    password:'gerico14599',
    database: 'server_sensor'
});

conect();

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req,res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-with,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});

//definindo as rotas
const router = express.Router();

router.post('/enviarbd', (req, res) => {
    valores = req.body;
    var formhora =  formData("hora"); 
    var formdata = formData("data");
    //console.log('[' + formhora + '] valore.length => ' + valores.length);
    console.log('[' + formhora + '] Requisição para salvar informações via POST');
    var local = __dirname + '/db/'+ formdata +'.json';
    var fileContent = fs.exists(local, function(exists){
    if(exists){
        console.log("[" + formhora + "] O arquivo já existe");
        console.log("[" + formhora + "] Adicionando informações no arquivo: " + formdata + ".json");
        var fileJson = db.getData(formdata);
        fileJson.push(valores);
        db.saveData(fileJson,formdata);
        console.log("[" + formhora + "] Informações adicionadas no arquivo: " + formdata + ".json");
        res.json(fileJson);
    }else{
        console.log("[" + formhora + "] o arquivo não existe");
        console.log("[" + formhora + "] Crinado arquivo: " + formdata + ".json");
        valores = JSON.stringify(valores);
        valores = "[" + valores + "]";
        valores = JSON.parse(valores);
        db.saveData(valores,formdata);
        console.log("[" + formhora + "] Arquivo (" + formdata + ".json ) Criado");
        res.json(valores);
    }
    });
});

router.get('/receberionic', (req, res) => {
    
    var data = req.query.data;
    var formhora =  formData("hora"); 
    console.log("[" + formhora + "] Requisição de informações do dia: ", req.query.data);
    console.log("[" + formhora + "] requisitado pelo ip: ",req.ip);
    console.log("[" + formhora + "] protocol: ",req.protocol);
    var campo = req.query.campo;
    var local = __dirname + '/db/'+ data +'.json';
    var fileContent = fs.exists(local, function(exists){
        if(exists){
            console.log("[" + formhora + "] o arquivo existe");
            var arquivoJson = db.getData(data);
            res.json(arquivoJson);
        }else{
            console.log("[" + formhora + "] o arquivo nao existe");
            res.json({"texto":"Não existe registros para a busca: " + data});
        }
    });
});

app.use('/', router);

function formData(tipo){
    var data = new Date();
    var dia = data.getDate();// 1-31
    var mes = data.getMonth() + 1;// 0-11 (zero=janeiro)
    var ano = data.getFullYear();// 4 dígitos
    var hora = data.getHours();          // 0-23
    var min = data.getMinutes();        // 0-59
    var seg = data.getSeconds();        // 0-59
    var mseg = data.getMilliseconds();   // 0-999
    var formhora = hora + ":" + min + ":" + seg + ":" + mseg; 
    var formdata = dia + "-" + mes + "-" + ano; 
    if(tipo == "hora"){
        return formhora;
    }
    if(tipo == "data"){
        return formdata;
    }
    
}

function conect(val){
    var formhora =  formData("hora");
    connection.connect(function(err){
        if(err){
            return console.log(err);
        }else{
            console.log("[" + formhora + "] Banco de dados conectado");
        }
    });
}

//inicia o servidor
app.listen(port);
console.log('API funcionando!');
