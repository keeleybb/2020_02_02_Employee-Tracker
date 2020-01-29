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
const viewAll = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id, role.id, employee.manager_id, role.department_id, department.id, department.name FROM employee INNER JOIN role ON (employee.role_id=role.id) INNER JOIN department ON (role.department_id=department.id);";



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
            console.log("department");
            // newDepartment();
            userMenu();
            break;
        case "roles":
            console.log("roles");
            // newRoles();
            userMenu();
            break;
    }
}

const newEmployee = async () => {
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
            name: "department",
            type: "rawlist",
            message: "Department",
            choices: items

        },
        {
            name: "title",
            type: "rawlist",
            message: "Employee Role",
            choices: items
        }
    ])


}

//View DATA
const viewData = () => {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What data would you like to view?",
            choices: ["All Data", "Employees", "Departments", "Roles"]
        }
    ]).then(answer => {
        switch (answer.action) {
            case "All Data":
                connection.query(viewAll, function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    userMenu();
                })
                break;
            case "Employees":
                connection.query("SELECT * FROM employee;", function (err, res) {
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

const updateData = () => {
    console.log("update Data");
}





// var query = connection.query(
//     'INSERT INTO auctions SET ?',
//     {
//         item_name: answer.item_name,
//         category: answer.category

//     }, function (err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " Thank you, product inserted!\n")
//     });



// var query = connection.query("SELECT * FROM department", function (err, results) {
//             if (err) reject(err);
//             resolve(results);
//             let items = [];
//             for (const result of results) {
//                 items.push(result.name);
//             }
//             return items;
//         });



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
