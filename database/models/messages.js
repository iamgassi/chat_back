const mongoose = require("mongoose");

const messagesSchema  = new mongoose.Schema({
  messages:{
    type:Array,
    chatId:{
        type:String,
        required:true
    }
  }
},
 )

 const messagesModel = mongoose.model('Messages', messagesSchema);

 module.exports=messagesModel