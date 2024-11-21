import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import userImg from "../../img/user-img.png";
import { Spinner } from "../component/Spinner.jsx";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        id: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);  // Estado para el archivo de imagen

    useEffect(() => {
        const userId = store.user?.id || localStorage.getItem("user_id");
        if (userId) {
            actions.getUser(userId).finally(() => setLoading(false));
        } else {
            setError("No se encontró el ID de usuario");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (store.user && store.user.id) {
            setFormData({
                first_name: store.user.first_name || "",
                last_name: store.user.last_name || "",
                email: store.user.email || "",
                phone_number: store.user.phone_number || "",
                id: store.user.id,
            });
        }
    }, [store.user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const success = await actions.updateUser(formData.id, formData);
        if (success) {
            setIsEditing(false);
            window.location.reload();
        } else {
            setError("Error en la actualización");
        }
    };

    const handleDeleteClick = async () => {
        const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmed) {
            const yapilyRemoval = await actions.deleteYapilyUser(store.user.yapily_id)
            const success = await actions.deleteUser(store.user.id);
            if (yapilyRemoval && success) {
                console.log("Usuario eliminado y redirigido.");
                window.location.href = "/";  //
            } else {
                setError("Error al intentar eliminar la cuenta.");
            }
        }
    };

    const profileImg = store.user?.photo_url || userImg;

    const handleImg = (event) => {
        if (event.target.files.length) {
            setFile(event.target.files[0]);
            sendImage(event.target.files[0]);  // Llama a sendImage inmediatamente
        }
    };

    const sendImage = async (imageFile) => {
        try {
            const form = new FormData();
            form.append("img", imageFile);
    
            const response = await fetch(`${store.host}/api/upload`, {
                method: 'POST',
                body: form
            });
            const data = await response.json();
    
            if (data.url) {
                const success = await actions.updateUser(store.user.id, { photo_url: data.url });
                if (success) {
                    // Recarga la página para reflejar los cambios inmediatamente
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log("ERROR", error);
            setError("Error al subir la imagen");
        }
    };    

    if (loading) return <Spinner />;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container py-2">
            <div className="text-center mb-4">
                <h2>Welcome {store.user?.first_name}</h2>
                <p className="text-dark">
                    Here, you can view and manage your personal details, including your name, email, and phone number.
                    Keep your profile up-to-date to ensure a seamless experience across our platform.
                </p>
            </div>
            <div className="row">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body text-center">
                            <img src={profileImg} alt="avatar" className="rounded-circle img-fluid" style={{ width: "150px" }} />
                            <h5 className="my-3">{store.user?.first_name} {store.user?.last_name}</h5>
                            <div className="d-flex flex-column align-items-center mb-2">
                                <label className="btn btn-dark" style={{ fontWeight:'bold' }}>
                                    Upload Image
                                    <input type="file" onChange={handleImg} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            {["first_name", "last_name", "email", "phone_number"].map((field, index) => (
                                <div key={index} className="row mb-3">
                                    <div className="col-sm-3">
                                        <p className="mb-0 text-capitalize">{field.replace("_", " ")}</p>
                                    </div>
                                    <div className="col-sm-7">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                className="form-control"
                                            />
                                        ) : (
                                            <p className="text-muted mb-0">{formData[field] || "N/A"}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="text-end">
                                {isEditing ? (
                                    <button onClick={handleSaveClick} className="btn btn-dark" style={{ fontWeight:'bold' }}>Save</button>
                                ) : (
                                    <button onClick={handleEditClick} className="btn btn-dark" style={{ fontWeight:'bold' }}>Edit</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mb-4">
                <p className="text-dark">
                If you wish to stop using our services, you can permanently delete your account. Please note that this action cannot be undone, and all your data will be removed. To proceed, click the "Delete Account" button below.
                </p>
                <button onClick={handleDeleteClick} className="btn btn-danger" style={{ fontWeight:'bold' }}>Delete Account</button>
            </div>
        </div>
    );
};
