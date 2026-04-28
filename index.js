const express = require("express");
const jwt = require("jsonwebtoken");

const app = express(); 
app.use(express.json());

const notes = [];
const users = [{
    username: "Chandan",
    password: "1234"
}];

app.post("/signup", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userexist = users.find(user => user.username === username);

    if(userexist){
        return res.status(403).json({
            message:"Username Already Exist"
        })
    }

    users.push({
        username : username,
        password : password
    })

    res.json({
        message:"You have Signed-Up Successfully"
    })
})

app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userexist = users.find(user => user.username === username && user.password === password );

    if(!userexist){
        return res.status(403).json({
            message:"Invalid Credentials"
        });
    }

    const token = jwt.sign({
        username : username
    },"chandan123");

    res.json({
        token:token 
    });
})

//create a note -- autheticated endpoint
app.post("/notes",function(req,res){
    const token = req.headers.token;

    if(!token){
        return res.json({
            message: "Youre not logged in"
        })
    }

    const decode = jwt.verify(token,"chandan123");
    const validUser = decode.username;

    if(!validUser){
        return res.status(403).json({
            alert:"Malware User"
        });
    }


    const note = req.body.note;
    if(note){
      notes.push({
        note: note,
        username: validUser
      });
    
       res.json({
        message: "Done!"
       });
    }
});

app.get("/notes" , function(req,res){
    const token = req.headers.token;

    if(!token){
        return res.status(403).json({
            message:"Youre not logged in"
        });
    }

    const decode = jwt.verify(token,"chandan123");
    const validUser = decode.username;

    if(!validUser){
        res.status(403).json({
            message:"Malformed token"
        })
        return
    }

    const userNotes = notes.filter(note => note.username === validUser);
    res.json({
        notes: userNotes
    })
})

app.get("/", function(req,res){
    res.sendFile("C:/cohort4.0/Projects/Week-9-todo/frontend/index.html");
})

app.get("/signin", function(req,res){ 
    res.sendFile("C:/cohort4.0/Projects/Week-9-todo/frontend/signin.html");
})

app.get("/signup", function(req,res){
    res.sendFile("C:/cohort4.0/Projects/Week-9-todo/frontend/signup.html");
})

app.listen(3002);