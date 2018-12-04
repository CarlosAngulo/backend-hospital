var express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();

app.get('/:type/:img', (req, res) => {

    let type = req.params.type;
    let img = req.params.img;
    let imgPath = path.resolve( __dirname, `../upload/${type}/${img}` );

    if ( fs.existsSync(imgPath) ) {
        res.sendFile( imgPath );
    } else {
        let pathNoImage = path.resolve( __dirname, '../assets/no-image.png' );
        res.sendFile( pathNoImage );
    }

});

module.exports = app;