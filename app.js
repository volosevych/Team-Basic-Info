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
        if(inp == "") {
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

function teamBasicInfo() {
    return [
        {
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

