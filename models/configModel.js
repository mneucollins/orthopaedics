var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ConfigSchema = new Schema({
    callbackInterval: {
        type: Number,
        default: 5,
        required: true
    },
    frontdeskBanner: {
        type: String,
        required: true
    },
    longWaitMinutes: {
        type: Number,
        required: true,
        default: 15
    },
    warnWaitMinutes: {
        type: Number,
        required: true,
        default: 30
    },
    dangerWaitMinutes: {
        type: Number,
        required: true,
        default: 45
    },
    welcomeMsgDelayText: {
        type: String,
        required: true
    },
    welcomeMsgNoDelayText: {
        type: String,
        required: true
    },
    firstWaitMsgText: {
        type: String,
        required: true
    },
    waitMsgText: {
        type: String,
        required: true
    },
    longWaitMsgText: {
        type: String,
        required: true
    },
    longWaitMsgMinutes: {
        type: Number,
        default: 45,
        required: true
    },
    msgInterval: {
        type: Number,
        default: 20,
        required: true
    },
    maxNumMsgs: {
        type: Number,
        default: 5,
        required: true
    }
});

var configModel = mongoose.model('config', ConfigSchema);
module.exports = configModel;

configModel.count({}, function counter (err, count) {
    if(err) console.log(err);
    else {
        if(count == 0) {

            new configModel({
                callbackInterval: 5,
                frontdeskBanner: "We are sensitive to your time and needs and will notify you about any waits and delays by sending a text message to your phone. What is the number for the cell phone you have with you today?",
                warnWaitMinutes: 30,
                dangerWaitMinutes: 45,
                welcomeMsgDelayText: "Welcome %PAT-FIRSTNAME%, %PHY-NAME% is currently running approximately %PHY-DELAY% minutes behind schedule. We will keep you informed about waits and delays as a part of a desire to be sensitive to your needs as a patient.",
                welcomeMsgNoDelayText: "Welcome %PAT-FIRSTNAME%, %PHY-NAME% is currently running on schedule. We will keep you informed about waits and delays as a part of a desire to be sensitive to your needs as a patient.",
                firstWaitMsgText: "We would like to update you every %SYS-MSGINTERVAL% minutes in regards to your wait time. %PHY-NAME% is now running approximately %PHY-DELAY% minutes behind. Please keep in mind that this is just an estimate. Thank you for your patience and understanding, and for choosing Emory Healthcare.",
                waitMsgText: "%PHY-NAME% is now running approximately %PHY-DELAY% minutes behind, we will continue to provide updates.",
                longWaitMsgText: "Please contact the front desk if you would like to leave the area temporarily.",
                longWaitMsgMinutes: 45,
                msgInterval: 20,
                maxNumMsgs: 5
            })
            .save(function (err, data) {
                if(err) console.log(err);
            });

            console.log("Initial config added");
        }
    }
});
