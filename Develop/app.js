const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/Engineer.js");
const Intern = require("./lib/Intern.js");
const Manager = require("./lib/Manager.js");

const listEmployee = [];

const managerQues = [{
    type: "input",
    name: "name",
    message: "Enter manager's name: ",
    validate: async(input) => {
        if (input == "") {
            return "Invalid, Please enter manager's first name and last name";
        }
        return true;
    }
},
{
    type: "input",
    name: "email",
    message: "Enter manager's email:",
    validate: async(input) => {
        if (/^.+@.+\..+$/gi.test(input)) {
            return true;
        }
        return "Invalid, Please enter a valid email.";
    }
},
{
    type: "input",
    name: "id",
    message: "Enter ID:",
    validate: async(input) => {
        if(input == "") {
            return "Invalid, Please enter a valid ID"
        }
        return true;
    }
}, 
{
    type: "input",
    name: "officeNum",
    message: "Enter office number:",
    validate: async(input) => {
        if(input == "") {
            return "Invalid, Please enter a valid office number"
        }
        return true;
    }
},
{
    type: "list",
    name: "teamParty",
    message: "Any other team members?",
    choices: ["Yes", "No"]
}];


function employeeQues() {
    inquirer.prompt([{
        type: "input",
    name: "name",
    message: "Enter employee's name:",
    validate: async (input) => {
        if (input == "" ) {
            return "Invalid, Please enter a name";
        }
        return true;
    }
},
{
    type: "input",
    name: "id",
    message: "Enter ID:",
    validate: async(input) => {
        if(input == "") {
            return "Invalid, Please enter a valid ID"
        }
        return true;
    }
},
{
    type: "input",
    name: "email",
    message: "Enter Email:",
    validate: async(input) => {
        if (/^.+@.+\..+$/gi.test(input)) {
            return true;
        }
        return "Invalid, Please enter a valid email.";
    }
},
{
    type: "list",
    name: "role",
    messages: "Employee's Role?",
    choices: ["Engineer", "Intern"]
}])  
.then(function({name, id, email, role}) {
        let roleOut = "";
        if(role === "Engineer") {
            roleOut = "Github username";
        }
        else if (role === "Intern") {
            roleOut = "school name"
        }
        inquirer.prompt([{
                name: "roleOut",
                message: `Enter employee's ${roleOut}`
            
            },
            {
                type: "list",
                name: "addMembers",
                message: "Have any other team members?",
                choices: ["Yes", "No"]
            }])
        .then(function({roleOut, addMembers}) {
            let newMember;
            if(role === "Engineer") {
                newMember = new Engineer(name, id, email, roleOut);
            }
            else if(role === "Intern") {
                newMember = new Intern(name, id, email, roleOut);
            }
            listEmployee.push(newMember);
            if(addMembers === "Yes") {
                employeeQues();
            }
            else {
                htmlCreate();
            }
        });
    });
}

function htmlCreate() {
    let createFile = fs.readFileSync("./templates/main.html");
    fs.writeFileSync("./output/team.html", createFile, function (err) {
        if (err)
            throw err;
    });

    for(var employee of listEmployee) {
        if(employee.getRole() == "Manager") {
            htmlCardCreate("Manager", employee.getName(), employee.getId(), employee.getEmail(), "Office Num: " + employee.getOfficeNumber());
        }
        else if(employee.getRole() == "Engineer") {
            htmlCardCreate("Engineer", employee.getName(), employee.getId(), employee.getEmail(), "Github: " + employee.getGithub());
        }
        else if(employee.getRole() == "Intern") {
            htmlCardCreate("Intern", employee.getName(), employee.getId(), employee.getEmail(), "School: " + employee.getSchool());
        }
    }
    fs.appendFileSync("./output/team.html",
        `       </div>
            </div>
        </body>
        </html>`,
        function (err) {
            if (err) 
                throw err;
        }

    );
    
}

function htmlCardCreate(type, name, id, email, property) {
    let file = fs.readFileSync(`./templates/${type}.html`, "utf8");
    file = file.replace("Name", name);
    file = file.replace("Id", `ID: ${id}`);
    file = file.replace("Email", `Email: <a href= "mailto:${email}">${email}</a>`);
    file = file.replace("Property", property);
    fs.appendFileSync("./output/team.html", file, (err) => {
        if (err) throw err;
    });

}   

function startUp() {
    inquirer.prompt(managerQues).then((managerInfo) => {
        let managerTeam = new Manager(managerInfo.name, managerInfo.id, managerInfo.email, managerInfo.officeNum);
        listEmployee.push(managerTeam);
        if(managerInfo.teamParty === "Yes") {
            employeeQues();
        }
        else{
            htmlCreate();
        }
    });
}

startUp();
