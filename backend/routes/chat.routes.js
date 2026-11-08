import express from "express";
import Chat from "../models/chat.model.js";
import {protect} from "../middlewares/auth.middleware.js"

chatRouter.use(protect)

chatRouter.post("/start", async (req, res) => {
    try {
        const {propertyId, buyerId: providedBuyerId, sellerId} = req.body;
        let buyerId, finalSellerId;

     if(req.user.role == "seller"){
        buyerId = providedBuyerId;
        finalSellerId = req.user._id;
     }
     else{
        buyerId = req.user._id;
        finalSellerId = sellerId;
     }

     if(!buyerId || !finalSellerId){
        return res.status(400).json({message: "Buyer and Seller IDs are required"});
     }  

     // check for any eisting chats 

     let chat = await Chat.findOne({
        buyer: buyerId,
        seller: finalSellerId
     })


     if(!chat){
        chat = await Chat.create({
            property: propertyId,
            buyer: buyerId,
            seller: finalSellerId, 
            messages: []
        })
     }

     chat = await Chat.findById(chat._id).populate("buyer", "name email profilePic ").populate("seller", "name email profilePic " ), populate("property", "title price images " )
       res.json(chat)





    } catch (error) {
        res.status(500).json({message: error.message || "Error starting chat"})
    }
})

chatRouter.post("/send", async (req, res) => {


    try {
        const {chatId, text, image} = req.body;
        const userId = req.user._id;

        const chat = await Chat.findById(chatId);
        if(!chat) {
            return res.status(404).json({message: "Chat not found"})
        }


        // ensure sender is paort of chat 

        if(chat.buyer.toString() === userId.toString() && chat.seller.toString() === userId.toString()){
            return res.status(403).json({message: "You are not authorized to send messages in this chat"})
        }

        const newMessage = {
            sender: userId,
            text,
            image, 
            createdAt: new Date()
        }

        chat.messages.push(newMessage);
        await chat.save();

        const savedMessages = chat.messages[chat.messages.length - 1];
        res.json({chat, newMessage: savedMessages});



    } catch (error) {
         res.status(500).json({message: error.message || "Error sending  chat"})
    }
} )



// to get a chat for user 

chatRouter.get("/user", async (req, res) => {
    try {
        
        const userId = req.user._id;
        const chats = await Chat.find({
            $or: [
                {buyer: userId},
                {seller: userId}
            ]
        }).populate("buyer", "name email profilePic ").populate("seller", "name email profilePic " ).populate("property", "title price images " ).sort({updatedAt: -1})
        res.json(chats)



    } catch (error) {
        res.status(500).json({message: error.message || "Error getting  chat"})
    }
})


// to get chat messages for a specific chat

chatRouter.get("/:chatId", async (req, res) => {
    try {
        
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId).populate("messages.sender", "name profilePic ")

        if(!chat){
            return res.status(404).json({message: "Chat not found"})
        }

        const userId = req.user._id.toString();
        if(chat.buyer.toString() !== userId && chat.seller.toString() !== userId){
            return res.status(403).json({message: "You are not authorized to view this chat"})
        }

        res.json(chat);

    } catch (error) {
          res.status(500).json({message: error.message || "Error getting messages chat"})
    }
})


// to delete a chat 

chatRouter.delete("/:chatId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if(!chat){
            return res.status(404).json({message: "Chat not found"})
        }

        // ensure user is part of chat
        if(chat.buyer.toString() !== userId && chat.seller.toString() !== userId){
            return res.status(403).json({message: "You are not authorized to delete this chat"})
        }

        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({message: "Chat deleted successfully"});

    } catch (error) {
          res.status(500).json({message: error.message || "Error deleting chat"})
    }
} )
    



// to delete a perticular message from chat

chatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

          if(!chat){
            return res.status(404).json({message: "Chat not found"})
        }

        const message = chat.messages.id(req.params.messageId);
        if(!message){
            return res.status(404).json({message: "Message not found"})
        }


        // only sender can delete his message 

        if(message.sender.toString() !== userId){
            return res.status(403).json({message: "You are not authorized to delete this message"})
        }


    chat.messages.pull(req.params.messageId);
        await chat.save();
        res.json({message: "Message deleted successfully", chat});


    }
    catch (error) {
          res.status(500).json({message: error.message || "Error deleting chat"})
    }

})


export const chatRouter = express.Router(); 