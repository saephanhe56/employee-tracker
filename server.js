const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require("console.table");

const PORT = process.env.PORT || 3001;

// connect to mysql database

const connection = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: 'ucb',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

async function handleOptions() {
    const options = [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
    ]

    inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'command',
        type: 'list',
        choices: 'options',
    }]);

    if (results.command == 'View All Departments') {
        displayDepartments();
    }   else if (results.command == 'View All Roles') {
        displayRoles();
    } else if (results.command == "View All Employees") {
        displayEmployees();
    } else if (results.command == "Add a Department") {
        addDept();
    } else if (results.command == "Add a Role") {
        addRole();
    } else if (results.command == "Add an Employee") {
        addEmployee();
    } else if (results.command == "Update an Employee's Role") {
        updateEmployee();
    }
}

handleOptions();