//Requires
var express = require('express');
var mongoose = require('mongoose');
var appRoutes = require('./routes/app')
var userRoutes = require('./routes/user');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var images = require('./routes/images');
var bodyParser = require('body-parser');


//Init vars
var app = express();

//DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err )  {
        console.log(err)
        throw err
    };
    console.log('Base de datos: \x1b[32m%s\x1b[0n', 'online');    
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', images);
app.use('/', appRoutes);

//Listen requests
app.listen(3000, () => console.log('Express server port 3000: \x1b[32m%s\x1b[0n', 'online'));