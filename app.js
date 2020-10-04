const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const render = require("./lib/htmlRenderer");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

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

            return "Please Enter a Valid Email";
        }
        return true;
    }
}

let empData = [];

function globalQ(title) {
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

const specifQ = {
    manager: {
        type: "input",
        name: "offNum",
        message: "What is the office number?",
        validate: validate.string
    },
    intern: {
        type: "input",
        name: "school",
        message: "What school did they attend?",
        validate: validate.string
    },
    engineer: {
        type: "input",
        name: "github",
        message: "What is their GitHub profile name?",
        validate: validate.string
    }
};

const more = {
    type: 'confirm',
    name: 'more',
    message: 'Would you like to add another employee?'
};

function start() {
    inquirer
        .prompt([{
            type: "confirm",
            name: "start",
            message: "Start by adding information on the team manager.",
        }]).then(function (data) {
            if (!data.start) {
                return false;
            }
            manage()
        });
};


function manage() {

    let fullMan = globalQ('manager')

    fullMan.push(specifQ.manager, more)

    inquirer
        .prompt(fullMan)
        .then(function (data) {
            const man = new Manager(data.name, data.id, data.email, data.offNum);
            empData.push(man);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        });
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

    let fullSub = globalQ('intern')

    fullSub.push(specifQ.intern, more)

    inquirer
        .prompt(fullSub)
        .then(function (data) {
            const sub = new Intern(data.name, data.id, data.email, data.school);

            empData.push(sub);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        });
};

function engin() {

    let v8 = globalQ('engineer')

    v8.push(specifQ.engineer, more)
    inquirer
        .prompt(v8)
        .then(function (data) {
            const audiR8 = new Engineer(data.name, data.id, data.email, data.github);

            empData.push(audiR8);
            if (!data.more) {
                return renderer();
            };
            typeCheck();
        });
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