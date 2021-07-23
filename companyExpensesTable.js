const companyExpensesTable = document.createElement('template');
companyExpensesTable.innerHTML = `
    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        table {
            width: 100vw;
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
`;

class CompanyExpensesTable extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(companyExpensesTable.content.cloneNode(true));
    };
};

customElements.define('company-expenses-table', CompanyExpensesTable);