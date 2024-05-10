const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const sessao = session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
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
});
