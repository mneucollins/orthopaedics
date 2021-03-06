var configModel = require('../models/configModel');

module.exports = {
  obtenerConfig: obtenerConfig,
  obtenerConfigSync: obtenerConfigSync,
  actualizarConfig: actualizarConfig
}

var configActual = {};
configModel.findOne(function(err, config) {
    configActual = config;
});

setInterval(function (argument) {
    configModel.findOne(function(err, config) {
        configActual = config;
    });
}, 5 * 60 * 1000);

function obtenerConfig(callback) {
    configModel.findOne(function(err, config) {
        configActual = config;
        callback(err, config);
    });
}

function obtenerConfigSync() {
    return configActual;
}

function actualizarConfig(newConfig, callback) {
    configModel.findOne(function(err, config) {

        if(newConfig.callbackInterval) 
            config.callbackInterval = newConfig.callbackInterval;
        if(newConfig.frontdeskBanner) 
            config.frontdeskBanner = newConfig.frontdeskBanner;
        if(newConfig.warnWaitMinutes) 
            config.warnWaitMinutes = newConfig.warnWaitMinutes;
        if(newConfig.dangerWaitMinutes) 
            config.dangerWaitMinutes = newConfig.dangerWaitMinutes;
        if(newConfig.welcomeMsgDelayText) 
            config.welcomeMsgDelayText = newConfig.welcomeMsgDelayText;
        if(newConfig.welcomeMsgNoDelayText) 
            config.welcomeMsgNoDelayText = newConfig.welcomeMsgNoDelayText;
        if(newConfig.kioskMsgText) 
            config.kioskMsgText = newConfig.kioskMsgText;
        if(newConfig.kioskCallMsgText) 
            config.kioskCallMsgText = newConfig.kioskCallMsgText;
        if(newConfig.firstWaitMsgText) 
            config.firstWaitMsgText = newConfig.firstWaitMsgText;
        if(newConfig.waitMsgText) 
            config.waitMsgText = newConfig.waitMsgText;
        if(newConfig.longWaitMsgText) 
            config.longWaitMsgText = newConfig.longWaitMsgText;
        if(newConfig.longWaitMsgMinutes) 
            config.longWaitMsgMinutes = newConfig.longWaitMsgMinutes;
        if(newConfig.msgInterval) 
            config.msgInterval = newConfig.msgInterval;
        if(newConfig.maxNumMsgs) 
            config.maxNumMsgs = newConfig.maxNumMsgs;

        // console.log(JSON.stringify(config));
        config.save(function (err, newElem) {
            configActual = newElem;
            callback(err, newElem);
        });
    });
}
