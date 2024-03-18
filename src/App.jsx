import React, { useState, useEffect } from 'react';
import './index.css';
import background from './assets/background.png';
import { IoTrashBin } from "react-icons/io5";
import { MdOutlineUpdate } from "react-icons/md";



function App() {
  const [todos, setTodos] = useState([]);
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await changeStatus(id, newStatus);
    } catch (error) {
      alert("Some error Occurred");
      console.error(error);
    }
  };


  // Function to fetch todos from API
  const fetchTodos = async () => {
    try {
      const response = await fetch('https://todobackend-kwtb.onrender.com/api/v1/Todo');

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const responsedata = await response.json();
       
      setTodos(responsedata.data); 

    } 
    catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

   
  useEffect(() => {
    fetchTodos();
  }, []); 


  //function to add todo
  const addTodo =async(e)=>{
    e.preventDefault();
    try {
      const response = await fetch('https://todobackend-kwtb.onrender.com/api/v1/Todo',{
          method:'POST',
          headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title,description})
        });

        if (!response.ok) {
            throw new Error('Failed to add todo');
        }
 
        await fetchTodos();

        // Clear input fields
        setTitle('');
        setDescription('');
        
      }
    catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  const update= async(id)=>{
    const newTitle = window.prompt("Enter new title");
    const newDesc = window.prompt("Enter new description");

    try {
    await fetch(`https://todobackend-kwtb.onrender.com/api/v1/Todo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({newTitle, newDesc })
    });
 
     await fetchTodos();
    } 
    catch (error) {
    alert("Some error Occurred");
    console.error(error);
    }
}

const deleteTodo = async(id)=>{
  try {
         const response =   await fetch(`https://todobackend-kwtb.onrender.com/api/v1/Todo/${id}`, {
          method: 'DELETE',
      });
      if (!response.ok) {
          throw new Error('Failed to delete Todo');
      }
      await fetchTodos();
  } catch (error) {
      alert("Error occured!!")
      console.error(error);
  }
}

const changeStatus = async (id, newStatus) => {
  try {
    await fetch(`https://todobackend-kwtb.onrender.com/api/v1/Todo/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    await fetchTodos();
  } catch (error) {
    alert("Some error Occurred");
    console.error(error);
  }
};


  return (
    <>
    <h1>Todo Application</h1>
    <img className='bg' src={background} alt="background" />
     <div className='parent'>
      <div className='container'>
        <form>
          <input type="text" placeholder="Enter title.. " value={title}  onChange={handleTitleChange}/>
          <input type="text" placeholder="Enter description.." value={description} onChange={handleDescriptionChange} />
          <button onClick={addTodo} className='btn'>ADD</button>
        </form>
       {todos.length!=0 &&  <div className="details">
          <table className='table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map(todo => (
                <tr key={todo._id}>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td> 
                    <select value={todo.status} onChange={(e) => handleStatusChange(todo._id, e.target.value)}>
                      <option  value="pending">Pending</option>
                      <option value="completed">Completed</option>
                   </select>
                   </td>
                  <td>
                    <button className='actions' onClick={() => update(todo._id)}><MdOutlineUpdate /></button>
                    <button className='actions' onClick={() => deleteTodo(todo._id)}><IoTrashBin /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
    </>
   
  );
}

export default App;
