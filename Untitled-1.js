function addRole() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw (err);
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "What is the title of the new role?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?",
            },
            {
                name: "departmentName",
                type: "list",
                // is there a way to make the options here the results of a query that selects all departments?`
                message: "Which department does this role fall under?",
                choices: function () {
                    var choicesArray = [];
                    res.forEach(res => {
                        choicesArray.push(
                            res.name
                        );
                    })
                    return choicesArray;
                }
            }
            ])
            // in order to get the id here, i need a way to grab it from the departments table 
            .then(function (answer) {
                const department = answer.departmentName;
                connection.query('SELECT * FROM DEPARTMENT', function (err, res) {

                    if (err) throw (err);
                    let filteredDept = res.filter(function (res) {
                        return res.name == department;
                    }
                    )
                    let id = filteredDept[0].id;
                    let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                    let values = [answer.title, parseInt(answer.salary), id]
                    console.log(values);
                    connection.query(query, values,
                        function (err, res, fields) {
                            console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                        })
                    viewRoles()
                })
            })
    })
}