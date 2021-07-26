import { expenses } from '../data/expenses.js';
import { companyExpenses } from '../data/companyExpenses.js';

const companyExpensesTable = document.createElement('template');
companyExpensesTable.innerHTML = `
    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        section {
            width: 100%;
            background-color: #C2E320;
        }

        table {
            width: 100%;
        }

        caption {
            padding: 8px;
        }

        th {
            text-align: left;
        }

        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }

        th, td {
            padding: 16px;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }

        tr:nth-child(odd) {
            background-color: #ffffff;
        }

    </style>

    <section>

    <table>

    <caption><h2>Company Expenses</h2></caption>

    <thead>
        <tr>

            <th>Category:</th>
            <th>Total Expenses:</th>

        </tr>
    </thead>

    <tr>
        <td></td>
        <td></td>
    </tr>

    </table>

    </section>
`;

class CompanyExpensesTable extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(companyExpensesTable.content.cloneNode(true));
    };

    getExpenses() {
        const expenseCategories = expenses
            .map(expense => expense.category);

        function findIndex(category) {
            return Object.keys(expenses).find(key => expenses[key].category === category);
        };

        expenseCategories.forEach(category => {
            const index = findIndex(category);
            const expense = { 'category': expenses[index].category, 'cost': expenses[index].cost }
            companyExpenses.push(expense);
        });

        console.log(companyExpenses);

        const table = this.shadowRoot.querySelector('tbody');
        table.innerHTML = `
            ${companyExpenses.map(expense => {
                return `
                    <tr>
                        <td>${expense.category}</td>
                        <td>$${expense.cost}</td>
                    </tr>
                `;
            }).join('')}
        `;

        // const table = this.shadowRoot.querySelector('tbody');
        // console.log(table)
        // table.innerHTML = `
        //     ${expenses.map(expense => {
        //         return `
        //             <tr>
        //                 <td>${expense.category}</td>
        //                 <td>$${expense.cost}</td>
        //             </tr>
        //         `;
        //     }).join('')}
        // `;

        // const table = this.shadowRoot.querySelector('tbody');
        // console.log(table)
        // table.innerHTML = `
        //     ${expenseCategories.map(category => {
        //         expenses.map(expense => {
        //             return `
        //                 <tr>
        //                     <td>${category}</td>
        //                     </td>${expense.cost}</td>
        //                 </tr>
        //             `;
        //         });
        //     }).join('')}
        // `;
    };
};

customElements.define('company-expenses-table', CompanyExpensesTable);