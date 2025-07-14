import { useState, useEffect } from "react";
import "./styles/HomePages.css";
import axios from "axios";

function HomePages() {
  const [task, settask] = useState("");
  const [view, setview] = useState(false);
  const [errorss, seterror] = useState("Enter your task");
  const [tasklist, settasklist] = useState([]);

  // Load tasks on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => settasklist(res.data))
      .catch((err) => console.error("Error loading tasks:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.trim() === "") {
      seterror("Input box cannot be empty");
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/tasks", {
          text: task,
        });
        settasklist([...tasklist, res.data]);
        settask("");
        seterror("Task saved to DB ✅");
      } catch (err) {
        console.error("Error saving task:", err);
        seterror("Failed to save task ❌");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      settasklist(tasklist.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const ViewTaks = ({ tasklist, handleDelete }) => {
    return (
      <div className="task-list">
        <h3>Your Tasks</h3>
        {tasklist.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          tasklist.map((item) => (
            <div key={item._id} className="task-box">
              <p>{item.text}</p>
              <div className="task-buttons">
                <button onClick={() => handleDelete(item._id)}>Delete</button>
                <button>Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="todo-container">
      <div className="header">
        <h2>Todo List Project</h2>
        <div className="header-buttons">
          <button onClick={() => setview(true)}>View Tasks</button>
          <button>Rate us</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="task"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => settask(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>

      <h3>{errorss}</h3>

      {view && <ViewTaks tasklist={tasklist} handleDelete={handleDelete} />}
    </div>
  );
}

export default HomePages;
