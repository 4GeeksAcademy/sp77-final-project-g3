import React, { useContext, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Context } from "../store/appContext.js";
import { Spinner } from "../component/Spinner.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BalanceGraph = () => {
    const { store, actions } = useContext(Context);

    const transactionsByMonth = store.transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('en-US', { month: 'long' });
        const type = transaction.type;

        if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
        }

        if (type === 'income') {
            acc[month].income += transaction.amount;
        } else if (type === 'expense') {
            acc[month].expense += transaction.amount;
        }

        return acc;
    }, {});

    const orderedMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const sortedData = orderedMonths
        .filter(month => transactionsByMonth[month])
        .map(month => ({
            month,
            income: transactionsByMonth[month].income,
            expense: transactionsByMonth[month].expense
        }));

    const chartData = {
        labels: sortedData.map(item => item.month),
        datasets: [
            {
                label: 'Income',
                data: sortedData.map(item => item.income),
                backgroundColor: 'rgba(34, 139, 34, 0.6)',
                borderColor: 'rgba(34, 139, 34, 1)',
                borderWidth: 1,
            },
            {
                label: 'Expenses',
                data: sortedData.map(item => item.expense),
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value}`,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Balance Chart',
            },
        },
    };

    return (
        <div className='card mb-3 mt-3 p-3' style={{ width: '100%', height: '200px', margin: 'auto' }}>
            {store.transactions.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <div className="text-center">
                    <Spinner />
                </div>
            )}
        </div>
    );
};
