const expensesTable = document.createElement('template');
expensesTable.innerHTML = `
    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        form {
            width: 100%;
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

    <form action="javascript:void(0);" method="POST">

    <table>

        <caption><h2>Expenses</h2></caption>

        <thead>
            <tr>

                <th>Action:</th>
                <th>User:</th>
                <th>Category:</th>
                <th>Cost:</th>
                <th>Date:</th>

            </tr>
        </thead>

        <tr>

            <td><button type="submit">Add Expense</button></td>

            <td><select name="user-select" required>
                <option value="" disabled selected>Choose User</option>
                <option value="Devlin Rocha">Devlin Rocha</option>  
            </select></td>

            <td><select name="category-select" required>
                <option value="" disabled selected>Choose Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Health">Health</option>
                <option value="Supplies">Supplies</option>
            </select></td>

            <td><input type="number" placeholder="Cost" required></td>

            <td><input type="date" required></td>

        </tr>
    </table>
    </form>
`;

class ExpensesTable extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(expensesTable.content.cloneNode(true));
    };

    addExpense() {
        class Expense {
            constructor(transaction) {
                this.user = transaction[0][0].value;
                this.category = transaction[0][1].value;
                this.cost = transaction[1][0].value;
                this.date = transaction[1][1].value;
            }; 
        };

        const transaction = ([
            this.shadowRoot.querySelector('table').querySelectorAll('select'),
            this.shadowRoot.querySelector('table').querySelectorAll('input')
        ]);

        const expense = new Expense(transaction);
        console.log(expense);

        const table = this.shadowRoot.querySelector('table');
        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.innerHTML = `
        <button id="edit-expense" type="button">Edit Expense</button>
        <button id="delete-expense" type="button">Delete Expense</button>
        `;
        cell2.innerHTML = expense.user;
        cell3.innerHTML = expense.category;
        cell4.innerHTML = expense.cost;
        cell5.innerHTML = expense.date;

        cell1.querySelector('#delete-expense').addEventListener('click', () => this.deleteExpense(row))
        cell1.querySelector('#edit-expense').addEventListener('click', () => this.editExpense(row))
    };

    deleteExpense(expense) {
        expense.remove();
    };

    editExpense() {
        console.log('Edit expense');
    };

    connectedCallback() {
        this.shadowRoot.querySelector('form')
        .addEventListener('submit', () => this.addExpense());
    };
};

customElements.define('expenses-table', ExpensesTable);