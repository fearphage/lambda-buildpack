#!/usr/bin/env node
const fs    = require('fs');
const log   = require('./logger')
function Orders () {
    return this;

};  
Orders.prototype.getOneVar = function (ordersLine){
    var line = ordersLine.replace(/export\s/,'')
    var oneVar = line.split('=')    

    if( oneVar.length !== 2 ){
        log.error("Bad Export format. Exiting: " +ordersLine)       
        process.exit(1)
    }

    var obj = {}
    obj.name = oneVar[0].trim();
    obj.value = oneVar[1].trim();
    obj.value = obj.value.replace(/["'`]/g,'\\"');  // escape double quotes with backslash
    log.info(obj.value)

    return obj
}
Orders.prototype.getVars = function (filepath){
    var self = this, envVars = [];
    //  Get content of the orders file as a string
    content = fs.readFileSync(filepath)
    content = content.toString("utf8")

    // Create an array of lines from file content and iterate
    lines = content.match(/[^\r\n]+/g)
    lines.forEach((line)=>{
        // if line exports an evn var
        if (line.match(/^export\s.*/) !== null){
            // Add variable to env var array.
            envVars.push(self.getOneVar(line));
        }
    })   
    log.error(envVars)
    return envVars;

}

module.exports = new Orders();