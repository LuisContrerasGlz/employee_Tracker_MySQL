const inquirer = require("inquirer");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const path = require("path");
const fs = require("fs");

var mysql = require("mysql");

var conn=mysql.createConnection({
    host: "localhost",
    database: "employees",
    user: "root",
    password: ""
})


//const OUTPUT_DIR = path.resolve(__dirname, "output");
//const outputPath = path.join(OUTPUT_DIR, "team.html");

//const render = require("./lib/htmlRenderer");


departments=[];
roles=[];
employees =[];


function thisisend(){
    console.log("termine");
    //console.log(employees);
    //let t=render(employees);
    //fs.writeFile(outputPath,t,{encoding:'utf8'},function(error){
    //    if(error){
    //        console.log('error: 4{error}');
    //    }else{
    //        console.log('ready');
    //    }
    //});



}


function all_departments(){
    conn.connect(function(error){
        if (error){
            console.log("coneccion con error", error);
            //throw error;
        }else{
            console.log("coneccion existosa");
        }
    })
    conn.query("select * from departament", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
            //throw error;
        }else{
            results.forEach(result => {
                console.log(result);
            });
        }

    } )
    conn.end;
    view();
}


function new_department(){
    console.log("your select is an Engineer");
    inquirer.prompt([
        {
            type: "input",
            name: "mameEngineer", 
            message: "What is the Engineer's Name? "
        },
        {
            type: "input",
            name: "idEngineer", 
            message: "What is the Engineer's ID? "
        },
        {
            type: "input",
            name: "emailEngineer", 
            message: "What is your Engineer' email? "
        },
        {
            type: "input",
            name: "gitEngineer", 
            message: "What is your Engineer's github username? "
        },
        {
            type: "list",
            name: "optMember", 
            message: "Wich type of team member wold you like to add? ",
            choices: ["Engineer","Intern","I don´t want to add any more team members"]
        }
    ])
    .then(engineers => {
        console.log('engineers');
        let e = new Engineer.Engineer(engineers.mameEngineer,engineers.idEngineer, engineers.emailEngineer, engineers.gitEngineer);
        employees.push(e);

        if (engineers.optMember=="Engineer"){
            new_engineer();
        }else{
            if (engineers.optMember=="Intern"){
                new_intern();
            }else{
                thisisend();
            }
        
        }

    })
}


function new_employee(){
    console.log("New Employee");
    inquirer.prompt([
        {
            type: "input",
            name: "fnEemployee", 
            message: "What is the Employee's First Name? "
        },
        {
            type: "input",
            name: "lnEmployee", 
            message: "What is the Employee's Last Name? "
        },
        {
            type: "input",
            name: "roleEmpleyee", 
            message: "What is the Employee's Role? "
        },
        {
            type: "input",
            name: "managerEmpleyee", 
            message: "What is the Employee's Manager? "
        },
        {
            type: "list",
            name: "opt", 
            message: "What do you want to do? ",
            choices: ["Add",
                      "Exit"
                      ]
        }
    ])
    .then(opt3 => {
        //console.log('interns');
        //let e = new Intern.Intern(interns.mameIntern,interns.idIntern, interns.emailIntern, interns.schoolIntern);
        //employees.push(e);
        if (opt3.opt=="Add"){
            new_employee();
        }else{
            add();
        }
    })
}




function new_role(){
    console.log("New Role");
    inquirer.prompt([
        {
            type: "input",
            name: "titleRole", 
            message: "What is the Role's Title? "
        },
        {
            type: "input",
            name: "SalaryRole", 
            message: "What is the Role's Salary? "
        },
        {
            type: "input",
            name: "dapartmentRole", 
            message: "What is the Role's Department? "
        },
        {
            type: "list",
            name: "opt", 
            message: "What do you want to do? ",
            choices: ["Add",
                      "Exit"
                      ]
        }
    ])
    .then(opt3 => {
        //console.log('interns');
        //let e = new Intern.Intern(interns.mameIntern,interns.idIntern, interns.emailIntern, interns.schoolIntern);
        //employees.push(e);
        if (opt3.opt=="Add"){
            new_role();
        }else{
            add();
        }
    })
}




function new_department(){
    console.log("new department");
    inquirer.prompt([
        {
            type: "input",
            name: "mameDepartment", 
            message: "What is the Department's Name? "
        },
        {
            type: "list",
            name: "opt", 
            message: "What do you want to do? ",
            choices: ["Add",
                      "Exit"
                      ]
        }
    ])
    .then(opt3 => {
        conn.connect(function(error){
            if (error){
                console.log("coneccion con error", error);
                //throw error;
            }else{
                console.log("coneccion existosa");
            }
        })
        conn.query("insert into departament (name) values ('"+opt3.mameDepartment+"')", function(error, results){
            if (error){
                console.log("error de consulta ", error);
                //throw error;
            }else{
                console.log("se inserto el registro exitosamente ");
            }
    
        } )
        conn.end;
        if (opt3.opt=="Add"){
            new_department();
        }else{
            add();
        }
    })
}

function add(){
    inquirer.prompt([
        {
            type: "list",
            name: "opt", 
            message: "What do want to add? ",
            choices: ["Department",
                      "Role",
                      "Employee",
                      "Exit"
                    ]
        }
    ])
    .then(opt2 => {
        if (opt2.opt=="Department"){
            new_department();
        }else{
            if (opt2.opt=="Role"){
                new_role();
            }else{
                if (opt2.opt=="Employee"){
                    new_employee();
                }else{    
                    begin();
                }
            }
        
        }
    })
}



function view(){

    inquirer.prompt([
        {
            type: "list",
            name: "opt", 
            message: "What do want to view? ",
            choices: ["Departments",
                      "Roles",
                      "All Employees",
                      "Employees for Department",
                      "Employess for Manager",
                      "Exit"
                    ]
        }
    ])
    .then(opt2 => {
        if (opt2.opt=="Departments"){
            all_departments();
        }else{
            if (opt2.opt=="Roles"){
                view();
            }else{
                begin();
            }
        
        }
    })
}





function begin(){
    
    inquirer.prompt([
        {
            type: "list",
            name: "opt", 
            message: "What would you like to do? ",
            choices: ["View",
                    "Add",
                    "Update",
                    "Remove",
                    "Exit",
                    ]
        }
    ])
    .then(opt1 => {

        console.log('opt1');
        if (opt1.opt=="View"){
            view();
        }else{
            if (opt1.opt=="Add"){
                add();
            }else{
                if (opt1.opt=="Update"){
                    new_intern();
                }else{
                    thisisend();
                }
            }
        }
    })
}

begin();
