import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditBudget = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const budget = store.budgets.find((b) => b.id === parseInt(id)) || {};
    const [amount, setAmount] = useState(budget.budget_amount || "");
    const [targetPeriod, setTargetPeriod] = useState(
        budget.target_period ? new Date(budget.target_period).toISOString().split("T")[0] : ""
    );
    const [category, setCategory] = useState(budget.category_id || "");
    const [totalExpense, setTotalExpense] = useState(budget.total_expense || "");

    useEffect(() => {
        if (!budget.id) {
            actions.getBudgets(); 
        }
    }, [budget, actions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            budget_amount: amount,
            target_period: targetPeriod,
            category_id: category,
            total_expense: totalExpense,
        };
        actions.editBudget(id, updatedData).then(() => {
            navigate("/budgets");
        });
    };

    return (
        <div className="container my-4">
            <h2>Edit Budget</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Budget Amount (€)</label>
                    <input
                        type="number"
                        id="amount"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="targetPeriod" className="form-label">Target Period</label>
                    <input
                        type="date"
                        id="targetPeriod"
                        className="form-control"
                        value={targetPeriod}
                        onChange={(e) => setTargetPeriod(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {store.categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="totalExpense" className="form-label">Total Expense (€)</label>
                    <input
                        type="number"
                        id="totalExpense"
                        className="form-control"
                        value={totalExpense}
                        onChange={(e) => setTotalExpense(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-dark">Save Changes</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/budgets")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
