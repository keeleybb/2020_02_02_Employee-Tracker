const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kb!1023024",
    port: 3306,
    database: "employee_DB"
});

//Class Constructor??

//To Dos:
// Clean up code
//work on understanding view by manager
//update any queries that could be improved. 
//Take shot at class consturctor


const userMenu = () => {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["ADD", "VIEW", "UPDATE", "EXIT"]
        }
    ]).then(answer => {
        switch (answer.action) {
            case "ADD":
                addData();
                break;
            case "VIEW":
                viewData();
                break;
            case "UPDATE":
                updateRole();
                break;
            case "EXIT":
                connection.end();
        }
    })
}
//

//View DATA
const viewData = async () => {
    let answer = await inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What data would you like to view?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees By Manager", "Departments", "Roles"]
        }
    ])
    switch (answer.action) {
        case "View All Employees":
            connection.query("SELECT * FROM allemployees ORDER BY id ASC", function (err, res) {
                if (err) throw err;
                console.table(res);
                userMenu();
            })
            break;
        case "View All Employees by Department":
            viewByDepartment();
            break;
        case "View All Employees By Manager":
            viewByManager();
            break;
        case "Departments":
            let results = await getDepartments();
            console.table(results);
            userMenu();
            break;
        case "Roles":
            let data = await getRoles();
            console.table(data);
            userMenu();
            break;
    }
}

const viewByDepartment = async () => {
    let results = await getDepartments();
    let items = results.map(result => ({
        name: result.name
    }));
    let response = await inquirer.prompt([
        {
            name: "departmentName",
            type: "rawlist",
            message: "What Department?",
            choices: items

        }
    ]);
    connection.query("SELECT * FROM allemployees WHERE name = (?) ORDER BY id ASC", [response.departmentName], function (err, res) {
        if (err) throw err;
        console.table(res);
        userMenu();
    });
}

const viewByManager = async () => {
    let response = await getEmployees();
    let possibleManagers = response.map(person => ({
        name: person.first_name + " " + person.last_name,
        value: person.id
    }));
    let data = await inquirer.prompt([
        {
            name: "managerName",
            type: "rawlist",
            message: "What Manager?",
            choices: possibleManagers

        }
    ]);
    console.log(data.managerName)
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title, allemployees.manager FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id LEFT JOIN allemployees ON (allemployees.id = employee.id) WHERE manager_id = (?)", [data.managerName], function (err, res) {
        if (err) throw err;
        console.table(res);
        userMenu();
    });
}

const addData = async () => {
    let answer = await inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to add?",
            choices: ["employee", "department", "roles"]
        }
    ])

    switch (answer.action) {
        case "employee":
            newEmployee();
            break;
        case "department":
            newDepartment();
            break;
        case "roles":
            newRole();
            break;
    }
}

const newEmployee = async () => {
    let employeeFinal = [];
    let results = await getDepartments();
    let items = results.map(result => ({
        name: result.name,
        value: result.id
    }));
    let response = await getEmployees();
    let possibleManagers = response.map(person => ({
        name: person.first_name + " " + person.last_name,
        value: person.id
    }));
    possibleManagers.push({ name: "null", value: 0 });
    console.log("Let's get some more info:")
    let data = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "First Name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "Last name?"
        },
        {
            name: "managerName",
            type: "rawlist",
            message: "Manager?",
            choices: possibleManagers
        },
        {
            name: "departmentName",
            type: "rawlist",
            message: "Department?",
            choices: items

        }])
    employeeFinal.push({ first_name: data.first_name });
    employeeFinal.push({ last_name: data.last_name });
    if (data.managerName != 0) {
        employeeFinal.push({ manager_id: data.managerName });
    } else {
        employeeFinal.push({ manager_id: undefined });
    }
    employeeFinal.push({ department_id: data.departmentName });
    connection.query("SELECT role.title FROM role INNER JOIN department ON (role.department_id = department.id) WHERE department.id= (?)", [data.departmentName], async function (err, res) {
        if (err) throw err;
        let answers = await inquirer.prompt(
            [
                {
                    name: "roleName",
                    type: "rawlist",
                    message: "Role?",
                    choices: function () {
                        var choicesRoles = [];
                        for (role of res) {
                            choicesRoles.push(role.title);
                        }
                        return choicesRoles;
                    }
                }
            ]
        )

        let data = answers.roleName;
        console.log("where? ", data);
        connection.query(`SELECT * FROM role WHERE role.title="${data}";`, function (err, res) {
            if (err) throw err;
            console.log("What are we getting back ", res[0].id);
            let roleid = res[0].id;
            console.log(roleid)
            employeeFinal.push({ role_id: roleid });
            console.log(employeeFinal);
            let query = "INSERT INTO employee (first_name, last_name, manager_id, department_id, role_id) VALUES(?, ?, ?, ?, ?)";
            let args = [employeeFinal[0].first_name,
            employeeFinal[1].last_name,
            employeeFinal[2].manager_id,
            employeeFinal[3].department_id,
            employeeFinal[4].role_id];
            console.log(args);
            connection.query(query, args, function (err, res) {
                if (err) throw err;
                console.log("Congrats! You've added a new employee");
                userMenu();
            });
        });
    });
}

const newDepartment = async () => {
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Name of Department?"
        }
    ])
    connection.query(
        'INSERT INTO department SET ?',
        {
            name: answer.departmentName

        }, function (err, res) {
            if (err) throw err;
            console.log(`New Department Added: ${answer.departmentName}`);
            userMenu();
        });
}

const newRole = async () => {
    let results = await getDepartments();
    let items = results.map(result => result.name);
    inquirer.prompt([
        {
            name: "departmentName",
            type: "rawlist",
            message: "Department?",
            choices: items

        },
        {
            name: "title",
            type: "input",
            message: "What is the role title?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?"
        }
    ]).then(answer => {
        const department = answer.departmentName;
        connection.query('SELECT * FROM department', function (err, res) {
            if (err) throw (err);
            let filteredDept = res.filter(function (res) {
                return res.name == department;
            })
            let id = filteredDept[0].id;
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.title, parseInt(answer.salary), id],
                function (err, res) {
                    console.log(`You have added this role: ${answer.title}`)
                    userMenu();
                });

        });
    });
}

const updateRole = async () => {
    let response = await getEmployees();
    let employees = response.map(person => ({
        name: person.first_name + " " + person.last_name,
        value: person.id
    }));
    console.log("You can update employee roles: ");
    let updateEmployee = await inquirer.prompt([
        {
            name: "employeeName",
            type: "rawlist",
            message: "Which employee would you like to update?",
            choices: employees
        }
    ])

    let data = await getRoles();
    // let roleChoices = data.map(datapoint => datapoint.title);
    let roleChoices = data.map(role => ({
        name: role.title,
        value: role.id
    }));
    console.log(roleChoices);
    let updateRole = await inquirer.prompt([
        {
            name: "roleName",
            type: "rawlist",
            message: "Role?",
            choices: roleChoices
        }
    ]);
    console.log("Role: ", updateRole.roleName);
    console.log("Employee: ", updateEmployee.employeeName);
    connection.query("UPDATE employee SET role_id = (?) WHERE id = (?)", [updateRole.roleName, updateEmployee.employeeName],
        function (err, res) {
            console.log(`Employee Updated`)
            userMenu();
        });
}

function getDepartments() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", function (err, results) {
            if (err) reject(err);
            resolve(results);
            let departments = [];
            for (const result of results) {
                departments.push(result.name);
            }
            return departments;
        });
    })
}

function getRoles() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role", function (err, results) {
            if (err) reject(err);
            resolve(results);
            let roles = [];
            for (const result of results) {
                roles.push(result.title);
            }
            console.log(roles);
            return roles;
        });
    })
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee", function (err, results) {
            if (err) reject(err);
            resolve(results);
            let employees = [];
            for (const result of results) {
                employees.push(result.title);
            }
            return employees;
        });
    })
}

connection.connect(err => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    userMenu();
});

