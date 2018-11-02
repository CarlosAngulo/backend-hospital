var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var app = express();

app.post('/', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if ( !userDB ) {
            return res.status(400).json({
                ok: false,
                message: 'Wrong credentials - email',
                err: { message: 'Wrong credentials - email' }
            });
        }

        if ( !bcrypt.compareSync( body.password || '' , userDB.password ) ){
            return res.status(400).json({
                ok: false,
                message: 'Wrong credentials - password',
                err: { message: 'Wrong credentials - password' }
            });
        }

        // Create a token
        userDB.password = ':)';
        let token = jwt.sign({ user: userDB }, '@this-is-a-hard-seed@', { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB.id
        });
    })


});

module.exports = app;