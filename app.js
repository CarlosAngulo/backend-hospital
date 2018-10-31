//Requires
var express = require('express');
var mongoose = require('mongoose');

//Init vars
var app = express();

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err )  throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0n', 'online');    
})

//Routes
app.get( '/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Sucessful request.'
    });
})


//Listen requests
app.listen(3000, () => console.log('Express server port 3000: \x1b[32m%s\x1b[0n', 'online'));