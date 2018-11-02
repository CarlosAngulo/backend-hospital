//Requires
var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/app')
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var bodyParser = require('body-parser');


//Init vars
var app = express();

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err )  throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0n', 'online');    
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Listen requests
app.listen(3000, () => console.log('Express server port 3000: \x1b[32m%s\x1b[0n', 'online'));