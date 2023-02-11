const socket = io();
var usrname = getParameterByName('name01')
const currentUsername = getParameterByName('name01')
var room = getParameterByName('roomname')
var password = getParameterByName('password')
socket.emit('join',{usrname , room ,password})
socket.on('message',message=>{
    console.log(message)
    appendmsg(message)
})
socket.on('redirect', destination=>{
    window.location.href = destination
})
const form = document.getElementById('chat-form')
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const msg = document.getElementById('msg').value
    socket.emit('chatmessage',msg)
    document.getElementById('msg').value = ''
})
function appendmsg(message){
    const div = document.createElement('div')
    if(message.username == currentUsername)
    {
        div.classList.add('message-right')
    }
    else{
        div.classList.add('message-left')
    }
    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`
    document.querySelector('.show_message').appendChild(div);

    document.querySelector('.show_message').scrollTop = document.querySelector('.show_message').scrollHeight;
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}