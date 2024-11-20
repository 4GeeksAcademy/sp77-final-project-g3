import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import '../../styles/transactions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faCircleArrowDown, faBuildingColumns, faChartLine, faTrashCan, faCreditCard, faMoneyBills, faPen } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from "../component/Spinner.jsx";
import { TransactionsChart } from "../component/TransactionsChart.jsx";
import { useNavigate } from "react-router-dom";

export const Categories = () => {
	const { store, actions } = useContext(Context);
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const navigate = useNavigate();
	const userId = store.user.id

	useEffect(() => {
       actions.getCategories();
    }, []);

	const handleSubmit = (event) => {
		event.preventDefault();

		const dataToSend = {
			name: name,
			description: description,
			user_id: userId,
		}
		actions.createCategory(dataToSend)
		const modal = document.getElementById("NewTransactionModal");
		if (modal) {
			const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
			if (bootstrapModal) bootstrapModal.hide();
		}

		setName('');
		setDescription('');
		navigate('/categories')
	}

	const deleteCategory = (id) => {
		actions.deleteCategory(id);
	}

	const editCategory = async (item) => {
		const itemEdited = {
			id: item.id,
			name: item.name,
			description: item.description,
		}
		actions.setCurrentCategory(itemEdited)
		console.log("this is the data to send to current transaction:", itemEdited)
		navigate('/edit-category');
	}

	return (
		<div className="transactions-container">
			<div>
				<header className="transactions-header">
					<div className="container my-4">
						<div className="row align-items-center">
							<div className="col">
								<h2>Categories</h2>
								<p>Welcome to your Categories</p>
							</div>
							<div className="col-auto">
								<button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#NewTransactionModal" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>New Category</button>
								<div className="modal fade" id="NewTransactionModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
									<div className="modal-dialog">
										<div className="modal-content">
											<div className="modal-header">
												<h5 className="modal-title" id="exampleModalLabel" >New Category</h5>
												<button type="reset" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}></button>
											</div>
											<div className="modal-body">
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
														<button type="submit" className="btn" style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }}>Create Category</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				</header>

				<div className="transactions-list card p-3 text-truncate" style={{ overflowX: 'auto' }}>
					<table>
						<thead>
							<tr>
								<th colSpan="4" className="h5">Categories</th>
							</tr>
							<tr>
								<th>Name</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{!store.categories || store.categories.length === 0 ? (
								<tr>
									<td colSpan="4"> <div className="m-3"> <Spinner /> </div></td>
								</tr>
							) : (
								store.categories.map((item, index) => (
									<tr key={item.id}>
										<td>{item.name}</td>
										<td>{item.description}</td>
										<td>  <button type="button" onClick={() => editCategory(item)} className="btn"> <FontAwesomeIcon icon={faPen} /> </button></td>
										<td>  <button type="button" className="btn" onClick={() => deleteCategory(item.id)}> <FontAwesomeIcon icon={faTrashCan} /> </button></td>
										</tr>
								))
							)}
						</tbody>
					</table>

					{/* Paginación
					<nav aria-label="Page navigation" className="mt-3">
						<ul className="pagination justify-content-center">
							{Array.from({ length: totalPages }, (_, index) => (
								<li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
									<button className="page-link"
										onClick={() => handlePageChange(index + 1)}
										style={{
											backgroundColor: currentPage === index + 1 ? "#2D3748" : "white",
											color: currentPage === index + 1 ? "white" : "#2D3748",
											border: `1px solid #2D3748`,
										}}>
										{index + 1}
									</button>
								</li>
							))}
						</ul>
					</nav> */}
				</div>
			</div>
		</div>
	);
};
