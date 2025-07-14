const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB with DB name
mongoose.connect("mongodb://localhost:27017/tododb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

// ✅ Mongoose Model
const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true }
});
const Task = mongoose.model("Task", TaskSchema);

// ✅ Routes
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Task text is required" });

  const task = new Task({ text });
  await task.save();
  res.status(201).json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
