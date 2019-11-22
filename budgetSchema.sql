DROP DATABASE IF EXISTS budgetr;
CREATE DATABASE budgetr;

USE budgetr;

CREATE TABLE cats(
    id INT NOT NULL AUTO_INCREMENT,
    cat_name VARCHAR(100),
    amount  INT default 0,
    PRIMARY KEY (id)
);

