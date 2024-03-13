const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');

const port = 3000;
var path = require('path');
const app = express();

app.use(session({secret:'2h1vbjwbqndj2b1i4k1n4'}));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));


app.get('/', function(req,res){
    res.render('inicial');
});

app.get('/pomodoro', function(req,res){
    res.render('pomodoro');
});

app.listen(port, ()=>{
    console.log('Site está rodando na porta 3000!');
});