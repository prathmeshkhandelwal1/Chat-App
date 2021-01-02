const socket = io()
const messages = document.querySelector('#messages')
const messageTemplates = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const msgInput = document.querySelector('#msgInput')

const {username, room} =  Qs.parse(location.search, {ignoreQueryPrefix:true})
console.log(username,room)

const autoScroll = () => {

    const newMsg = messages.lastElementChild

    const newMsgStyle = getComputedStyle(newMsg)
    const newMsgMargin  = parseInt(newMsgStyle.marginBottom)
    const newMsgHeight = newMsg.offsetHeight + newMsgMargin

    const visibleHeight = messages.offsetHeight

    const containerHeight = messages.scrollHeight

    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMsgHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on('WelcomeMsg', (msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplates,{
        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('locationMessage', (url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML("beforeend",html)
    autoScroll()
})


document.querySelector('#form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('msgSent',message,()=>{
        console.log('Delivered!')
    })
    msgInput.value = ''
})

document.querySelector('#Send-Location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser does not support this')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sentLocation' , {
            longitude: position.coords.longitude,
            latitude:position.coords.latitude
        },()=>{
            console.log('Location Shared')
        })

    })
})

socket.emit('join',{username, room} , (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

