INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("IT");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("junior developer", 65000.00, (SELECT id FROM department WHERE name='IT'));

INSERT INTO role (title, salary, department_id) 
VALUES ("marketing specialist", 45000.00, (SELECT id FROM department WHERE name='Marketing'));

INSERT INTO role (title, salary, department_id)
VALUES ("marketing manager", 70000.00, (SELECT id FROM department WHERE name='Marketing'));

INSERT INTO role (title, salary, department_id)
VALUES ("sales manager", 100000.00, (SELECT id FROM department WHERE name='Sales'));

INSERT INTO role (title, salary, department_id)
VALUES ("sales specialist", 60000.00, (SELECT id FROM department WHERE name='Sales'));


INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES("Jessica", "Porter", (SELECT id FROM role WHERE title="junior developer"), (SELECT department_id FROM role WHERE title="junior developer"));

INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES("Molly", "Green", (SELECT id FROM role WHERE title="marketing specialist"), (SELECT department_id FROM role WHERE title="marketing specialist"));

INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES("Sarah", "Bartlet", (SELECT id FROM role WHERE title="sales manager"), (SELECT department_id FROM role WHERE title="sales manager"));

INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES("John", "Sampson", (SELECT id FROM role WHERE title="marketing manager"), (SELECT department_id FROM role WHERE title="marketing manager"));

UPDATE employee SET manager_id=(SELECT * FROM(SELECT id FROM employee WHERE first_name="John" AND last_name="Sampson")tblTmp) WHERE id=2;
