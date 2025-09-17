import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import TaskItem from "../components/TaskItem";
import { AuthContext } from "../context/AuthContext";

const TodoList = () => {
  const { user } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  /* 
  user: Used to display the logged-in user's name.
  todos: Stores the list of tasks fetched from the API.
  newTask: Tracks the input value for adding a new task
  */

  const fetchTodos = async () => {
    try {
      const { data } = await API.get("todos/");
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };
  /* 
  Calls the GET /todos/ endpoint.
  Updates the state with the response data.
  Logs errors if the request fails.
  */

  // Runs fetchTodos only once when the component is mounted.
  useEffect(() => {
    fetchTodos();
  }, []);


  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      await API.post("todos/", { title: newTask });
      setNewTask("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };  
  /* 
  Prevents form submission’s default behavior.
  Stops if the input is empty.
  Calls POST /todos/ to create a new task.
  Clears the input after successful submission.
  Refreshes the list by calling fetchTodos
  */  

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4 text-center">Welcome, {user?.username}</h2>

        <form onSubmit={handleAddTask} className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 p-2 border rounded-l"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet!</p>
        ) : (
          todos.map((task) => (
            <TaskItem key={task.id} task={task} refreshTodos={fetchTodos} />
          ))
        )}
        {/* Conditionally renders:
        A message when there are no tasks.
        A list of TaskItem components when tasks are available. */}
      </div>
    </div>
  );
};

export default TodoList;
