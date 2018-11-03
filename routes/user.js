var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var mdAutentication = require('../middlewares/autentication');

var app = express();

// ===========================
// Get all users
// ===========================

app.get( '/', (req, res) => {
    User
    .find({}, 'name email img role')
    .exec(
        (err, users) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    message: 'DB error loading users',
                    error: err
                });
            };

            res.status(200).json({
                ok: true,
                users
            });
        }
    )
});


// ===========================
// Create a new user
// ===========================

app.post( '/', mdAutentication.verifyToken, (req, res, next) => {

    var body = req.body;
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save( (err, savedUser) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving the user',
                error: err
            });
        }
        res.status(201).json({
            ok: true,
            user: savedUser,
            userToken: req.user
        });

    });

});

// ===========================
// Update user data 
// ===========================

app.put('/:id', mdAutentication.verifyToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    User.findById(id, (err, user) => {    

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding a user',
                error: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: `User with the id ${id} was not found`,
                error: { message: 'User with such ID does not exist'}
            })
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
        user.save( (err, savedUser ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating the user',
                    error: err
                });
            }

            user.password = ';)';

            res.status(200).json({
                ok: true,
                user: savedUser
            })

        });

    });

});

// ===========================
// Deleting user by ID 
// ===========================

app.delete('/:id', mdAutentication.verifyToken, (req, res) => {
    
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) =>  {
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user',
                error: err
            });
        }

        if ( !deletedUser ) {
            return res.status(400).json({
                ok: false,
                message: 'The user with such ID doesn\'t exist',
                errors: { message: 'The user with such ID doesn\'t exist'}
            })
        }
    
        res.status(200).json({
            ok: true,
            user: deletedUser
        });

    })
});
    
module.exports = app;