var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PhysicianFrontDeskGroupSchema = new Schema({
    physicians: [{
        type: Schema.ObjectId,
        ref:'physicians',
    }],
    name: {
        type: String,
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model('physicianFrontDeskGroup', PhysicianFrontDeskGroupSchema);