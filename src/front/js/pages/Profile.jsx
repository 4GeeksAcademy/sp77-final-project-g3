import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import userImg from "../../img/user-img.png";

export const Profile = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		actions.getUser();
	}, []);

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
								<button type="button" className="btn btn-dark">Upload Photo</button>
							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-8">
					<div className="card mb-4">
						<div className="card-body">
							<div className="row">
								<div className="col-sm-3">
									<p className="mb-0">First Name</p>
								</div>
								<div className="col-sm-9">
									<p className="text-muted mb-0">{store.user?.first_name || "N/A"}</p>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="col-sm-3">
									<p className="mb-0">Last Name</p>
								</div>
								<div className="col-sm-9">
									<p className="text-muted mb-0">{store.user?.last_name || "N/A"}</p>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="col-sm-3">
									<p className="mb-0">Email</p>
								</div>
								<div className="col-sm-9">
									<p className="text-muted mb-0">{store.user?.email || "N/A"}</p>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="col-sm-3">
									<p className="mb-0">Phone</p>
								</div>
								<div className="col-sm-9">
									<p className="text-muted mb-0">{store.user.phone_number}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
