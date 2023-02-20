const express=require("express")

const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken")
const { UserModel } = require("../models/User.model")

const userRouter=express.Router()

userRouter.post("/register", async(req,res)=>{
    const {email,name,gender,password,age,city}=req.body;
    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                console.log(err)
            }else{
                const user=new UserModel({email,password:hash,name,gender,age,city})
                await user.save()
                res.send({"msg":"User has been Registered"})
            }
        })
    } catch (error) {
        res.send({"msg":"Something went Wrong"})
        console.log(error)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await UserModel.find({email})
        const hashedPass=user[0].password;
        if(user.length>0){
            bcrypt.compare(password,hashedPass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id},"masai")
                    res.send({"msg":"User Login Successfull","token":token})
                }else{
                    res.send({"msg":"You Provided the Wrong Credentials"})
                }
            })
        }else{
            res.send({"msg":"You Provided the Wrong Credentials"})
        }
    } catch (error) {
        res.send({"msg":"Sonthing went Wrong"})
        console.log(error)
    }
})

module.exports={userRouter}