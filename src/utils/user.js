const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    // Check validation

    if(!username || !room){
        return {
            error:'Username and room are required'
        }
    }

    // check existing user

    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room
    })
    
    if(existingUser){
        return {
            error:'Username already existed!'
        }
    }

    const user = {id, username, room}
    users.push(user)
    // console.log(users)
    return {
        user:user
    }
}

//removeUser

const removeUser = (id) => {
    const index = users.findIndex((user)=> user.id === id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}


// getUser


const getUser = (id) => {
    const user = users.find(user=>{
        return user.id === id
    })
    return user
}

//getUserInRoom

const getUserInRoom = (room) => {
    const userList = users.filter(user=>{
        return user.room === room
    })
    return userList
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}