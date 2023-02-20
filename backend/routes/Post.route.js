const express = require("express")
const { PostModel } = require("../models/Post.model")

const postRouter = express.Router()


postRouter.get("/", async (req, res) => {
    const device_name = req.query.device;
    if (device_name) {
        try {
            let notes = await PostModel.find({ device: device_name })
            res.send(notes)
        } catch (error) {
            res.send({ "msg": "Error occured", error })
        }
    } else {
        try {
            const notes=await PostModel.find()
            res.send(notes)
        } catch (error) {
            res.send({"msg":"Something went wrong"})
        }
    }


})

postRouter.get("/top", async (req, res) => {
    try {
        const notes = await PostModel.find({ $max: { no_if_comments } })
        res.send(notes)
    } catch (error) {
        res.send({ "msg": "Something went wrong" })
    }
})

postRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const notes = new PostModel(payload)
        await notes.save()
        res.send({ 'msg': "Notes has been Created" })
    } catch (error) {
        res.send({ "msg": "went Wrong" })
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const note = await PostModel.findOne({ "_id": id })
    const userID_while_post = note.userID;
    const userID_while_req = req.body.userID
    try {
        if (userID_while_req !== userID_while_post) {
            res.send({ "msg": "YOU ARE NOT AUTHORIZED TO DO THID OPERATION" })
        } else {
            await PostModel.findByIdAndUpdate({ "_id": id }, payload)
            res.send("Note has been Updated")
        }
    } catch (error) {
        res.send({ "msg": "Something went wrong!" })
    }
})

postRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const note = await PostModel.findOne({ "_id": id })
    const userID_while_post = note.userID;
    const userID_while_req = req.body.userID
    try {
        if (userID_while_req !== userID_while_post) {
            res.send({ "msg": "YOU ARE NOT AUTHORIZED TO DO THIS OPERATION" })
        } else {
            await PostModel.findByIdAndDelete({ "_id": id })
            res.send("Note has been Deleted Successfully")
        }
    } catch (error) {
        res.send({ "msg": "Something went wrong!" })
    }
})

module.exports = { postRouter }