import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      setErrorMessage("Error al cargar las tareas");
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) {
        setTasks(tasks.filter((task) => task._id !== id));
        setSuccessMessage("Tarea eliminada con éxito");
      }
    } catch (error) {
      setErrorMessage("Error al eliminar la tarea");
      console.log(error);
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      setSuccessMessage("Tarea creada con éxito");
    } catch (error) {
      setErrorMessage("Error al crear la tarea");
      console.log(error);
    }
  };

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clearMessages();
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        deleteTask,
        createTask,
        successMessage,
        errorMessage,
        clearMessages,
      }}
    >
      {children}

      {/* Mostrar mensajes de éxito y error */}
      <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
        <div className="d-flex align-items-center flex-column">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </TaskContext.Provider>
  );
}
