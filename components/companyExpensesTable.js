import { expenses } from '../data/expenses.js';

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
        const expenseCategories = expenses.map(expense => {
            return expense.category;
        });

        try {

            const totalExpenses = expenses
            .map(expense => Number(expense.cost.replace('$', '')))
            .reduce((total, expense) => total + expense);

            function getCategory(object, value) {
                return Object.keys(object).find(key => object[key] === value);
            };

        } catch (error) {

            console.error(error);

        };

        const table = this.shadowRoot.querySelector('table');

        for (let i = 1; i < expenseCategories.length; i++) {
            if (select.options.remove(i));
        };

        for (let i = 0; i < expenseCategories.length; i++) {
            const row = table.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);

            cell1.innerHTML = expenseCategories[i];
            cell2.innerHTML = `$${totalExpenses}`;
        };
    };
};

customElements.define('company-expenses-table', CompanyExpensesTable);