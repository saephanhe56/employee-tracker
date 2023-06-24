const inquirer = require('inquirer');
const mysql = require('mysql2');

//TODO connect to mysql database

async function displayDepartments() {
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
    }])
    if (results.command == 'View All Departments') {
        displayDepartments();
        handleOptions();
    }   else if (results.command == 'View All Roles') {

    }
}

handleOptions();