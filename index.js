const express = require("express");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth")
const  mongoose  = require("mongoose");
const { z } = require("zod");

const app = express();
mongoose.connect("MONGODB_URL");
app.use(express.json());

app.post("/signup", async function(req, res){
    const requiredBody = z.object({
        email: z.email(),
        username: z.string().min(3).max(20),
        password: z.string().min(4).max(15)
    })

    const parsedBody = requiredBody.safeParse(req.body);
    if(!parsedBody.success){
        res.json({
            message: "Incorrect format",
            error: parsedBody.error
        })
    }

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    try{
        const hashedPassword = await bcrypt.hash(password, 5);

        await UserModel.create({
            email: email, 
            username: username, 
            password: hashedPassword
        });
    
        res.json({
        message: "you've signed up"
        })

    } catch(e) {
        res.status(500).json({
            message: "email already exists"
        })
    }
});

app.post("/signin", async function(req, res){

    const requiredBody =z.object({
        email: z.email(),
        password: z.string().min(4).max(15)
    })

    const parsedBody = requiredBody.safeParse(req.body)

    if(!parsedBody.success){
        res.json({
            message: "incorrect format",
            error: parsedBody.error
        })
    }
    
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email
    })

    if(!response){
        res.status(403).json({
            message: "email not found"
        })
    }

    const passwordMatch = await bcrypt.compare(password, response.password);

    if(passwordMatch){
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
