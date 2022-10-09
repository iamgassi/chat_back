const mongoose = require("mongoose");

const chatIdSchema  = new mongoose.Schema({
    chatid:{
        type:Array,
        unique:true,
        required:true,
                user1:{
                    type:String,
                    unique:true,
                    required:true,
                    
                },
                user2:{
                    type:String,
                    unique:true,
                    required:true,
                }
    },
 created_at:
{ 
    type: Date,
    required: true,
    default: Date.now
 },
},
 )

 const chatIdModel = mongoose.model('ChatId', chatIdSchema);

 module.exports=chatIdModel