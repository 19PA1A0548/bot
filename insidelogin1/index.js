var express=require("express");

const session = require('express-session');

var app=express();

var bodyParser=require("body-parser")

app.use(express.static("capstonestatic"));

app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine","ejs")

// Session Setup
app.use(session({
  
    // It holds the secret key for session
    secret: 'ssshhhhh',
  
    // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))

var sess;

app.get("/",function(req,res){
	res.sendFile(__dirname+"/capstonestatic/index.html");
})
app.post("/signin",function(req,res){
	sess = req.session;
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["FacultyData"]);
	var d={
		ID:req.body.id,
		Password:req.body.password
	}
	/*Setting session values*/
	sess.ID = req.body.id;
	sess.Password = req.body.password;
	// console.log(sess.ID,sess.Password);
	/*console.log(d);*/
	var doc1 = [];
	db.FacultyData.find(d,function(err,doc){
		db.events.find({},function(err,docs){
			//console.log(docs);
			doc1.push(docs);
			if(doc.length==0){
				res.send("No user found");
			}
			else{
				doc1.push(doc);
				// console.log(doc1[0]);
				// console.log(doc1);
				db.news.find({},function(err,docs1){
					doc1.push(docs1);
					// console.log(doc1);
					res.render("home",{data:doc1});
				})
			}
		})
	})
	
})
app.post("/status",function(req,res){
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["FacultyData"]);
	var d1 = { $set: { Status : req.body.status} };
	var d = {
		ID : sess.ID,
		Password : sess.Password
	}
	var doc1 = [];
	db.FacultyData.find(d,function(err,doc){
		db.FacultyData.updateOne(doc[0],d1,function(err,res){
				// db.close();
				// console.log("dfghfdg");
			})
	});
	
	db.FacultyData.find(d,function(err,doc){
		if(doc.length==0){
			res.send("No user found");
		}
		else{
			
			// db.FacultyData.updateOne(doc[0],d1,function(err,res){
			// 	// db.close();
			// 	console.log("dfghfdg");
			// })
			
			db.events.find({},function(err,docs){
				// console.log(docs);
				doc1.push(docs);
				if(doc.length==0){
					res.send("No user found");
				}
				else{
					doc1.push(doc);
					// console.log(doc);
					db.news.find({},function(err,docs1){
						doc1.push(docs1);
						doc1[1].Status = req.body.status;
						// console.log(doc1);
						res.render("home",{data:doc1});
					});
				}
			})

			/*res.render("home",{data:doc1});*/
		}
	})
})

app.get("/mentorstudents",function(req,res){
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["StudentData"]);
	var d={
		MentorId: sess.ID
	}
	db.StudentData.find(d,function(err,doc){
		res.render("mentorstudents",{data:doc});
		// console.log(doc);
	})
})

app.get("/studentdata/:id",function(req,res){
	let x = req.params.id;
	// console.log(x);
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["StudentData"]);
	var d = {
		ID : x
	}
	db.StudentData.find(d,function(err,doc){
		// console.log(doc[0].Clubs[0]);
		res.render("studentdata",{data:doc});
	})
	
})
app.get("/facultydata",function(req,res){
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["FacultyData"]);
	var x = sess.ID;
	var d = {
		ID:x
	}
	db.FacultyData.find(d,function(err,doc){
		res.render("facultydata",{data:doc});
	})
})
app.get("/requests",function(req,res){
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["FacultyData"]);
	db.requests.find({},function(err,doc){
		res.render("requests",{data:doc});
	})
})
app.get("/calendar",function(req,res){
	res.sendFile(__dirname+"/capstonestatic/calendar.html");
})
app.post("/calendaraddevent",function(req,res){

	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["calendar"]);

	var d={
		Date:req.body.uname,
		Event:req.body.pass
	}

	db.calendar.insert(d,function(err,docs){
		if(err){
            res.send("something went wrong")
        }
        else{
           res.sendFile(__dirname+"/capstonestatic/calendar.html");
        }
	})
})
app.get("/alleventsincalendar",function(req,res){
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["calendar"]);
	var d={};
	db.calendar.find(d,function(err,docs){
		res.render("calendar",{data:docs});
	})
})
app.get("/deletecalendarevent/:date",function(req,res){
	var mongojs=require("mongojs");
	var cs="mongodb+srv://sandeep2162:dora23456@vishnubot.qidvy.mongodb.net/VishnuBot?retryWrites=true&w=majority"
	var db=mongojs(cs,["calendar"]);
	var date = req.params.date;
	var d = {
		ID:sess.ID,
		Date:date
	}
	// console.log(d);
	db.calendar.remove(d,function(req,res){
	})
	db.calendar.find({},function(err,docs){
			res.render("calendar",{data:docs});
			// res.send("dsfgnergergjker");

	})

})
app.listen(3000)