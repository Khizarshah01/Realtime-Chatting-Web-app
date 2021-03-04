const socket = io();
var usrname = getParameterByName('name01')
var room = getParameterByName('roomname')
socket.emit('join',{usrname , room})
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
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`
    document.querySelector('.show_message').appendChild(div)
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}