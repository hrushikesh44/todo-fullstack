const express = require("express");
const jwt =require("jsonwebtoken");
const JWT_SECRET = "hrushikesh44"
const { UserModel, TodoModel } = require("./db")
const app = express();

app.post("/signup", async function(req, res){
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    await UserModel.insert({
        email, 
        username, 
        password
    })

    res.json({
        message: "you've signed up"
    })
})

app.post("/signin", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const response = UserModel.findOne({
        email: email,
        password: password
    })

    if(response){
        const token = jwt.sign({
            id: response._id.toString()
        })

        res.json({
            token
        })
    }else{
        res.status(404).json({
            message: "Wrong Credentials"
        })
    }
})



app.post("/todo", function(req, res){
    
})

app.get("/todos", function(req, res){
    
})

app.listen(3000);