// Variables:

const expensesTableComp = document.querySelector('expenses-table');
const usersTableComp = document.querySelector('users-table');
const companyExpensesTableComp = document.querySelector('company-expenses-table');

// Functions:

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        usersTableComp.getUsers();
        expensesTableComp.getExpenses();
        companyExpensesTableComp.getExpenses();
    });
});

observer.observe(usersTableComp, {
    attributes: true,
});

observer.observe(expensesTableComp, {
    attributes: true,
});

observer.observe(companyExpensesTableComp, {
    attributes: true,
});