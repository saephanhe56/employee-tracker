const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require("console.table");

// connect to mysql database

const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: 'ucb',
      database: 'employee_db',
    },
        console.log("Connected to the employee database!")
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

const results = await inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'command',
        type: 'list',
        choices: options,
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

// function for displaying the departments
async function displayDepartments() {
    db.query("SELECT * FROM departments", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.log("All Departments:");
        console.table(results);
        handleOptions();
    });
}
// function for displaying the roles
async function displayRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.log("All Roles:");
        console.table(results);
        handleOptions();
    });
}
// function for displaying the Employees
async function displayEmployees() {
    // variable for statements
    const sql = `
    SELECT employees.id AS "Employee ID",
    employees.first_name AS "First Name",
    employees.last_name AS "Last Name",
    roles.title AS "Title",
    departments.name AS "Department",
    roles.salary AS "Salary",
    CONCAT (manager.first_name, " ", manager.last_name, "") AS "Manager"
    FROM employees
    LEFT JOIN roles ON (employees.role_id = roles.id)
    LEFT JOIN departments ON (roles.department_id = departments.id)
    LEFT JOIN employees manager ON employees.manager_id = manager.id;
    `;

    db.query(sql, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log("List of Employees:");
        console.table(results);
        handleOptions();
    });
}
// function for adding a new department
async function addDept() {
    // create variable to prompt inquirer questions for the new department name
    const addDeptQuestions = await inquirer.prompt ([
        {
            type: "input",
            name: "newDept",
            message: "What is the name of the new Department?"
        }
    ]);
    // create sql variable to insert new department into the department table
    const sql = "INSERT INTO departments (name) VALUES (?)";
    // create a params variable 
    const params = addDeptQuestions.newDept;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`Department ${addDeptQuestions.newDept} has been added to the database`);
        console.table(results);
        displayDepartments();
    });
}
// functio to add new roles to the roles table
async function addRole() {
    // create a variable to list all of the departments from the departments table
    const [deptList] = await db.promise().query("SELECT * FROM departments");
    
    let showDept = deptList.map(({ id, department_name }) => ({
        
        name: department_name,
        value: id,
        })
    );
    // create variable for the inquirer questions
    const addRoleQuestion = await inquirer.prompt ([
        {
            type: "input",
            name: "title",
            message: "What is the title of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of this role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "What is the department this role belongs to?",
            choices: showDept
        }
    ]);
    // variable for sql for the insert prepared statement for the roles table
    const sql = "INSERT INTO roles SET ?";
    
    db.query(sql, addRoleQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`${addRoleQuestion.title} has been added to the database`)
        console.table(results);
        displayRoles();
    });
}
// function for adding new employees
async function addEmployee() {
    // create a variable to list all of the roles 
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    
    let showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );
    // create a variable to list all of the employees from the employees table
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    
    let showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );
    // create variable questions for the new employee
    const addEmployeeQuestion = await inquirer.prompt ([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the new Employee?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the new Employee?"
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the role of the new Employee?",
            choices: showRoles
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the manager of this new Employee?",
            choices: showEmp
        }
    ]);

    // variable for sql for the insert prepared statement for the employees table
    const sql = "INSERT INTO employees SET ?";

    db.query(sql, addEmployeeQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`${addEmployeeQuestion.first_name} ${addEmployeeQuestion.last_name} has been added to the database!`);
        console.table(results);
        displayEmployees();
    });

}
// function to update employee's role
async function updateEmployee() {
    // create a variable to list all employees
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
     
    let showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );
    // create a variable to list all roles 
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    
    let showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );
    // prompt questions with inquirer to ask for employee and role updates
    const updateEmpQuestions = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which employee do you want to update?",
            choices: showEmp
        },
        {
            type: "list",
            name: "role_id",
            message: "Which role do you the employee updated to?",
            choices: showRoles
        }
    ]);
    // update prepared statement for employees role
    const sql = "UPDATE employees SET role_id = ? WHERE id = ?";
    const params = [updateEmpQuestions.role_id, updateEmpQuestions.id]

    console.log()
    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(`Employee #${updateEmpQuestions.id}'s role has been updated to role ${updateEmpQuestions.role_id}`);
        console.table(results);
        displayEmployees();
    });
}