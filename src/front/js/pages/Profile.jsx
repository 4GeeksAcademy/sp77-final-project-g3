import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import userImg from "../../img/user-img.png";

export const Profile = () => {
	const { store, actions } = useContext(Context);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({});

	useEffect(() => {
		actions.getUser();
	}, []);

	useEffect(() => {
		if (store.user) {
			setFormData({
				first_name: store.user.first_name,
				last_name: store.user.last_name,
				email: store.user.email,
				phone_number: store.user.phone_number,
				id: store.user.id,
			});
		}
	}, [store.user]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = async () => {
		const success = await actions.updateUser(formData.id, formData);
		if (success) {
			console.log("Actualización exitosa");
			setIsEditing(false);
		} else {
			console.log("Error en la actualización");
		}
	};	

	const profileImg = store.user?.photo_url ? store.user.photo_url : userImg;

	return (
		<div className="container py-5">
			<div className="text-center mb-4">
				<h2>Welcome {store.user?.first_name}</h2>
				<p className="text-muted">
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
							<div className="d-flex justify-content-center mb-2">
								<button type="button" className="btn btn-dark">Not Available</button>
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
									<button onClick={handleSaveClick} className="btn btn-dark">Not Available</button>
								) : (
									<button onClick={handleEditClick} className="btn btn-dark">Not Available</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
