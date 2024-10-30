import React from "react";
import "../../styles/index.css";


export const Faq = () => {
    return (
        <div className="container my-3">
            <h1>Frequently Asked Questions (FAQs)</h1>
            <p>At ExpenseVue, we strive to make managing your finances as easy as possible. Whether you're linking your bank accounts for automatic updates or manually tracking your transactions, our platform is designed to give you full control over your financial health. Below are some frequently asked questions to help you get started and make the most out of ExpenseVue's features.</p>
            <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        What is ExpenseVue?
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                        ExpenseVue is a financial management platform that allows you to track your transactions, create budgets, view your general balance, and manage expenses and income. You can link your bank account or manually input your financial data.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingTwo">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            How do I link my bank account?
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            To link your bank account, go to your profile settings, select "Connections," and follow the instructions to securely connect your account. ExpenseVue uses encrypted technology to ensure your data is safe.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingThree">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                            Can I manually input transactions?
                        </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                        Yes! If you prefer to manage your finances manually, you can add transactions, expenses, and income directly through the platform. Simply go to the "Transactions" section and click "Add Transaction."
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingFour">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                            How is my financial data secured?
                        </button>
                    </h2>
                    <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Your security is our priority. We use bank-level encryption and do not store sensitive information like your bank credentials. Your data is only used to provide you with accurate insights into your finances.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingFive">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                            What features does ExpenseVue offer?
                        </button>
                    </h2>
                    <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            ExpenseVue offers tools to help you manage your:
                            <ul>
                                <li><b>Transactions:</b> View, categorize, and track every financial move.</li>
                                <li><b>Budgets:</b> Set limits on spending and monitor how you're doing.</li>
                                <li><b>General Balance:</b> Keep an eye on your total financial situation.</li>
                                <li><b>Expenses & Income:</b> Record your earnings and expenditures.</li>
                            </ul>                     
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingSix">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
                            Can I create multiple budgets?
                        </button>
                    </h2>
                    <div id="flush-collapseSix" className="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Yes, you can create multiple budgets based on different categories such as housing, transportation, entertainment, etc. This helps you get a detailed overview of where your money is going.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingSeven">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSeven" aria-expanded="false" aria-controls="flush-collapseSeven">
                            Is ExpenseVue free to use? 
                        </button>
                    </h2>
                    <div id="flush-collapseSeven" className="accordion-collapse collapse" aria-labelledby="flush-headingSeven" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            Yes, ExpenseVue is completely free to use. All of our tools and features are available at no cost, with no premium plans or upgrades required.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingEight">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseEight" aria-expanded="false" aria-controls="flush-collapseEight">
                            What should I do if I notice an error in my financial data? 
                        </button>
                    </h2>
                    <div id="flush-collapseEight" className="accordion-collapse collapse" aria-labelledby="flush-headingEight" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            If you spot an error, you can manually adjust transactions or reach out to our support team, who can assist you in resolving any discrepancies.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingNine">
                        <button className="accordion-button collapsed bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseNine" aria-expanded="false" aria-controls="flush-collapseNine">
                            How can I contact support?
                        </button>
                    </h2>
                    <div id="flush-collapseNine" className="accordion-collapse collapse" aria-labelledby="flush-headingNine" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body">
                            You can reach out to us by filling out the form in the "Contact" section of our website. Our support team will get back to you as soon as possible to assist with any questions or concerns.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};