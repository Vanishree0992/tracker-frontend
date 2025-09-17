import { useState } from "react";
import API from "../api/axios";

const TaskItem = ({ task, refreshTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  /* 
  task: The current task object containing its data like id, title, and is_completed.
  refreshTodos: A function to fetch and update the list of tasks after any change.
  
  isEditing: Determines if the task is in edit mode.
  editedTitle: Stores the edited title when the user changes the text input.
  */

  const toggleComplete = async () => {
    await API.put(`todos/${task.id}/`, {
      ...task,
      is_completed: !task.is_completed,
    });
    refreshTodos();
  };
  /* 
  Flips the is_completed status.
  Sends a PUT request to update the task.
  Calls refreshTodos() to update the list.
  */

  const deleteTask = async () => {
    await API.delete(`todos/${task.id}/`);
    refreshTodos();
  };
  /* 
  Sends a DELETE request to remove the task.
  Refreshes the list afterwards.
  */

  const handleEdit = async () => {
    if (!editedTitle.trim()) return; // Prevent empty title
    await API.put(`todos/${task.id}/`, { ...task, title: editedTitle });
    setIsEditing(false);
    refreshTodos();
  };
  /* 
  Checks if the title is not empty.
  Sends a PUT request with the updated title.
  Exits edit mode and refreshes the list.
  */

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={toggleComplete}
          className="mr-2"
        />
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border p-1 rounded"
          />
        ) : (
          <span className={task.is_completed ? "line-through text-gray-400" : ""}>
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              className="bg-green-500 px-2 py-1 rounded hover:bg-green-700 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-700 mr-2"
            >
              Edit
            </button>
            <button
              onClick={deleteTask}
              className="bg-red-500 px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
