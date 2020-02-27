var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "tomsawyer",
    database: "budgetr"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user

});
readCatagories();



function readCatagories() {
    console.log("Selecting all catagories...\n");
    connection.query("SELECT * FROM cats", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++)
            console.log("ID: " + res[i].id + " || Name: " + res[i].cat_name + " || Amount: " + res[i].amount +"$");

        start();

    });
}

function start() {
    inquirer
        .prompt({
            name: "initPrompt",
            type: "list",
            message: "Would you like to [ADD] a catagory, or [MOD] money in an existing catagory?",
            choices: ["ADD", "MOD"]
        })
        .then(function (answer) {
            switch (answer.initPrompt) {
                case "ADD":
                    modCat()
                    break;
                case "MOD":
                    updateMoney();
                    break;
                default:
                    help()
            }
        })
}


function updateMoney() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the catagory you'd like to update?",
                name: "cat_id"
            },
            {
                type: "list",
                message: "Would you like to add or remove money?",
                choices: ["ADD", "REMOVE"],
                name: "add_or"
            }

        ]).then(answer => {
            var id = parseInt(answer.cat_id)
            if (answer.add_or === "ADD") {
                addMoney(cat_id);
            } else if (answer.add_or === "REMOVE") {
                removeMoney(cat_id)
            }
        })
}

function modCat() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the catagory you'd like to add?",
                name: "cat_name"
            }
        ]).then(answer => {
            var query = connection.query(
                "INSERT INTO cats SET ?",
                {
                    cat_name: answer.cat_name
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + "catagory added!")
                })
            console.log(query.sql);
            start();
        })

}

function addMoney(cat_id) {
    inquirer
        .prompt([
            {
                type: "input",
                message: "How much would you like to add?",
                name: "add_amount"
            }
        ]).then(answer => {
            var query = "SELECT * FROM cats WHERE id=" + cat_id
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("Updating...")

                var addedAmount = parseInt(answer.add_amount)
                var query = connection.query(
                    "UPDATE cats SET ? WHERE ?",
                    [
                        {
                            amount: res[0].amount + addedAmount
                        },
                        {
                            id: id
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " products updated!\n");
                    }
                );

                // logs the actual query being run
                console.log(query.sql);
            })
        })
}

function removeMoney(cat_id){
    inquirer
        .prompt([
            {
                type: "input",
                message: "How much would you like to remove?",
                name: "remove_amount"
            }
        ]).then(answer => {
            var query = "SELECT * FROM cats WHERE id=" + cat_id
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("Updating...")

                var removedAmount = parseInt(answer.remove_amount)
                var query = connection.query(
                    "UPDATE cats SET ? WHERE ?",
                    [
                        {
                            amount: res[0].amount - removedAmount
                        },
                        {
                            id: id
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " products updated!\n");
                    }
                );

                // logs the actual query being run
                console.log(query.sql);
            })
        })
}