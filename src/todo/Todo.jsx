import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';

const initialState = {
    todos: [],
    input: "",
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'HANDLE_CHANGE':
            return { ...state, [action.field]: action.value };
        case 'SET_TASK':
            return { ...state, todos: action.payload };
        case 'ADD_TASK':
            return { ...state, todos: [...state.todos, action.payload], input: "" };
        case 'UPDATE_TASK':
            return {
                ...state,
                todos: state.todos.map(todo => todo.id === action.payload.id ? action.payload : todo)
            };
        case 'REMOVE_TASK':
            return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
        default:
            return state;
    }
};

function Todo() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/todos')
            .then(response => dispatch({ type: 'SET_TASK', payload: response.data }))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        dispatch({ type: 'HANDLE_CHANGE', field: e.target.name, value: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            const updatedTask = { id: editId, text: state.input };
            dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
            setEditId(null);
        } else {
            const newTask = { id: Date.now(), text: state.input };
            dispatch({ type: 'ADD_TASK', payload: newTask });
        }
    };

    const handleEdit = (id) => {
        const todoToEdit = state.todos.find(todo => todo.id === id);
        dispatch({ type: 'HANDLE_CHANGE', field: 'input', value: todoToEdit.text });
        setEditId(id);
    };

    const handleRemove = (id) => {
        dispatch({ type: 'REMOVE_TASK', payload: id });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="input"
                    value={state.input}
                    onChange={handleChange}
                    placeholder="Add a new task"
                />
                <button type="submit">{editId ? 'Update' : 'Add'}</button>
            </form>
            <ul>
                {state.todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={() => handleEdit(todo.id)}>Edit</button>
                        <button onClick={() => handleRemove(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;
