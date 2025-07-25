import express from "express";
import Thread from "../models/Thread.js";
import getOpenAiApiResponse from "../utils/openai.js";

const router = express.Router();

// router.post("/api", async(req,res)=>{
//     try{
//         const thread=new Thread({
//             threadId: "abc22",
//             title: "Testing new thread 2"
//         });

//         const response = await thread.save();
//         res.send(response);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: "Failed to save in DB"});
//     }
// });

router.get("/threads", async(req, res)=>{
    try{
        const threads= await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);    }
    catch(err){
        res.status(500).json({error: "failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async(req, res)=>{
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(400).json({error: "Thread not found"});
        }
        res.status(200).json({success: "Thread deleted successfully"});
    }
    catch(err){
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res)=>{
    const {threadId, message} = req.body;
    if(!threadId || !message) res.status(400).json({error: "missing required fields"});

    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            // creating new thread in DB
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            })
        }
        else{
            thread.messages.push({role:"user", content: message});
        }

        const assistantReply = await getOpenAiApiResponse(message);
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();
        await thread.save();

        res.json({reply: assistantReply});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
})
export default router;