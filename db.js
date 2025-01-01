const mongoose = require("mongoose");
const Schema = require("Schema");
const ObjectId = require("ObjectId");

const User = {
    email: String, 
    usernmae: String,
    password: String
}

const Todo = {
    description: String,
    task: String,
    taskId: ObjectId
}

const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("todos", Todo);

module.exports = {
    UserModel, 
    TodoModel
}