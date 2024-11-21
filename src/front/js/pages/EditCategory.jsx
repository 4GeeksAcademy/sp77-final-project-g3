import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import '../../styles/transactions.css';
import { useNavigate } from "react-router-dom";

export const EditCategory = () => {
    const { store, actions } = useContext(Context);
    const currentCategory = store.currentCategory || {};
    const [name, setName] = useState(currentCategory.name || '');
    const [description, setDescription] = useState(currentCategory.description || '');
    const navigate = useNavigate();
    const userId = store.user.id

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = {
            name: name,
            description: description,
            user_id: userId
        }
        console.log("Current category:", currentCategory);
        console.log("Current category ID:", currentCategory.id);

        console.log('este es el datatosend de categoriess', dataToSend)
        actions.editCategory(currentCategory.id, dataToSend);
        actions.getCategories()
        navigate('/categories')
    }

    const handleReset = () => { navigate('/categories') };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-outline mb-4">
                <label className="form-label" htmlFor="registerName">Name<span className="required">*</span></label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
            </div>
            <div className="form-outline mb-4">
                <label className="form-label">Description:</label>
                <textarea
                    className="form-control textarea"
                    name="description"
                    aria-label="With textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>
            <div className="modal-footer">
                <button type="reset" onClick={handleReset} className="btn btn-danger">Cancel </button>
                <button type="submit" className="btn" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>Edit Category</button>
            </div>
        </form>
    )
}
