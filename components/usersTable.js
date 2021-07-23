import { users } from '../data/users.js';

const usersTable = document.createElement('template');
usersTable.innerHTML = `
    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
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

            </tr>
        </thead>

        <tr>

            <td><button type="submit">Add User</button></td>
            <td><input type="text" placeholder="First Name" required></td>
            <td><input type="text" placeholder="Last Name" required></td>
            <td>$0</td>

        </tr>
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
                this.id = getId();
            }; 
        };

        const fullName = (this.shadowRoot.querySelector('table').querySelectorAll('input'));
        const user = new User(fullName);
        const newUser = { 'name': user };
        users.push(newUser);
        this.setAttribute('users', users.length);

        function getId(length) {

            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                result += characters.charAt(
                Math.floor(Math.random() * charactersLength));
            };

            for (let i = 0; i < users.length; i++) {
                if (result === users[i].id) {
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

        cell1.innerHTML = `
        <button class="edit-user" type="button">Edit User</button>
        <button class="delete-user" type="button">Delete User</button>
        `;
        cell2.innerHTML = user.firstName;
        cell2.classList.add('first-name');
        cell2.classList.add('input');
        cell3.innerHTML = user.lastName;
        cell3.classList.add('last-name');
        cell3.classList.add('input');
        cell4.innerHTML = '';

        cell1.querySelector('.delete-user').addEventListener('click', () => this.deleteUser(row))
        cell1.querySelector('.edit-user').addEventListener('click', () => this.editUser(row))
    };

    deleteUser(user) {
        const index = users.forEach(user => {
            users.indexOf(user);
        });
        users.splice(index, 1);
        user.remove();
        this.setAttribute('users', users.length);
    };

    editUser(row) {
        const editButton = row.querySelector('.edit-user');
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
            editButton.textContent = 'Edit User';
        };
        editButton.textContent = 'Save Edit';
    };

    getExpenses() {
        console.log('New transaction')
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