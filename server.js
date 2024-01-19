const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const PORT = 3000;

const app = express();

app.use(express.static("public"));
app.use(express.json());

// Connect to my MongoDB Database
mongoose.connect("mongodb+srv://admin:admin@feed.5uf8avf.mongodb.net/?retryWrites=true&w=majority");

const todoSchema = new mongoose.Schema({
	task: String,
	completed: Boolean,
});

app.get("/", (req, res) => {
	const indexPath = `${__dirname}/public/task_system.html`;
	fs.readFile(indexPath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal Server Error");
		} else {
			res.send(data);
		}
	});
});

const Todo = mongoose.model("Todo", todoSchema);

//API Endpoints
app.get("/todos", async (req, res) => {
	const todos = await Todo.find();
	res.json(todos);
});

app.post("/todos", async (req, res) => {
	const { task, completed } = req.body;
	const newTodo = new Todo({ task, completed });
	await newTodo.save();
	res.json(newTodo);
	console.log(newTodo);
});

app.delete("/todos/", async (req, res) => {
	const { id } = req.body;
	await Todo.findByIdAndDelete(id);
	res.json({ message: "Todo Deleted" });
	console.log(id);
});

// to update the completed status of a todo
app.put("/todos/completed/", async (req, res) => {
	const { id } = req.body;
	const { completed } = req.body;
	try {
		const updatedTodo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
		res.json(updatedTodo);
	} catch (error) {
		res.status(500).json({ error: "Error updating todo" });
	}
});

app.put("/todos/", async (req, res) => {
	const { id } = req.body;
	const { task } = req.body;
	try {
		const update_Todo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
		res.json(update_Todo);
	} catch (error) {
		res.status(500).json({ error: "Error updating todo" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
