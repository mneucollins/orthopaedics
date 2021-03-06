var mongoose    	= require('mongoose');
var Schema      	= mongoose.Schema;

var MessageSchema   = new Schema({
	message: String,
	sid: String,
	msjType: String,  //reminder, welcome, kiosk, other
	patient: {
		type: Schema.ObjectId,
		ref: "patients"
	},
	timestamp: { type: Date, default: Date.now }
});

// MessageSchema.set('toJSON', {
//     virtuals: true
// });

module.exports = mongoose.model('messages', MessageSchema);