import { expenses } from '../data/expenses.js';
import { users } from '../data/users.js';

const usersTable = document.createElement('template');
usersTable.innerHTML = `
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
            background-color: #27E8BE;
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

        <caption><h2>Users</h2></caption>

        <thead>
            <tr>

                <th>Action:</th>
                <th>First Name:</th>
                <th>Last Name:</th>
                <th>Total Expenses:</th>
                <th class="hidden">User ID:</th>

            </tr>
        </thead>

        <tbody>
            <tr>

                <td><button type="submit">Add User</button></td>
                <td><input type="text" placeholder="First Name" required></td>
                <td><input type="text" placeholder="Last Name" required></td>
                <td>$0</td>
                <td class="hidden"></td>

            </tr>
        <tbody>
    </table>
    </form>
`;

class UsersTable extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(usersTable.content.cloneNode(true));
    };

    addUser() {

        class User {
            constructor(fullName) {
                this.firstName = fullName[0].value;
                this.lastName = fullName[1].value;
            }; 
        };

        const fullName = (this.shadowRoot.querySelector('table').querySelectorAll('input'));
        const user = new User(fullName);
        const newUser = { 'name': user, 'userID': getID(16), 'expenses': Number(0) };

        function getID(length) {

            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                result += characters.charAt(
                Math.floor(Math.random() * charactersLength));
            };

            for (let i = 0; i < users.length; i++) {
                if (result === users[i].userID) {
                    getID(length);
                };
            };
            return result;
        };

        // Detects identical users:
        users.forEach((user) => {
            const username = `${user.name.firstName} ${user.name.lastName}`;
            if (`${fullName[0].value} ${fullName[1].value}` === username) {
                if (!confirm('Matching user found, add user anyway?')) return;
            };
        });

        users.push(newUser);
        this.setAttribute('users', users.length);
        this.getUsers();
    };

    deleteUser(button) {
        const user = button.closest('.user-row');
        const userID = user.querySelector('.hidden').textContent;
        user.remove();

        function findIndex(userID) {
            return Object.keys(users).find(key => users[key].userID === userID);
        };

        const index = findIndex(userID);
        users.splice(index, 1);
        this.setAttribute('users', users.length);
        this.getUsers();
    };

    editUser(button) {
        const user = button.closest('.user-row');
        const editButton = user.querySelector('.edit-user');
        const edits = user.querySelectorAll('.input');

        
        if (editButton.textContent === 'Edit User') {
            edits.forEach(edit => {
                const previousValue = edit.textContent;
                edit.innerHTML = `<input type="text" value=${previousValue}>`;
            });

            editButton.textContent = 'Save Edit';
            
        } else if (editButton.textContent === 'Save Edit') {
            const userID = user.querySelector('.hidden').textContent;
            const input = users.find(user => userID);
            input.name.firstName = edits[0].querySelector('input').value;
            input.name.lastName = edits[1].querySelector('input').value;

            const edit = expenses.find(expense => userID);
            if (edit) edit.user = `${input.name.firstName} ${input.name.lastName}`;

            edits.forEach(edit => {
                const input = edit.querySelector('input');
                const newValue = input.value;
                edit.innerHTML = newValue;
            });

            editButton.textContent = 'Edit User';
            this.setAttribute('users', users.length);
        };
    };
    
    getUsers() {
        const table = this.shadowRoot.querySelector('tbody');
        table.innerHTML = `
            <tr class="input-row">
                <td><button type="submit">Add User</button></td>
                <td><input type="text" placeholder="First Name" required></td>
                <td><input type="text" placeholder="Last Name" required></td>
                <td>$0</td>
            </tr>
            ${users.map(user => {
                return `
                    <tr class="user-row">
                        <td>
                            <button class="edit-user" type="button">Edit User</button>
                            <button class="delete-user" type="button">Delete User</button>
                        </td>
                        <td class="first-name input">${user.name.firstName}</td>
                        <td class="last-name input">${user.name.lastName}</td>
                        <td>$${user.expenses}</td>
                        <td class="hidden">${user.userID}</td>
                    </tr>
                `;
            }).join('')}
            `;
        const editButtons = table.querySelectorAll('.edit-user');
        const deleteButtons = table.querySelectorAll('.delete-user');
        editButtons.forEach(button => {
            button.addEventListener('click', () => this.editUser(button));
        });
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => this.deleteUser(button));
        });
    };

    connectedCallback() {
        this.shadowRoot.querySelector('form')
        .addEventListener('submit', () => this.addUser());
    };

    disconnectedCallback() {
        this.shadowRoot.querySelector('form')
        .removeEventListener();
    };
};

customElements.define('users-table', UsersTable);