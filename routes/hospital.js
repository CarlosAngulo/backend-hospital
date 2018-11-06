var express = require('express');
var Hospital = require('../models/hospital');
var mdAutentication = require('../middlewares/autentication');
var app = express();

// ===========================
// Get all hospitals
// ===========================

app.get('/', (req, res) => {
    Hospital.find({}, (err, hospitals) => {
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error finding hospitals',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            hospitals
        })
    });
});

// ===========================
// Create a new hospital
// ===========================

app.post('/', mdAutentication.verifyToken, (req, res) => {
    var body = req.body;
    var user = req.user;
    var hospital = new Hospital({
        name: body.name,
        user: user._id
    });

    hospital.save( (err, savedHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving such hospital',
                error: err
            });
        }

        return res.status(200).json({
            ok: true,
            hospital: savedHospital
        })
    })
});

// ===========================
// Update hospital data 
// ===========================

app.put('/:id', mdAutentication.verifyToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;
    var user = req.user;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding such hospital',
                error: err
            });
        }

        if ( !hospital ) {
            return res.status(400).json({
                ok: false,
                message: `Hospital with the id ${id} was not found`,
                error: { message: 'Hospital with such ID does not exist'}
            });
        }

        hospital.name = body.name;
        hospital.user = user._id;

        hospital.save( (err, savedHospital ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating the hospital info',
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: savedHospital
            })

        });

    });

});

// ===========================
// Deleting hospital by ID 
// ===========================
app.delete('/:id', mdAutentication.verifyToken, (req, res) => {
    
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {

        if(err){ 
            return res.status(500).json({
                ok: false,
                message: 'Error deleting the hospital',
                error: err
            });
        }

        if ( !deletedHospital ) {
            return res.status(400).json({
                ok: false,
                message: 'The hospital with such ID doesn\'t exist',
                errors: { message: 'The hospital with such ID doesn\'t exist'}
            })
        }

        res.status(200).json({
            ok: true,
            hospital: deletedHospital
        });

    })
});

module.exports = app;