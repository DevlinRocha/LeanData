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

        .hidden {
            display: none;
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
                <th class="hidden">Transaction ID:</th>

            </tr>
        </thead>

        <tbody>
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

                <td>
                    <label for="cost">$</label>
                    <input type="number" placeholder="Cost" step="0.01" name="cost" required>
                </td>

                <td><input type="date" required></td>

                <td class="hidden"></td>

            </tr>
        </tbody>
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
                this.userID = transaction[2][0].getAttribute('userid');
                this.category = transaction[0][1].value;
                this.cost = Number(transaction[1][0].value);
                this.date = transaction[1][1].value;
                this.expenseID = getID(16);
            }; 
        };

        const transaction = ([
            this.shadowRoot.querySelectorAll('select'),
            this.shadowRoot.querySelectorAll('input'),
            this.shadowRoot.querySelector('.user-select').selectedOptions,
        ]);

        const expense = new Expense(transaction);
        expenses.push(expense);

        function getID(length) {

            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                result += characters.charAt(
                Math.floor(Math.random() * charactersLength));
            };

            for (let i = 0; i < expenses.length; i++) {
                if (result === expenses[i].expenseID) {
                    getID(length);
                };
            };
           return result;
        };

        users.forEach((user) => {
            expenses.forEach((expense) => {
                if (user.userID === expense.userID) {
                    user.expenses += Number(expense.cost);
                };
            });
        });

        this.setAttribute('transactions', expenses.length);
        this.getExpenses();        
    };

    deleteExpense(button) {
        const expense = button.closest('.transaction-row');
        const transactionID = expense.querySelector('.hidden').textContent;
        function findIndex(transactionID) {
            return Object.keys(expenses).find(key => expenses[key].expenseID === transactionID);
        };
        const index = findIndex(transactionID);
        expenses.splice(index, 1);
        expense.remove();
        this.setAttribute('transactions', expenses.length);
    };

    editExpense(button) {
        const expense = button.closest('.transaction-row');
        const editButton = expense.querySelector('.edit-expense');
        const edits = expense.querySelectorAll('.input');

        if (editButton.textContent === 'Edit Expense') {
            edits.forEach(edit => {
                const previousType = edit.getAttribute('type');
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

    getExpenses() {
        const table = this.shadowRoot.querySelector('tbody');
        table.innerHTML = `
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
                
                <td>
                    <label for="cost">$</label>
                    <input type="number" placeholder="Cost" step="0.01" required>
                </td>

                <td><input type="date" required></td>

            </tr>
            ${expenses.map((expense) => {
                return `
                    <tr class="transaction-row">
                        <td>
                        <button class="edit-expense" type="button">Edit Expense</button>
                        <button class="delete-expense" type="button">Delete Expense</button>
                        </td>
                        <td class="input">${expense.user}</td>
                        <td class="input">${expense.category}</td>
                        <td class="input">$${expense.cost}</td>
                        <td class="input">${expense.date}</td>
                        <td class="hidden">${expense.expenseID}</td>
                    </tr>
                `;
            }).join('')}
        `;
        const editButtons = table.querySelectorAll('.edit-expense');
        const deleteButtons = table.querySelectorAll('.delete-expense');
        editButtons.forEach((button) => {
            button.addEventListener('click', () => this.editExpense(button));
        });
        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => this.deleteExpense(button));
        });
        this.getUsers();
    };

    getUsers() {
        const select = this.shadowRoot.querySelector('.user-select');
        const options = `
            <option value="" disabled selected>Choose User</option>
            ${users.map((user) => {
                const fullName = `${user.name.firstName} ${user.name.lastName}`;
                return `<option value="${fullName}" userID="${user.userID}">${fullName}</option>`;
            }).join('')}    
        `;
        select.innerHTML = options;
    };

    connectedCallback() {
        this.shadowRoot.querySelector('form')
        .addEventListener('submit', () => this.addExpense());
    };

    disconnectedCallback() {
        this.shadowRoot.querySelector('form')
        .removeEventListener();
    };
};

customElements.define('expenses-table', ExpensesTable);