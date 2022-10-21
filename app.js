const express=require('express')
const app =express();
const userModel =require('./database/models/user')
const chatIdModel=require('./database/models/chatId')
const messageModel=require('./database/models/messages')
const cookieParser = require('cookie-parser')
const corsModule=require('cors')
const db=require('./database/index');
const { json } = require('express');
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
app.use(express.text())
app.use(cookieParser());

//------Socket.io-----------------------------------------------
io.on('connection',async (socket) => {
	console.log(socket.id)
	const userId=socket.id
	socket.join(userId)
	console.log("Rooms in socket",socket.rooms)

    socket.on('chat message', function(msg) {
	console.log("msg recived")
	// io.emit('message',msg)
	io.to(userId).emit('message',msg);
  });

  socket.on('disconnect',()=>{
	console.log("disconnected")
  })
})

//------------------------------------------------------

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
	console.log(response)
	const user1=response.user1;
	const user2=response.user2;
	
    chatIdModel.find({})
	.then(function(data){
	// IF no user present then create
		if(!data.length)
		{
			console.log("No User Present-------------------------------")
			chatIdModel.create(
				{
						user1:user1,
						user2:user2

				}
			)
			.then(()=>
			{  
				 res.json({ msg:"Successfully Created"});
				 console.log("successfully created")
			})
			.catch((err)=>
			{
				console.log(err)
				res.json({ msg:"ChatId Already Exist!!"})
				console.log("ChatId already exist")
			})
		}
		//check for existing User.
		else 
		{  console.log("Atleast Onechatid present----------------------------------")
		   chatIdModel.find({$or:[
			{$and:[{user1:user1},{user2:user2}]},
			{$and:[{user2:user1},{user1:user2}]}
		  ]})
		  .then((data)=>{
			if(!data.length)
			{
				console.log("No exists then create ")
				chatIdModel.create(
					{
							user1:user1,
							user2:user2
					}
				)
				.then(()=>
				{  
					 res.json({ msg:"Successfully Created"});
					 console.log("successfully created")
					
				})
			}
			else
			{
				console.log("No need to create Return")
				return
			}
			// return;
			// chatIdModel.updateOne({_id:data.id},{$set:{messages:status}})	
		})
		.catch(err=>{
			console.log(err)
		})

		}
     
	})
	
})
app.post('/getMessages',(req,res)=>{
    const response=req.body
	console.log(response)
	const user1=response.user1;
	const user2=response.user2;

	chatIdModel.find({$or:[
		{$and:[{user1:user1},{user2:user2}]},
		{$and:[{user2:user1},{user1:user2}]}
	  ]})
	  .then((data)=>{
		if(!data[0]) return
		//   console.log("MEssages",data[0].messages)
		res.send(data[0].messages)
	  })

})

app.post('/message',(req,res)=>{
		const response=req.body
		const user1=response.user2user.user1;
	    const user2=response.user2user.user2;
		const msg=response.msg
		console.log("Recived Msg is:",msg)

		chatIdModel.findOne({$or:[
			{$and:[{user1:user1},{user2:user2}]},
			{$and:[{user2:user1},{user1:user2}]}
		  ]})
		  .then((data)=>{
			//  chatIdModel.create({
			// 	messages:msg
			//  })
			console.log(data,"TO be change")
			console.log("ID",data.id)
			chatIdModel.findByIdAndUpdate(
				{ _id:data._id },
				{ $push: { messages: msg } }
				)
				.then(data=>{
				 console.log(msg)
				console.log("After Update",data)
			 })
			console.log(data)
		  })
		  

	
	
}
)



server.listen(8000,()=>{
    console.log("Listening on",8000)
})

