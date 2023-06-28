INSERT INTO departments (name)
VALUES ("sales"),
       ("marketing"),
       ("human resources"),
       ("accounting");

SELECT * FROM DEPARTMENTS;

INSERT INTO roles (title, salary, department_id)
VALUES  ("sales manager", 100000, 1),
        ("marketing manager", 90000, 2),
        ("human resources manager", 150000, 3),
        ("accountant", 70000, 4),
        ("accounting manager", 120000, 4);
    

SELECT * FROM ROLES;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Stephen", "Curry", 1, 1),
        ("Klay", "Thompson", 2, 2 ),
        ("Andrew", "Wiggins", 3, 3 ),
        ("Draymond", "Green", 4, NULL),
        ("Kevon", "Looney", 4, 4);

SELECT * FROM employees;