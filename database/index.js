module.exports.init=function()
{
  const mongoose = require('mongoose');
 // mongoose.connect('abc')

.then(function()            
{
  console.log("mongo is connected ")
})
.catch(function(err)
{
  console.log(err+"error ocuured")
})
}

