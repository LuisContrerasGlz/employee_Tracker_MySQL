const inquirer = require("inquirer");
const Option = require("./lib/Option");
const Employee = require("./lib/Employee");
const Department = require("./lib/Department");
const Role = require("./lib/Role");


const path = require("path");
//const fs = require("fs");

var mysql = require("mysql");

var conn=mysql.createConnection({
    host: "localhost",
    database: "employees",
    user: "root",
    password: ""
})

conn.connect(function(error){
    if (error){
        console.log("coneccion con error", error);
        //throw error;
    }else{
        console.log("coneccion existosa");
    }
})

departments=[];
roles=[];
employees =[];


function thisisend(){
    console.log("termine");
}


function all_departaments(){
    console.log("All DEpartments");
    console.log("Name - Id");
    conn.query("select * from departament", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                console.log(result.name,"-",result.id);
            });
        }
    } )
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        }
    ])
    .then(conti => {
        view();
    })
}

function all_roles(){
    console.log("All Roles");
    console.log("Title - Salary  -  Department");
    conn.query("SELECT a.title as title, a.salary as salary, a.department_id, b.name as dept from role a, departament b where b.id=a.department_id"
        , function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                console.log(result.title,"-",result.salary,"-",result.dept);
            });
        }
    } )
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        }
    ])
    .then(conti => {
        view();
    })
}


function all_employees(){
    console.log("All employees");   
    conn.query("select a.first_name as fn, a.last_name as ln, b.title as role, c.name as department, concat(d.first_name,' ',d.last_name) as manager "+
               " from employee a, role b, departament c, employee d where b.id=a.role_id and c.id=b.department_id and d.id=a.manager_id"
        , function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            console.log("First Name - Last Name  -  Role  -  Department  - Manager");
            results.forEach(result => {
                console.log(result.fn,"-",result.ln,"-",result.role,"-",result.department,"-",result.manager);
            });
        }
    } )
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        }
    ])
    .then(conti => {
        view();
    })
}

function employee_for_department(){
    console.log("Employee for department");
    opts=[];
    conn.query("select * from departament", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                //let d = new Department.Department(result.id,result.name);
                let d = result.name
                opts.push(d);
            });
        }
    } )
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        },
        {
            type: "list",
            name: "department", 
            message: "Department ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        conn.query("select a.first_name as fn, a.last_name as ln, b.title as role, c.name as department, concat(d.first_name,' ',d.last_name) as manager"+
                " from employee a, role b, departament c, employee d "+
                " where b.id=a.role_id and c.id=b.department_id and d.id=a.manager_id and c.name='"+opt3.department+"'",
                    function(error, results){
            if (error){
                console.log("error de consulta ", error);
            }else {
                console.log("First Name - Last Name  -  Role  -  Department  - Manager");
                results.forEach(result => {
                    console.log(result.fn,"-",result.ln,"-",result.role,"-",result.department,"-",result.manager);
                });
            }
        } )
        view();
    })    



}

function employee_for_manager(){
    console.log("Employee for department");
    opts=[];
    conn.query("select * from employee where role_id=1", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                //let d = new Department.Department(result.id,result.name);
                let d = result.first_name+" "+result.last_name;
                opts.push(d);
            });
        }
    } )
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        },
        {
            type: "list",
            name: "manager", 
            message: "Manager ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        conn.query("select a.first_name as fn, a.last_name as ln, b.title as role, c.name as department, concat(d.first_name,' ',d.last_name) as manager"+
                   " from employee a, role b, departament c, employee d"+ 
                   " where b.id=a.role_id and c.id=b.department_id and d.id=a.manager_id and concat(d.first_name,' ',d.last_name)='"+opt3.manager+"'"
                   ,function(error, results){
            if (error){
                console.log("error de consulta ", error);
            }else {
                console.log("First Name - Last Name  -  Role  -  Department  - Manager");
                results.forEach(result => {
                    console.log(result.fn,"-",result.ln,"-",result.role,"-",result.department,"-",result.manager);
                });
            }
        } )
        view();
    })    
}

function new_employee(){
    console.log("New Employee");
    opts=[];
    conn.query("select * from role", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                let d = result.title
                opts.push(d);
            });
        }
    } );
    mangs=[];
    let d = {
               id: 0,
               name: "none"
    }
    mangs.push(d);
    conn.query("select * from employee where role_id=1", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                let d = {
                           id: result.id,
                           name: result.first_name+" "+result.last_name
                }
                mangs.push(d);
            });
        }
    } );
    inquirer.prompt([
        {
            type: "input",
            name: "fnEmployee", 
            message: "What is the First Name? "
        },
        {
            type: "input",
            name: "lnEmployee", 
            message: "What is the last Name? "
        },
        {
            type: "list",
            name: "managerEmployee", 
            message: "What is the Maneager? ",
            choices: mangs
        },
        {
            type: "list",
            name: "roleEmployee", 
            message: "Role ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        if (opt3.managerEmployee!="none"){
            //console.log("select id from employee where first_name+' '+last_name='"+opt3.managerEmployee+"'");
            regs = mangs.filter(reg=> reg.name==opt3.managerEmployee);
            console.log(regs[0].id)
            conn.query("insert into employee (first_name,last_name,manager_id,role_id) values ('"+opt3.fnEmployee+"','"+opt3.lnEmployee+"',"+
                       regs[0].id+",(select id from role where title='"+opt3.roleEmployee+"'))",
                        function(error, results2){
                    if (error){
                        console.log("error de consulta 1 ", error);
                    }
            } )
            add();
        }else{
            conn.query("insert into employee (first_name,last_name,manager_id,role_id) values ('"+opt3.fnEmployee+"','"+opt3.lnEmployee+"',1,"+
                        "(select id from role where title='"+opt3.roleEmployee+"'))",
                        function(error, results){
                if (error){
                    console.log("error de consulta 2 ", error);
                }
            } )
            add();
        }

    })
    
}


function new_role(){
    console.log("New Role");
    opts=[];
    conn.query("select * from departament", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                //let d = new Department.Department(result.id,result.name);
                let d = result.name
                opts.push(d);
            });
        }
    } )
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
            type: "list",
            name: "departmentRole", 
            message: "Department ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        conn.query("insert into role (title,salary, department_id) values ('"+opt3.titleRole+"',"
                    +opt3.SalaryRole+",(select id from departament where name='"+opt3.departmentRole+"'))",
                    function(error, results){
            if (error){
                console.log("error de consulta ", error);
                //throw error;
            }
        } )
        add();
    })
}




function new_department(){
    console.log("new department");
    inquirer.prompt([
        {
            type: "input",
            name: "mameDepartment", 
            message: "What is the Department's Name? "
        }
    ])
    .then(opt3 => {
        conn.query("insert into departament (name) values ('"+opt3.mameDepartment+"')", function(error, results){
            if (error){
                console.log("error de consulta ", error);
                //throw error;
            }
    
        } )
        add();
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
            all_departaments();
        }else{
            if (opt2.opt=="Roles"){
                all_roles();
            }else{
                if (opt2.opt=="All Employees"){
                    all_employees();
                }else{
                    if (opt2.opt=="Employees for Department"){
                        employee_for_department();
                    }else{
                        if (opt2.opt=="Employess for Manager"){
                            employee_for_manager();
                        }else{
                            begin();
                        }
                    }
                }
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
