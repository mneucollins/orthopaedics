var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ConfigSchema = new Schema({
    callbackInterval: {
        type: Number,
        required: true
    },
    frontdeskBanner: {
        type: String,
        default: false
    },
    warnWaitMinutes: {
        type: Number,
        default: false
    },
    dangerWaitMinutes: {
        type: Number,
        default: false
    },
    welcomeMsgText: {
        type: String,
        default: false
    },
    waitMsgText: {
        type: String,
        default: false
    },
    msgInterval: {
        type: Number,
        default: false
    }
});


module.exports = mongoose.model('config', ConfigSchema);
