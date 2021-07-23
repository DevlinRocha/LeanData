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
            }; 
        };

        const fullName = (this.shadowRoot.querySelector('table').querySelectorAll('input'));
        const user = new User(fullName);

        const table = this.shadowRoot.querySelector('table');
        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.innerHTML = `
        <button id="edit-user" type="button">Edit User</button>
        <button id="delete-user" type="button">Delete User</button>
        `;
        cell2.innerHTML = user.firstName;
        cell3.innerHTML = user.lastName;
        cell4.innerHTML = '$$$';

        cell1.querySelector('#delete-user').addEventListener('click', () => this.deleteUser(row))
        cell1.querySelector('#edit-user').addEventListener('click', () => this.editUser(row))
    };

    deleteUser(user) {
        user.remove();
    };

    editUser() {
        console.log('Edit user');
    };

    connectedCallback() {
        this.shadowRoot.querySelector('form')
        .addEventListener('submit', () => this.addUser());
    };
};

customElements.define('users-table', UsersTable);