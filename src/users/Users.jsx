import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

const initialState = {
    users: [],
    selectedUser: null,
    formData: {
        name: '',
        username: '',
        email: '',
    },
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.payload };
        case 'SET_EDIT':
            return { ...state, formData: action.payload, selectedUser: action.payload.id };
        case 'SET_FORMDATA':
            return { ...state, formData: { ...state.formData, [action.name]: action.value } };
        case 'CLEAR_FORM':
            return { ...state, formData: { name: '', username: '', email: '' }, selectedUser: null };
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user => (user.id === action.payload.id ? action.payload : user)),
            };
        case 'DELETE_USER':
            return { ...state, users: state.users.filter(user => user.id !== action.payload) };
        default:
            return state;
    }
};

function Books() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                dispatch({ type: 'SET_USERS', payload: response.data });
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        dispatch({ type: 'SET_FORMDATA', name: e.target.name, value: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = state.selectedUser ? 'put' : 'post';
        const url = `https://jsonplaceholder.typicode.com/users${state.selectedUser ? `/${state.selectedUser}` : ''}`;

        try {
            const response = await axios[action](url, state.formData);
            dispatch({ type: state.selectedUser ? 'UPDATE_USER' : 'ADD_USER', payload: response.data });
            dispatch({ type: 'CLEAR_FORM' });
        } catch (err) {
            console.log(`Failed to ${state.selectedUser ? 'update' : 'add'} user`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
            dispatch({ type: 'DELETE_USER', payload: id });
        } catch (err) {
            console.log('Failed to delete user');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">User Management</h1>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={state.formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="username"
                    className="form-control mb-2"
                    placeholder="User Name"
                    value={state.formData.username}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={state.formData.email}
                    onChange={handleInputChange}
                />
                <button className={`btn ${state.selectedUser ? 'btn-warning' : 'btn-primary'} w-100`}>
                    {state.selectedUser ? 'Update User' : 'Add User'}
                </button>
            </form>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => dispatch({ type: 'SET_EDIT', payload: user })}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Books;
