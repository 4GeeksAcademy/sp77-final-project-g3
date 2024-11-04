import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export const CreateTransaction = ({ show, handleClose, handleSave }) => {
    const [transactionData, setTransactionData] = useState({
        sourceTo: '',
        categoryTo: '',
        amount: '',
        description: '',
        date: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        handleSave(transactionData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formSourceTo">
                        <Form.Label>Source To</Form.Label>
                        <Form.Control
                            type="text"
                            name="sourceTo"
                            value={transactionData.sourceTo}
                            onChange={handleChange}
                            placeholder="Enter Source"
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategoryTo">
                        <Form.Label>Category To</Form.Label>
                        <Form.Control
                            type="text"
                            name="categoryTo"
                            value={transactionData.categoryTo}
                            onChange={handleChange}
                            placeholder="Enter Category"
                        />
                    </Form.Group>
                    <Form.Group controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={transactionData.amount}
                            onChange={handleChange}
                            placeholder="Enter Amount"
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={transactionData.description}
                            onChange={handleChange}
                            placeholder="Enter Description"
                        />
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="date"
                            value={transactionData.date}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Transaction
                </Button>
            </Modal.Footer>
        </Modal>
    );
}