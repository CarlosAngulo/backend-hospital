var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ===========================
// Middleware: verify token
// ===========================

exports.verifyToken = function(req, res, next) {
    token = req.query.token;
    jwt.verify( token, SEED, (err, decoded) => {
        console.log('Middleware');
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Session token has expired',
                error: err
            });
        }
        
        req.user = decoded.user;
        
        next();

    });
    
}