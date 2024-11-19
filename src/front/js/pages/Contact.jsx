import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext"; 

export const Contact = () => {
    const { store } = useContext(Context); 
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    useEffect(() => {
        if (store.user) {
            setFormData({
                firstName: store.user.first_name || "",
                lastName: store.user.last_name || "",
                email: store.user.email || "",
                message: "",
            });
        }
    }, [store.user]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const subject = "Contact from ExpenseVue";
        const body = `Name: ${formData.firstName} ${formData.lastName}\n\nMessage:\n${formData.message}`;
        const mailtoLink = `mailto:expensevue.sp77@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
        try {
            window.location.href = mailtoLink;
    
        } catch (error) {
            console.error('Error opening mailto link:', error);
            alert('There was an error with sending your message. Please try again.');
        }
    };
    

    return (
        <>
            <div className="container text-center mt-4">
                <h1>Contact</h1>
                <p>We’re here to help! Whether you have questions, feedback, or need support, feel free to reach out. Our team is dedicated to providing you with the assistance you need as quickly as possible.</p>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="container mt-3 px-4" style={{ maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerName">First Name</label>
                            <input
                                type="text"
                                id="registerName"
                                name="firstName"
                                className="form-control"
                                onChange={handleChange}
                                value={formData.firstName}
                            />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerLastname">Last Name</label>
                            <input
                                type="text"
                                id="registerLastname"
                                name="lastName"
                                className="form-control"
                                onChange={handleChange}
                                value={formData.lastName}
                            />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerEmail">Email</label>
                            <input
                                type="email"
                                id="registerEmail"
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label">Your message:</label>
                            <textarea
                                className="form-control textarea-large"
                                name="message"
                                onChange={handleChange}
                                value={formData.message}
                                aria-label="With textarea"
                            />
                        </div>
                        <button type="submit" className="btn btn-block mb-4" style={{ backgroundColor: '#2D3748', color: '#E2E8F0'}}>Send Message</button>
                    </form>
                </div>
            </div>
        </>
    );
};
