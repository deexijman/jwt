import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// data for server
import { posts } from './data.js'

const app = express()
const PORT = process.env.PORT || 4000
dotenv.config()

app.use(express.json()) // replace body parser

app.get('/posts',authenticate,(req,res)=>{

    let userData = req.userData

    console.log('ENtered Posts')

    res.status(200).json({
        username : userData.name,
        payload : posts.filter((item)=>(
            item.name === userData.name 
        )),
        message : "got the posts of the user"
    })

})

app.post('/login',(req,res)=>{
    
    // 1. authenticate user before JWT :
    // ...  meaning username is present, username and password is wrong

    // { learn from another video, check from db cred }

    // 2 . JWT : Authenticate and serialize the user with JWT
    // ...  meaning username is present, username and password is wrong

    const username = req.body && req.body.username

    if(username == null){
        return res.status(405).json({
            message:'Request body empty or wrong key'
        })
    }
    
    const userData = { name: username } // userData Format
    
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'120s'})

    res.status(200).json({
        payload : {
            accessToken : accessToken // embed this token in header for every req
        },
        message : "JWT Token Created Successfully"
    })

})


// to authenticate the JWT Token
function authenticate(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // 'Authorization' : 'Bearer token123'

    if(token == null){
        return res.status(400).json({
            message : "Empty Header Request"
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,signedUserData) => {
        if(err){
            return res.status(410).json({
                message : "token expired"
            })
        }

        req.userData = signedUserData
        next()
    })
    
    console.log('End of middleware authenticate')
}


app.listen(PORT,()=>{
    console.log(`Runnning backend webserver on PORT : ${PORT}`)
})