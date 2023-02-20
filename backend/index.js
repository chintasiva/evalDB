const express=require("express")
const { connection } = require("./config/db")
const { authenticate } = require("./middleware/authenticate.middleware")
const { postRouter } = require("./routes/Post.route")
const { userRouter } = require("./routes/User.route")
require("dotenv").config()
const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})
app.use("/users",userRouter)
app.use(authenticate)
app.use("/notes",postRouter)

app.listen(process.env.port,async(req,res)=>{
    try {
        await connection
        console.log("Conneted to DB")
    } catch (error) {
        console.log(error)
        res.send(error)
    }
    console.log("Running in port")
})