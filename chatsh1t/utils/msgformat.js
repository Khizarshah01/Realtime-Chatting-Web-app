var moment = require('moment')
function msgmaker(username , message){
    return{
        username,
        message,
        time: moment().format('h : mm a')
    }
}
function OldMessageMaker(username , message , time){
    return{
        username,
        message,
        time
    }
}
exports.msgmaker = msgmaker
exports.OldMessageMaker = OldMessageMaker