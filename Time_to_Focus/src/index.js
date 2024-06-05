/*
const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const sessao = session({
    secret: '2C44-4D44-WppQ38S',
    resave: false, // Alterado para false para evitar salvamento desnecessário da sessão
    saveUninitialized: false, // Alterado para false para evitar criação de sessões não modificadas
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Definindo tempo de expiração da sessão, por exemplo, 24 horas
});

const port = 3000;
var path = require('path');

app.use(sessao);

// Middleware para inicialização de sessão no Socket.IO
io.use((socket, next) => {
    sessao(socket.request, {}, next);
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));

let totalVisitas = 0;

// Middleware para controlar a primeira visita à rota /
app.use((req, res, next) => {
    if (!req.session.visitouPaginaInicial && req.path === '/') {
        req.session.visitouPaginaInicial = true;
        totalVisitas++;
        req.session.visitas = totalVisitas;
        io.emit('visita', totalVisitas);
    } else if (req.session.visitouPaginaInicial) {
        req.session.visitas = totalVisitas; // Atualizar a sessão com o total de visitas
    }
    next();
});

app.get('/', function(req,res){
    res.render('inicial');
});

app.get('/pomodoro', function(req,res){
    res.render('pomodoro');
});

app.get('/feynman', function(req,res){
    res.render('metodoFeynman');
});

server.listen(port, ()=>{
    console.log('Site está rodando na porta 3000!');
});

io.on('connection', function(socket){
    if (socket.request.session.visitouPaginaInicial) {
        socket.emit('visita', totalVisitas);
    }
});*/
// server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const ACCESS_FILE = path.join(__dirname, 'access_count.txt');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));

// Função para ler a contagem de acessos do arquivo
const readAccessCount = () => {
    try {
        const data = fs.readFileSync(ACCESS_FILE, 'utf8');
        return parseInt(data, 10) || 0;
    } catch (error) {
        return 0; // Se o arquivo não existir ou houver erro, retornar 0
    }
};

// Função para salvar a contagem de acessos no arquivo
const writeAccessCount = (count) => {
    fs.writeFileSync(ACCESS_FILE, count.toString(), 'utf8');
};

let accessCount = readAccessCount();

app.use(cookieParser());

app.get('/', (req, res) => {
    if (!req.cookies.accessed) {
        accessCount++;
        writeAccessCount(accessCount);
        res.cookie('accessed', 'true', { maxAge: 86400000 }); // Cookie válido por 1 dia
    }
    res.render('inicial', { accessCount });
});

app.get('/pomodoro', (req, res) => {
    res.render('pomodoro', { accessCount });
});

app.get('/feynman', function(req,res){
    res.render('metodoFeynman', { accessCount });
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
