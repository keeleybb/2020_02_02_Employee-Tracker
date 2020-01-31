DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
department_id INT,
role_id INT,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NULL,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

-- Full Table With Manager
CREATE VIEW manager AS
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id, role.id, employee.manager_id, role.department_id, department.id, department.name, CONCAT(m.first_name, " ", m.last_name) 'Manager' 
FROM employee
INNER JOIN role ON (employee.role_id=role.id)
INNER JOIN department ON (role.department_id=department.id)
INNER JOIN employee m 
ON (employee.manager_id = m.id);



-- Full Table
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id, role.id, employee.manager_id, role.department_id, department.id, department.name, NULL 'Manager' 
FROM employee
INNER JOIN role ON (employee.role_id=role.id)
INNER JOIN department ON (role.department_id=department.id)
WHERE (employee.manager_id IS NULL)
UNION
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id, role.id, employee.manager_id, role.department_id, department.id, department.name, CONCAT(m.first_name, " ", m.last_name) 'Manager' 
FROM employee
INNER JOIN role ON (employee.role_id=role.id)
INNER JOIN department ON (role.department_id=department.id)
INNER JOIN employee m 
ON (employee.manager_id = m.id);



-- Full Table
SELECT a.id, a.first_name, a.last_name, a.title, a.salary, a.name, value 'Manager' FROM
(SELECT a.id, a.first_name, a.last_name, b.title, b.salary, c.name, NULL 'Manager' 
FROM employee a
INNER JOIN role b ON (a.role_id=b.id)
INNER JOIN department c ON (b.department_id=c.id)
WHERE (a.manager_id IS NULL)
UNION
SELECT a.id, a.first_name, a.last_name, b.title, b.salary, c.name, CONCAT(m.first_name, " ", m.last_name) 'Manager' 
FROM employee a
INNER JOIN role b ON (a.role_id=b.id)
INNER JOIN department c ON (b.department_id=c.id)
INNER JOIN employee m 
ON (a.manager_id = m.id)) AS A ORDER BY a.name;


-- Full VIEW 
CREATE VIEW allemployees AS 
(SELECT a.id, a.first_name, a.last_name, b.title, b.salary, c.name, NULL 'Manager' 
FROM employee a
INNER JOIN role b ON (a.role_id=b.id)
INNER JOIN department c ON (b.department_id=c.id)
WHERE (a.manager_id IS NULL)
UNION
SELECT a.id, a.first_name, a.last_name, b.title, b.salary, c.name, CONCAT(m.first_name, " ", m.last_name) 'Manager' 
FROM employee a
INNER JOIN role b ON (a.role_id=b.id)
INNER JOIN department c ON (b.department_id=c.id)
INNER JOIN employee m 
ON (a.manager_id = m.id));

SELECT * FROM allemployees ORDER BY name DESC;

UPDATE employee SET manager_id=(SELECT * FROM(SELECT id FROM employee WHERE first_name="Sarah" AND last_name="Schmidt")tblTmp) WHERE id=1;