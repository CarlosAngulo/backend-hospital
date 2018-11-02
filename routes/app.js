var express = require('express');
var app = express();

//Routes
app.get( '/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Sucessful request.'
    });
});


module.exports = app;