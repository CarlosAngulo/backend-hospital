var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');

var User = require('../models/user');
var Doctor = require('../models/doctor');
var Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;
    let validTypes = ['hospitals', 'doctors', 'users'];
    if ( validTypes.indexOf( type ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: 'Collection type is not valid',
            errors: {message: 'Collection type is not valid'}
        });
    }

    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            message: 'Error uploading file',
            errors: {message: 'you should select an image'}
        });
    }
    
    // Obtain file name
    let file = req.files.image;
    let fileNameTemp = file.name.split('.');
    let extension = fileNameTemp[fileNameTemp.length - 1];
    
    //Allowed extensions 
    let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'tif'];
    
    if ( allowedExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension is not valid',
            errors: {message: 'Allowe extensions are ' + allowedExtensions.join(', ')}
        });
    }

    //Customized file name
    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    //Move file from temporal to a temporal path
    let path = `./upload/${ type }/${ fileName }`;

    file.mv( path, err => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error moving the file',
                errors: err
            });
        }

        uploadByType(type, id, fileName, res);

    });


});

function uploadByType(type, id, fileName, res) {

    if(type == 'users'){
        User.findById( id, (err, user) => {
            let oldPath = './upload/users/' + user.img;
            //deletes old image if exists
            if( fs.existsSync(oldPath) ) {
                fs.unlink(oldPath);
            }
            user.img = fileName;
            
            user.save((err, updatedUser) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        res: 'Image could not be saved',
                        error: err
                    })
                }

                updatedUser.password = ';)';
                return res.status(200).json({
                    ok: true,
                    res: 'User image updated',
                    user: updatedUser
                });
            });
        });
    }

    if(type == 'doctors'){
        Doctor.findById( id, (err, doctor ) => {
            let oldPath = './upload/doctors/' + doctor.img;
            if( fs.existsSync(oldPath) ) {
                fs.unlinkSync(oldPath);
            }
            doctor.img = fileName;

            doctor.save((err, updatedDoctor) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        res: 'Image could not be saved',
                        error: err
                    })
                }
                return res.status(200).json({
                    ok: true,
                    res: 'User image updated',
                    user: updatedDoctor
                });
            });
        });
    }

    if(type == 'hospitals'){
        Hospital.findById( id, (err, hospital ) => {
            let oldPath = './upload/hospitals/' + hospital.img;
            if( fs.existsSync(oldPath) ) {
                fs.unlinkSync(oldPath);
            }
            hospital.img = fileName;

            hospital.save((err, updatedHospital) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        res: 'Image could not be saved',
                        error: err
                    })
                }
                return res.status(200).json({
                    ok: true,
                    res: 'User image updated',
                    user: updatedHospital
                });
            });
        });
    }
}

module.exports = app;