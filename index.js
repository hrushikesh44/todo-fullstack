const express = require("express");
const jwt =require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth")
const  mongoose  = require("mongoose");
const app = express();

mongoose.connect("mongodb+srv://hrushikesh44:zm09jvPBTafrOSC7@cluster0.2lasb.mongodb.net/todo-app");
app.use(express.json());

app.post("/signup", async function(req, res){
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    await UserModel.create({
        email: email, 
        username: username, 
        password: password
    });

    res.json({
        message: "you've signed up"
    })
});

app.post("/signin", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email,
        password: password
    })

    if(response){
        const token = jwt.sign({
            id: response._id.toString()
        },JWT_SECRET)

        res.json({
            token
        })
    }else{
        res.status(404).json({
            message: "Wrong Credentials"
        })
    }
})


app.post("/todo", auth, async function(req, res) {
    const task = req.body.task;
    const userId = req.userId;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        task,
        done
    })

    res.json({
        userId,
        message: "successfully added"
    })
})

app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId
    })

    res.json({
        todos
    })
})

app.listen(3000);