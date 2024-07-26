import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import "./Tasks.css";


const ListTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Tarea pendiente",
  });
  const [statusOptions] = useState([
    'Tarea pendiente',
    'Tarea en proceso',
    'Tarea completa'
  ]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
        const result = await response.json();
        setTasks(result.data); 
        setLoading(false);
      } catch (error) {
        Swal.fire(
          "Error!",
          "Hubo un error al traer las tareas",
          "error"
        );
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });
      const result = await response.json();
      if (response.ok) {
        setTasks([...tasks, result.data]);
        Swal.fire({ text: "Tarea agregada con éxito", icon: "success" });
        setNewTask({
          title: "",
          description: "",
          status: "Tarea pendiente"
        });
      } else {
        Swal.fire(
          "Error!",
          "Hubo un error al crear la tarea",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "Hubo un error al crear la tarea",
        "error"
      );
    }
    }
 
    const handleDelete = async (id) => {
       const result = await Swal.fire({
        html: "<span class='custom-swal-title'>¿Está seguro de eliminar el registro?</span>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, deseo eliminarlo",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Algo salió mal");
          }
    
          setTasks((prevTask) =>
            prevTask.filter((t) => t.id !== id)
          );
          Swal.fire({ text: "La tarea ha sido eliminada.", icon: "success" });
        } catch (error) {
          Swal.fire({ text: `Error al enviar la solicitud: ${error.message}`, icon: 'error' });
        }
      }
    };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="barra-superior">
        <h2 className="titulo-section">LISTADO DE TAREAS</h2>
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleChange}
          placeholder="Título"
          required
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          placeholder="Descripción"
          required
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleChange}
          required
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button type="submit">Crear Tarea</button>
      </form>

      <div className="cards-container">
        {tasks.map((task) => (
          <div key={task.id} className="card">
            <div className="card-content">
              <h3>{task.title}</h3>
              <h4>{task.description}</h4>
              <h4>{'Status'}{ task.status} </h4>
              <button
                        className="delete-button"
                        onClick={() => handleDelete(task.id)}
                      >
                         <FontAwesomeIcon icon={faTrash} />Eliminar
                        
                      </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

};


export default ListTasks;
