import { users } from '../data/users.js';
import { expenses } from '../data/expenses.js';

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
            background-color: #00AED8;
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

            <td><select class="user-select" name="user-select" required>
                <option value="" disabled selected>Choose User</option>
            </select></td>

            <td><select name="category-select" required>
                <option value="" disabled selected>Choose Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Health">Health</option>
                <option value="Supplies">Supplies</option>
            </select></td>

            <td><input type="currency" placeholder="Cost" step="any" value=$ required></td>

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
                this.id = getId(16);
            }; 
        };

        const transaction = ([
            this.shadowRoot.querySelector('table').querySelectorAll('select'),
            this.shadowRoot.querySelector('table').querySelectorAll('input')
        ]);

        const expense = new Expense(transaction);
        expenses.push(expense);
        this.setAttribute('transactions', expenses.length);

        function getId(length) {

            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                result += characters.charAt(
                Math.floor(Math.random() * charactersLength));
            };

            for (let i = 0; i < expenses.length; i++) {
                if (result === expenses[i].id) {
                    getId(length);
                };
            };
           return result;
        };

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
        cell2.classList.add('input')
        cell3.innerHTML = expense.category;
        cell3.classList.add('input')
        cell4.innerHTML = expense.cost;
        cell4.classList.add('input')
        cell5.innerHTML = expense.date;
        cell5.classList.add('input')

        cell1.querySelector('#delete-expense').addEventListener('click', () => this.deleteExpense(row))
        cell1.querySelector('#edit-expense').addEventListener('click', () => this.editExpense(row))
    };

    deleteExpense(expense) {
        const index = expenses.forEach(transaction => {
            expenses.indexOf(transaction);
        });
        expenses.splice(index, 1);
        expense.remove();
        this.setAttribute('transactions', expenses.length);
    };

    editExpense(row) {
        const editButton = row.querySelector('.edit-expense');
        const edits = row.querySelectorAll('.input');
        if (editButton.textContent === 'Edit User') {
            edits.forEach(edit => {
                const previousValue = edit.textContent;
                edit.innerHTML = `<input type="text" value=${previousValue}>`
            });
            editButton.textContent = 'Save Edit';
            
        } else if (editButton.textContent === 'Save Edit') {
            edits.forEach(edit => {
            });
            editButton.textContent = 'Edit Expense';
        };
        editButton.textContent = 'Save Edit';
    };

    getUsers() {
        const select = this.shadowRoot.querySelector('.user-select');

        // Tried brute forcing and still couldn't get it to work properly:
        for (let i = 1; i < select.options.length; i++) {
            if (!select.options[i].disabled) select.options.remove(i);
        };

        users.forEach(user => {
            const option = document.createElement('option');
            const fullName = `${user.name.firstName} ${user.name.lastName}`;
            option.value = fullName;
            option.innerHTML = fullName;
            select.appendChild(option);
        });

        users.forEach(user => {
            for (let i = 0; i <= select.options.length - 1; i++) {
                const selectOption = select.options[i];
                const fullName = `${user.name.firstName} ${user.name.lastName}`;
                if (!selectOption.disabled && selectOption.value !== fullName) {
                    return;
                };
            };
        });
    };

    connectedCallback() {
        this.shadowRoot.querySelector('form')
        .addEventListener('submit', () => this.addExpense());
        this.shadowRoot.querySelector('caption')
        .addEventListener('click', () => this.getUsers());
    };

    disconnectedCallback() {
        this.shadowRoot.querySelector('form')
        .removeEventListener();
    };
};

customElements.define('expenses-table', ExpensesTable);