const users =[]

function userjoin(id , username , room){
    if (users.length == 0){
        const user = {id , username , room}
        user['message'] = []
        user['online'] = true
        users.push(user)
        return user
    }else{
        const user = users.find(user => user.username === username && user.room === room)
        if (!user){
            const user = {id , username , room}
            users.push(user)
            user['message'] = []
            user['online'] = true
            return user
        }else if (user && user.online ===false){
            user.id = id
            user.online = true
            return user
        }else{
            return user.online
        }
    }

}
function getcurrentUser(id){
    return users.find(user => user.id === id)
}
function DelUser(id){
    const user = users.find(user => user.id === id)
    user.online = false
    console.log(user)
}
function MessageAdd({username ,message ,time} ,room ,sr_no){
    const user = users.find(user => user.username === username && user.room === room)
    console.log(user)
    user['message'].push({username ,message ,time, sr_no})
    return user
}
function ShowMessageToNewUser(room){
    temp_users = []
    const roomusers = users.filter(user => user.room == room)
    roomusers.forEach(element=>{
        temp_usr = element.message
        temp_users.push(temp_usr)  
    })
    oldmsgs = temp_users.flat(1)
    var bySrNo = oldmsgs.slice(0);
    bySrNo.sort(function(a,b) {
        return a.sr_no - b.sr_no;
    })
    return bySrNo
}
function ShowMe(){
    return users
}
exports.userjoin  = userjoin
exports.getcurrentUser = getcurrentUser
exports.ShowMe = ShowMe
exports.MessageAdd = MessageAdd
exports.ShowMessageToNewUser = ShowMessageToNewUser
exports.DelUser = DelUser