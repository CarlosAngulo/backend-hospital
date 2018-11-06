var express = require('express');
var Doctor = require('../models/doctor');
var mdAutentication = require('../middlewares/autentication');
var app = express();

// ===========================
// Get all doctors
// ===========================

app.get('/', (req, res) => {

    var limit = parseInt(req.query.limit) || 0;
    var from = parseInt(req.query.from) || 0;

    Doctor.find({})
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('hospital')
        .exec( (err, doctors) => {
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error finding doctors',
                error: err
            });
        }
        Doctor.count({}, (err, count) => {
            res.status(200).json({
                ok: true,
                doctors,
                total: count
            });
        });
    });
});

// ===========================
// Create a new doctor
// ===========================

app.post('/', mdAutentication.verifyToken, (req, res) => {
    var body = req.body;
    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save( (err, savedDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving such doctor',
                error: err
            });
        }

        return res.status(200).json({
            ok: true,
            doctor: savedDoctor
        })
    })
});

// ===========================
// Update doctor data 
// ===========================

app.put('/:id', mdAutentication.verifyToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding such doctor',
                error: err
            });
        }

        if ( !doctor ) {
            return res.status(400).json({
                ok: false,
                message: `Doctor with the id ${id} was not found`,
                error: { message: 'Doctor with such ID does not exist'}
            });
        }

        doctor.name = body.name;
        doctor.hospital = body.hospital;
        doctor.user = req.user._id;

        doctor.save( (err, savedDoctor ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating the doctor\'s info',
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                doctor: savedDoctor
            })

        });

    });

});

// ===========================
// Deleting hospital by ID 
// ===========================
app.delete('/:id', mdAutentication.verifyToken, (req, res) => {
    
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor) => {

        if(err){ 
            return res.status(500).json({
                ok: false,
                message: 'Error deleting the doctor',
                error: err
            });
        }

        if ( !deletedDoctor ) {
            return res.status(400).json({
                ok: false,
                message: 'The doctor with such ID doesn\'t exist',
                errors: { message: 'The doctor with such ID doesn\'t exist'}
            })
        }

        res.status(200).json({
            ok: true,
            doctor: deletedDoctor
        });

    })
});

module.exports = app;