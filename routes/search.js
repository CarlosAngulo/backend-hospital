var express = require('express');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

var app = express();

// ===========================
// Search by Collection 
// ===========================
app.get('/collection/:collection/:term', (req, res) => {
    var collection = req.params.collection;
    var term = new RegExp(req.params.term, 'i');
    var promise;
    switch(collection) {
        case 'hospitals':
            promise = searchHospitals(term)
        break;
        case 'doctors':
            promise = searchDoctors(term)
        break;
        case 'users':
            promise = searchUsers(term)
        break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Search collection availabes: hospitals, users and doctors',
                error: {message: 'Type of search is not valid'}
            });
        break;
    }
    promise.then(data => {
        res.status(200).json({
            ok: true,
            [collection]: data
        });
    })
    .catch();
});


// ===========================
// General Search 
// ===========================

app.get('/all/:term', (req, res) => {

    var term = new RegExp(req.params.term, 'i');
    
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