import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import emailjs from '@emailjs/browser/';

export const Contact = () => {
    const { store } = useContext(Context);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });
    const [alertVisible, setAlertVisible] = useState(false);

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

    const refForm = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();

        const serviceID = process.env.SERVICEID;
        const templateID = process.env.TEMPLATEID;
        const apiKey = process.env.APIKEY;

        emailjs.sendForm(serviceID, templateID, refForm.current, apiKey)
            .then(result => {
                console.log(result.text);
                setAlertVisible(true);
                setFormData({
                    firstName: store.user.first_name || "",
                    lastName: store.user.last_name || "",
                    email: store.user.email || "",
                    message: "",
                });
            })
            .catch(error => console.error(error));
    };

    return (
        <>
            <div className="container text-center mt-4">
                <h1>Contact</h1>
                <p>We’re here to help! Whether you have questions, feedback, or need support, feel free to reach out. Our team is dedicated to providing you with the assistance you need as quickly as possible.</p>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="container mt-3 px-4" style={{ maxWidth: '800px' }}>
                    <form ref={refForm} onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                            <fieldset>
                                <label className="form-label" htmlFor="registerName">First Name <span className="required">*</span></label>
                                <input type="text" id="registerName" name="firstName" className="form-control" onChange={handleChange} value={formData.firstName} />
                            </fieldset>
                        </div>
                        <div className="form-outline mb-4">
                            <fieldset>
                                <label className="form-label" htmlFor="registerLastname">Last Name <span className="required">*</span></label>
                                <input type="text" id="registerLastname" name="lastName" className="form-control" onChange={handleChange} value={formData.lastName} />
                            </fieldset>
                        </div>
                        <div className="form-outline mb-4">
                            <fieldset>
                                <label className="form-label" htmlFor="registerEmail">Email <span className="required">*</span></label>
                                <input type="email" id="registerEmail" name="email" className="form-control" onChange={handleChange} value={formData.email} required />
                            </fieldset>
                        </div>
                        <div className="form-outline mb-4">
                            <fieldset>
                                <label className="form-label">Your message: <span className="required">*</span></label>
                                <textarea className="form-control textarea-large" name="message" onChange={handleChange} value={formData.message} aria-label="With textarea" required />
                            </fieldset>
                        </div>
                        <button type="submit" className="btn btn-block mb-4" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>Send Message</button>
                        {alertVisible && (
                            <div className="alert alert-success mt-3" role="alert">
                                Your message has been sent successfully!
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};
