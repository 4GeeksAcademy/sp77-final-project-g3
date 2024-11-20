import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";
import "../../styles/budgets.css";

export const Budgets = () => {
    const { store, actions } = useContext(Context);
    const [budgetAmount, setBudgetAmount] = useState("");
    const [targetPeriod, setTargetPeriod] = useState("");
    const [category, setCategory] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [mainFilter, setMainFilter] = useState("all");
    const [amountOrder, setAmountOrder] = useState("");
    const [targetPeriodOrder, setTargetPeriodOrder] = useState("");
    const [expenseOrder, setExpenseOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const uniqueBudgets = Array.from(new Map(store.budgets.map(b => [b.id, b])).values());

    useEffect(() => {
        actions.getCategories();
        actions.getBudgets();
    }, []);

    const filteredBudgets = uniqueBudgets
        .sort((a, b) => new Date(b.target_period) - new Date(a.target_period))
        .filter((budget) => {
            if (mainFilter === "all") return true;
            if (mainFilter === "category" && categoryFilter) {
                return budget.category_name === categoryFilter;
            }
            return true;
        })
        .sort((a, b) => {
            if (mainFilter === "amount" && amountOrder) {
                return amountOrder === "asc"
                    ? a.budget_amount - b.budget_amount
                    : b.budget_amount - a.budget_amount;
            }
            if (mainFilter === "target_period" && targetPeriodOrder) {
                return targetPeriodOrder === "asc"
                    ? new Date(a.target_period) - new Date(b.target_period)
                    : new Date(b.target_period) - new Date(a.target_period);
            }
            if (mainFilter === "total_expense" && expenseOrder) {
                return expenseOrder === "asc"
                    ? a.total_expense - b.total_expense
                    : b.total_expense - a.total_expense;
            }
            return 0;
        });

    const budgetsPerPage = 8;
    const totalPages = Math.ceil(filteredBudgets.length / budgetsPerPage);
    const paginatedBudgets = filteredBudgets.slice(
        (currentPage - 1) * budgetsPerPage,
        currentPage * budgetsPerPage
    );

    const handleSubmit = (event) => {
        event.preventDefault();

        const budgetData = {
            budget_amount: budgetAmount.toString(),
            target_period: targetPeriod.split("T")[0],
            category_id: category,
            total_expense: "0"
        };

        console.log("Budget data being sent:", budgetData);
        actions.createBudget(budgetData).then(() => {
            actions.getBudgets();
            setBudgetAmount("");
            setTargetPeriod("");
            setCategory("");
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            actions.deleteBudgets(id).then(() => {
                actions.getBudgets();
            });
        }
    };

    return (
        <div className="budgets-container">
            <header className="budgets-header text-center py-4">
                <h2 className="text-dark">Manage Your Budgets</h2>
                <p className="text-muted">Take control of your finances by setting and tracking your budgets. Categorize your spending, plan for your goals, and monitor your progress all in one place.</p>
            </header>
            <div className="container">
                <div className="row mb-4">
                    <div className="col-12 col-sm-4 mb-3">
                        <div className="card text-center p-4">
                            <i className="fas fa-wallet fa-2x text-warning"></i>
                            <h5>Total Amount in Budgets</h5>
                            <p className="text-dark">
                                €{filteredBudgets.reduce((acc, budget) => acc + (budget.budget_amount || 0), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4 mb-3">
                        <div className="card text-center p-4">
                            <i className="fa-solid fa-layer-group fa-2x text-warning"></i>
                            <h5>Total Categories</h5>
                            <p className="text-dark">{store.categories?.length || 0}</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4 mb-3">
                        <div className="card text-center p-4">
                            <i className="fa-solid fa-euro-sign fa-2x text-warning"></i>
                            <h5>Total Expenses</h5>
                            <p className="text-dark">
                                €{filteredBudgets.reduce((acc, budget) => acc + (budget.total_expense || 0), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-end">
                    <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#NewBudgetModal">
                        <i className="fas fa-plus"></i> Add Budget
                    </button>
                </div>
                <div className="modal fade" id="NewBudgetModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Budget</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="budgetAmount" className="form-label">
                                            Budget Amount (€) <span className="required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="budgetAmount"
                                            value={budgetAmount}
                                            onChange={(e) => setBudgetAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="targetPeriod" className="form-label">
                                            Target Period <span className="required">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="targetPeriod"
                                            value={targetPeriod}
                                            onChange={(e) => setTargetPeriod(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">
                                            Category <span className="required">*</span>
                                        </label>
                                        <select
                                            id="category"
                                            className="form-select"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {(Array.isArray(store.categories) ? store.categories : []).map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="totalExpense" className="form-label">
                                            Total Expense (€)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="totalExpense"
                                            value={0}
                                            readOnly
                                        />
                                        <small className="form-text text-muted">Edit this once you know the actual total expense.</small>
                                    </div>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-dark">
                                            Save Budget
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4 my-4">
                    <div className="col-6">
                        <select
                            className="form-select"
                            value={mainFilter}
                            onChange={(e) => {
                                const selectedFilter = e.target.value;
                                setMainFilter(selectedFilter);

                                if (selectedFilter === "all") {
                                    setCategoryFilter("");
                                    setAmountOrder("");
                                    setTargetPeriodOrder("");
                                    setExpenseOrder("");
                                }
                            }}
                        >
                            <option value="all">All</option>
                            <option value="category">Category</option>
                            <option value="amount">Amount</option>
                            <option value="target_period">Target Period</option>
                            <option value="total_expense">Total Expense</option>
                        </select>
                    </div>
                    {mainFilter !== "all" && (
                        <div className="col">
                            {mainFilter === "category" && (
                                <select
                                    className="form-select"
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {store.categories?.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {(mainFilter === "amount" ||
                                mainFilter === "target_period" ||
                                mainFilter === "total_expense") && (
                                    <select
                                        className="form-select"
                                        onChange={(e) =>
                                            mainFilter === "amount"
                                                ? setAmountOrder(e.target.value)
                                                : mainFilter === "target_period"
                                                    ? setTargetPeriodOrder(e.target.value)
                                                    : setExpenseOrder(e.target.value)
                                        }
                                    >
                                        <option value="">Select Order</option>
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                )}
                        </div>
                    )}
                </div>
                <div className="row">
    {paginatedBudgets.length === 0 ? (
        <p className="text-center">No budgets available</p>
    ) : (
        paginatedBudgets.map((budget) => (
            <div key={budget.id} className="col-6 col-md-3 mb-4">
                <div className="card p-3">
                    <h5>{budget.category_name}</h5>
                    <p>
                        <strong>Amount:</strong> €{budget.budget_amount}
                    </p>
                    <p>
                        <strong>Target Period:</strong> {new Date(budget.target_period).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Total Expense:</strong> €{budget.total_expense || 0}
                    </p>
                    <div className="text-end">
                        <Link
                            to={`/edit-budget/${budget.id}`}
                            className="btn btn-warning btn-sm"
                        >
                            <i className="fa-solid fa-pencil"></i>
                        </Link>
                        <button
                            className="btn btn-dark btn-sm ms-2"
                            onClick={() => handleDelete(budget.id)}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        ))
    )}
</div>
            </div>
            <div className="text-center py-4">
                <button
                    className="btn btn-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span className="mx-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn btn-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
