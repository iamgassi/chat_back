const express=require('express')
const app =express();
const userModel =require('./database/models/user')
const chatIdModel=require('./database/models/chatId')
const messageModel=require('./database/models/messages')
const corsModule=require('cors')
const db=require('./database/index')
const server=require('http').createServer(app)
const io = require("socket.io")(server, {
	cors: {
	  origin: "*",
	  methods: ["GET", "POST"]
	}
  });
db.init()  //for DB connection

app.use(corsModule())
app.use(express.json())

io.on('connection', (socket) => {
	console.log(socket.connected)
socket.on('chat message', function(msg) {
	console.log("msg recived")
	io.emit('message',msg)
  });

  socket.on('disconnect',()=>{
	console.log("disconnected")
  })
})

// getting user
app.route('/user').get((req,res)=>{
    userModel.find( {} )
		.then(function(data)
    {
		res.json(data);
      
      if(data === null)
      {
		res.end("No data")
      } 
      
    }).catch(function(err)
    {
        res.json({msg:err});	
        console.log(err)
    })

}).post((req,res)=>{
	const response=req.body
	const username=response.username;
	const password=response.password;
	const repeatpass=response.repeatPass;

	if(!username)
	{
			res.json({ msg:"Please Enter Username"})
			return
	}
		if(!password)
	{
        res.json({ msg:"Please Enter Password"})
			
			return
	}
    if(!repeatpass)
	{
        res.json({ msg:"Please Enter Confirm Password"})
			
			return
	}

  if(username && (password ===repeatpass))
  {
    // bcrypt.hash(password,10).then(function(hash) {
    // console.log(typeof(hash));
					userModel.create(
						{
							username:username,
							// password:hash,
							password:password

						}
					)
					.then(()=>
					{  
						 res.json({ msg:"Successfully registered"});
					})
					.catch((err)=>
					{
						console.log(err)
						res.json({ msg:"User Already Exist!!"})
					})
		// })
	}
	else
	{
    res.json({ msg:"Enter a valid detail || Password mismatch"})
	}
})

//getting chatid
app.route('/userToUser').get((req,res)=>{
    chatIdModel.find( {} )
		.then(function(data)
    {
		res.json(data);
      
      if(data === null)
      {
		res.end("No data")
      } 
      
    }).catch(function(err)
    {
        res.json({msg:err});	
        console.log(err)
    })

}).post((req,res)=>{
	const response=req.body
	const user1=response.user1;
	const user2=response.user2;

  messageModel.find({})
  .then(function(data){
	res.json(data)
	if(data === null)
	{
	  res.end("No data")
	} 
  })
  .catch(function(err){
	res.json({msg:err});	
        console.log(err)
  })
  if(user)
  {
					chatIdModel.create(
						{
							user1:user1,
							user2:user2

						}
					)
					.then(()=>
					{  
						 res.json({ msg:"Successfully registered"});
					})
					.catch((err)=>
					{
						console.log(err)
						res.json({ msg:"User Already Exist!!"})
					})
		// })
	}
	else
	{
    res.json({ msg:"Enter a valid detail || Password mismatch"})
	}
})



server.listen(8000,()=>{
    console.log("Listening on",8000)
})

