DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NULL,
department_id INT NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);


SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.role_id, role.id, employee.manager_id, role.department_id, department.id, department.name
FROM employee
INNER JOIN role ON (employee.role_id=role.id)
INNER JOIN department ON (role.department_id=department.id);


SELECT id FROM department WHERE department.name="Marketing";

INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("email marketing specialist", 10000.50, (SELECT id FROM department WHERE name='Marketing'));

INSERT INTO role (title, salary, department_id)
VALUES ("email marketing manager", 15000.50, (SELECT id FROM department WHERE name='Marketing'));

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Keeley", "Byerly", (SELECT id FROM role WHERE title="email marketing specialist"));

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Sarah", "Schmidt", (SELECT id FROM role WHERE title="email marketing manager"));

UPDATE employee SET manager_id=(SELECT * FROM(SELECT id FROM employee WHERE first_name="Sarah" AND last_name="Schmidt")tblTmp) WHERE id=1;