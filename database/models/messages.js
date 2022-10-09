const mongoose = require("mongoose");

const messagesSchema  = new mongoose.Schema({
  messages:{
    type:Array,
    chatId:{
        type:String,
        required:true
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

 const messagesModel = mongoose.model('Messages', messagesSchema);

 module.exports=messagesModel