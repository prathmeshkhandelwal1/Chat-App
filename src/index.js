const express  = require('express')
const app = express();
const path = require('path')
const port = process.env.PORT || 3000

const pathName = path.join(__dirname,'../public')

app.use(express.static(pathName))



app.listen(port,()=>{
    console.log(`app is listening on port ${port}!`)
})


