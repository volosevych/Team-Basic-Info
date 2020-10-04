const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// valid info check 
const validate = {
    string: (inp) => {
        if (inp == "") {
            return "Please Enter Valid Information";
        }
        return true;
    },

    email: (inp) => {
        let format = inp.match(/\S+@\S+\.\S+/g);
        if (!format) {
            return "Please Enter a Valid Email"
        }
        return true;
    }
};

function teamBasicInfo(title) {
    return [{
            type: "input",
            name: "name",
            message: `What is the name of the ${title}?`,
            validate: validate.string
        },
        {
            type: "input",
            name: "id",
            message: `What is the ${title}'s id?`,
            validate: validate.string
        },
        {
            type: "input",
            name: "email",
            message: `What is the ${title}'s email?`,
            validate: validate.email
        }
    ];
};

const teamSpecifInfo = {
    manager: {
        type: "input",
        name: "officeNumber",
        message: "What is the office number?",
        validate: validate.string
    },
    intern: {
        type: "input",
        name: "school",
        message: "What school did they attend?",
        validate: validate.string
    },
    ingineer: {
        type: "input",
        name: "github",
        message: "What is your GitHub profile name?",
        validate: validate.string
    }
};

// Adding more Employeers
const newEmployeer = {
    type: "confirm",
    name: "more",
    message: "Would you like to add another employee?"
};

function start() {
    inquirer
        .prompt([{
            type: "confirm",
            name: "start",
            message: "Start by adding information on the team manager",
        }]).then(function (data) {
            if (!data.start) {
                return false;
            }
            manage()
        });
};

function manage() {
    let mangr = teamBasicInfo("manager")

    mangr.push(teamSpecifInfo.manager, more)

    inquirer
        .prompt(mangr)
        .then(function (data) {
            const man = new Manager(data.name, data.id, data.email, data.officeNumber)

            empData.push(man);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        })
};

function typeCheck() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'type',
            message: "What type of employee would you like to add?",
            choices: ['Intern', 'Engineer']
        }]).then(data => {
            if (data.type == 'Intern') {
                subHuman();
            } else if (data.type == 'Engineer') {
                engin();
            };
        });
};

function subHuman() {
    let mangr = teamBasicInfo("intern")

    mangr.push(teamSpecifInfo.intern, more)

    inquirer
        .prompt(mangr)
        .then(function (data) {
            const sub = new Intern(data.name, data.id, data.email, data.school);
            empData.push(sub);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        })
};

function engin() {
    let v8 = teamBasicInfo("engineer")

    v8.push(teamSpecifInfo.engineer, more)

    inquirer
        .prompt(v8)
        .then(function (data) {
            const colleague = new Engineer(data.name, data.id, data.email, data.guthub);

            empData.push(colleague);
            if (!data.more) {
                return renderer();
            };
        })
};

function renderer() {

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    };
    
    fs.writeFile(outputPath, render(empData), err => {
        if (err) {
            throw err;
        };
        console.log("Your file has been created!");
    });
};

start();