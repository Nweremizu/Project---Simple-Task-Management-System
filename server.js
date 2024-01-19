const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Connect to my MongoDB Database with connection pooling
mongoose.connect(
	"mongodb+srv://admin:admin@feed.5uf8avf.mongodb.net/?retryWrites=true&w=majority",
	{
		poolSize: 10,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const todoSchema = new mongoose.Schema({
	task: { type: String, index: true },
	completed: { type: Boolean, index: true },
});

const Todo = mongoose.model("Todo", todoSchema);

// API Endpoints
app.get("/", (req, res) => {
	const indexPath = path.join(__dirname, "public", "task_system.html");
	fs.readFile(indexPath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal Server Error");
		} else {
			res.send(data);
		}
	});
});

// Use lean queries and select only necessary fields
app.get("/todos", async (req, res) => {
	const todos = await Todo.find().lean().select("task completed");
	res.json(todos);
});

// Use insertMany for bulk inserts
app.post("/todos", async (req, res) => {
	const newTodos = Array.isArray(req.body) ? req.body : [req.body];
	const insertedTodos = await Todo.insertMany(newTodos);
	res.json(insertedTodos);
});

// Use updateMany for bulk updates
app.put("/todos/completed", async (req, res) => {
	const updates = req.body.map(({ id, completed }) => ({
		updateOne: { filter: { _id: id }, update: { completed } },
	}));
	await Todo.bulkWrite(updates);
	res.json({ message: "Todos Updated" });
});

// Use updateOne for single updates
app.put("/todos", async (req, res) => {
	const { id, task } = req.body;
	const updatedTodo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
	res.json(updatedTodo);
});

// Use deleteOne for single deletes
app.delete("/todos/:id", async (req, res) => {
	const id = req.params.id;
	await Todo.findByIdAndDelete(id);
	res.json({ message: "Todo Deleted" });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
