var express = require('express');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

var app = express();

// ===========================
// Get all 
// ===========================

app.get('/all/:term', (req, res) => {

    var term = new RegExp(req.params.term, 'i' );

    Promise.all([
        searchHospitals(term),
        searchDoctors(term),
        searchUsers(term),
    ])
    .then((results) => {
        res.status(200).json({
            ok: true,
            hospitals: results[0],
            doctors: results[1],
            users: results[2]
        });
    })
    .catch((err) => {
        res.status(500).json({
            ok: false,
            errors: err
        });
    });

});

function searchHospitals(term) {
    
    return new Promise((resolve, reject) => {
        Hospital.find({ name: term })
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                reject('Error finding hospitals.', err);
            } else {
                resolve(hospitals);
            }
        });
    });

}

function searchDoctors(term) {
    
    return new Promise((resolve, reject) => {
        Doctor.find({ name: term })
        .populate('user', 'name email')
        .populate('hospital', 'name')
        .exec((err, doctors) => {
            if (err) {
                reject('Error finding doctors.', err);
            } else {
                resolve(doctors);
            }
        });
    });

}

function searchUsers(term) {
    
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
        .or([
            { 'name': term }, 
            { 'email': term }
        ])
        .exec((err, users) => {
            if (err) {
                reject('Error finding users.', err);
            } else {
                resolve(users);
            }
        });
    });

}

module.exports = app;