document.querySelector('#form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('msgSent',message,()=>{
        console.log('Delivered!')
    })
})

document.querySelector('#Send-Location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser does not support this')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sentLocation' , {
            longitude: position.coords.longitude,
            latitude:position.coords.latitude
        },()=>{
            console.log('Location Shared')
        })

    })
})



const socket = io()

socket.on('WelcomeMsg', (msg)=>{
    console.log(msg)
})