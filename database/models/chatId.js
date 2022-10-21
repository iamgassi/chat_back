const mongoose = require("mongoose");

const chatIdSchema  = new mongoose.Schema({
               user1:{type:String},
               user2:{type:String},
               messages:{type:Array}
},
 )

 const chatIdModel = mongoose.model('ChatId', chatIdSchema);

 module.exports=chatIdModel
 