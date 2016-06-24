var configModel = require('../models/configModel');

module.exports = {
  obtenerConfig: obtenerConfig,
  actualizarConfig: actualizarConfig
}


function obtenerConfig(callback) {
    configModel.findOne(function(err, config) {
        callback(err, config);
    });
}

function actualizarConfig(id, newConfig, callback) {
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

        config.save(callback);
    });
}