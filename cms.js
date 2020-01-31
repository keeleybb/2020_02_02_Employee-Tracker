const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "employee_DB"
});

//Query variables
// const viewAll = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(m.first_name, ' ', m.last_name) 'Manager' FROM employee INNER JOIN role ON (employee.role_id=role.id) INNER JOIN department ON (role.department_id=department.id) INNER JOIN employee m  ON (employee.manager_id = m.id);";


const viewAll =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id," +
    " role.id, employee.manager_id, role.department_id, department.id, department.name, NULL 'Manager' FROM employee" +
    " INNER JOIN role ON (employee.role_id=role.id)" +
    " INNER JOIN department ON (role.department_id=department.id)" +
    " WHERE (employee.manager_id IS NULL)" +
    " UNION" +
    " SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id, role.id," +
    " employee.manager_id, role.department_id, department.id, department.name, CONCAT(m.first_name, ' ', m.last_name) 'Manager' FROM employee" +
    " INNER JOIN role ON (employee.role_id=role.id)" +
    " INNER JOIN department ON (role.department_id=department.id)" +
    " INNER JOIN employee m" +
    " ON (employee.manager_id = m.id)";

//Class Constructor??

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
                updateData();
                break;
            case "EXIT":
                connection.end();
        }
    })
}
//

//View DATA
const viewData = () => {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What data would you like to view?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees By Manager", "Departments", "Roles"]
        }
    ]).then(answer => {
        switch (answer.action) {
            case "View All Employees":
                connection.query("SELECT * FROM allemployees ORDER BY id ASC", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    userMenu();
                })
                break;
            case "View All Employees by Department":
                connection.query("SELECT * FROM allemployees ORDER BY name DESC;", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    userMenu();
                })
                break;
            case "View All Employees By Manager":
                connection.query("SELECT * FROM allemployees ORDER BY Manager ASC;", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    userMenu();
                })
                break;
            case "Departments":
                connection.query("SELECT * FROM department", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    userMenu();
                })
                break;
            case "Roles":
                connection.query("SELECT * FROM role", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    userMenu();
                })
                break;
        }

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
            // newDepartment();
            break;
        case "roles":
            newRole();
            break;
    }
}

const newEmployee = async () => {
    var employeeFinal = [];
    let results = await getItems();
    let items = results.map(result => result.name);
    console.log("Let's get some more info:")
    let data = await inquirer.prompt([
        {
            type: "input",
            name: "first-name",
            message: "First Name?"
        },
        {
            name: "last-name",
            type: "input",
            message: "Last name?"
        },
        {
            name: "departmentName",
            type: "rawlist",
            message: "Department?",
            choices: items

        }])
    employeeFinal.push({ first_name: data.first_name })
    employeeFinal.push({ last_name: data.last_name })
    const department = data.departmentName;
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw (err);
        let filteredDept = res.filter(function (res) {
            return res.name == department;
        })
        let id = filteredDept[0].id;
        employeeFinal.push({ department_id: id });
        console.log(department);
        console.log(id)
            ; connection.query(`SELECT role.title FROM role INNER JOIN department ON (role.department_id = department.id) WHERE department.id= ${id};`, function (err, res) {
                if (err) throw err;
                console.log(res);
                inquirer.prompt(
                    [
                        {
                            name: "roleName",
                            type: "rawlist",
                            message: "Role?",
                            choices: function () {
                                var choicesArray = [];
                                for (role of res) {
                                    choicesArray.push(role.title);
                                }
                                return choicesArray;
                            }
                        }
                    ]
                )
                    .then(answers => {
                        console.log("roleName");
                    })
            })

    })
}


const newDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Name of Department?"
        }
    ]).then(answer => {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: answer.departmentName

            }, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + "Added")
            });
    })
}

//New Role
const newRole = async () => {
    let results = await getItems();
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
                })

        })
    })
}





const updateData = () => {
    console.log("update Data");
}


function getItems() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", function (err, results) {
            if (err) reject(err);
            resolve(results);
            let items = [];
            for (const result of results) {
                items.push(result.name);
            }
            return items;
        });
    })
}



connection.connect(err => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    userMenu();
});

