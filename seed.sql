INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("junior developer", 16000.50, (SELECT id FROM department WHERE name='IT')); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Harry", "Potter", (SELECT id FROM role WHERE title="junior developer"));

INSERT INTO role (title, salary, department_id)
VALUES ("email marketing specialist", 10000.50, (SELECT id FROM department WHERE name='Marketing'));

INSERT INTO role (title, salary, department_id)
VALUES ("email marketing manager", 15000.50, (SELECT id FROM department WHERE name='Marketing'));

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Keeley", "Byerly", (SELECT id FROM role WHERE title="email marketing specialist"));

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Sarah", "Schmidt", (SELECT id FROM role WHERE title="email marketing manager"));