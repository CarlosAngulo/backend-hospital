var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema =	new Schema({
    name: {	type: String, required: [true, 'Name is required']	},
    img: {	type: String, required: false },
    user: {	type: Schema.Types.ObjectId, ref: 'Users', required: true },
    hospital: {	type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'ID hospital is a mandatory field'] }
});

module.exports = mongoose.model('Doctors', doctorSchema);