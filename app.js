const inquirer = require("inquirer");

const path = require("path");


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


function thisisend(){
    console.log("termine");
}

function remove_emp(emp_id){
    conn.query("delete from employee where id="+emp_id, function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            console.log("Record removed");
            remove();
        }
    } );


}


function rem_employee(){
    console.log("Remove Employee");
    opts=[];
    conn.query("select id,first_name,last_name from employee", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                //let d = new Department.Department(result.id,result.name);
                let d = {
                    name: result.first_name+' '+result.last_name,
                    id: result.id
                }
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
            name: "employee", 
            message: "Employee ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        //console.log(opts);
        regs = opts.filter(reg=> reg.name==opt3.employee);
        conn.query("select count(*) as nr from employee where manager_id="+regs[0].id, function(error, results, fields){
            if (error){
                console.log("error de consulta ", error);
            }else{
                let nd = results[0].nr;
                if (nd>0){
                    console.log("It cannot be removed, it has dependents");
                    rem_employee();
                }else{
                    remove_emp(regs[0].id);
                    //console.log("ok");
                }
            }
        } );
    })

}


function remove_rol(role_id){
    conn.query("delete from role where id="+role_id, function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            console.log("Record removed");
            remove();
        }
    } );


}

function rem_role(){
    console.log("Remove Role");
    opts=[];
    conn.query("select id,title from role", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                //let d = new Department.Department(result.id,result.name);
                let d = {
                    name: result.title,
                    id: result.id
                }
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
            name: "titles", 
            message: "Role ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        //console.log(opts);
        regs = opts.filter(reg=> reg.name==opt3.titles);
        conn.query("select count(*) as nr from employee where role_id="+regs[0].id, function(error, results, fields){
            if (error){
                console.log("error de consulta ", error);
            }else{
                let nd = results[0].nr;
                if (nd>0){
                    console.log("It cannot be removed, it has dependents");
                    rem_role();
                }else{
                    remove_rol(regs[0].id);
                    //console.log("ok");
                }
            }
        } );
    })



}

function remove_dep(dep_id){
    conn.query("delete from department where id="+dep_id, function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            console.log("Record removed");
            remove();
        }
    } );


}

function rem_department(){
    console.log("Remove Department");
    opts=[];
    conn.query("select * from department", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                //let d = new Department.Department(result.id,result.name);
                let d = {
                    name: result.name,
                    id: result.id
                }
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
            name: "departments", 
            message: "Department ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        regs = opts.filter(reg=> reg.name==opt3.departments);
        conn.query("select count(*) as nr from role where department_id="+regs[0].id, function(error, results, fields){
            if (error){
                console.log("error de consulta ", error);
            }else{
                let nd = results[0].nr;
                if (nd>0){
                    console.log("It cannot be removed, it has dependents");
                    rem_department();
                }else{
                    remove_dep(regs[0].id);
                    //console.log("ok");
                }
            }
        } );
    })
}

function update_emp(emp){
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
            message: "What is the First Name? ",
            default: emp.fn
        },
        {
            type: "input",
            name: "lnEmployee", 
            message: "What is the last Name? ",
            default: emp.ln
        },
        {
            type: "list",
            name: "managerEmployee", 
            message: "What is the Maneager? ",
            choices: mangs,
            default: emp.manager
        },
        {
            type: "list",
            name: "roleEmployee", 
            message: "Role ",
            choices: opts,
            default: emp.role
        } 
    ])
    .then(opt3 => {
        regs = mangs.filter(reg=> reg.name==opt3.managerEmployee);

        conn.query("update employee set first_name='"+opt3.fnEmployee+"',last_name='"+opt3.lnEmployee+"',manager_id="+regs[0].id+
                   ",role_id=(select id from role where title='"+opt3.roleEmployee+"') where id="+emp.id,function(error, results2){
                if (error){
                    console.log("error de consulta 1 ", error);
                }
        } )
        upd();
    })

}

function upd_employee(){
    console.log("--------------- Update employee");
    opts=[];
    conn.query("select * from employee", function(error, results, fields){
        if (error){
            console.log("error de consulta ", error);
        }else{
            results.forEach(result => {
                let d = result.first_name+" "+result.last_name
                opts.push(d);
            });
        }
    } );
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        },
        {
            type: "list",
            name: "employee", 
            message: "Employees",
            choices: opts
        } 
    ])
    .then(opt3 => {
        //console.log("select a.id,a.first_name as fn, a.last_name as ln, a.role_id as role_id, b.title as role, b.department_id as dep_id,"+
        //        "c.name as department, concat(d.first_name,' ',d.last_name) as manager from employee a, role b, department c, employee d"+
        //        " where b.id=a.role_id and c.id=b.department_id and d.id=a.manager_id and concat(a.first_name,' ',a.last_name)='"+opt3.employee+"'");
        conn.query("select a.id,a.first_name as fn, a.last_name as ln, a.role_id as role_id, b.title as role, b.department_id as dep_id, c.name as department"+
        ", concat(d.first_name,' ',d.last_name) as manager "+
        " from employee a, role b, department c, employee d"+
        " where b.id=a.role_id and c.id=b.department_id and d.id=a.manager_id and concat(a.first_name,' ',a.last_name)='"+opt3.employee+"'",
        function(error, results, fields){
            if (error){
                console.log("error de consulta ", error);
            }else{
                let e=results[0];
                update_emp(e);
            }
        } )
    })
}

function update_role(role){
    //console.log("+++++++++++++",role);
    opts=[];
    conn.query("select * from department", function(error, results, fields){
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
            message: "What is the Role's Title? ",
            default: role.title
        },
        {
            type: "input",
            name: "SalaryRole", 
            message: "What is the Role's Salary? ",
            default: role.salary
        },
        {
            type: "list",
            name: "departmentRole", 
            message: "Department ",
            choices: opts,
            default: role.dept
        }
    ])
    .then(opt3 => {
        conn.query("update role set title='"+opt3.titleRole+"',salary="+opt3.SalaryRole+
                   ", department_id="+"(select id from department where name='"+opt3.departmentRole+"')"+
                   " where id="+role.id,function(error, results){
            if (error){
                console.log("error de consulta ", error);
            }
        } )
        upd();
    })

}

function upd_role(){
    console.log("Update Role");
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
    inquirer.prompt([
        {
            type: "input",
            name: "cont", 
            message: "<enter> to Continue "
        },
        {
            type: "list",
            name: "role", 
            message: "Roles",
            choices: opts
        } 
    ])
    .then(opt3 => {
        conn.query("SELECT a.id as id, a.title as title, a.salary as salary, a.department_id as department_id, b.name as dept "+
                   "from role a, department b where b.id=a.department_id and a.title='"+opt3.role+"'"
            , function(error, results, fields){
            if (error){
                console.log("error de consulta ", error);
            }else{
                console.log("SELECT a.id as id, a.title as title, a.salary as salary, a.department_id as department_id, b.name as dept "+
                "from role a, department b where b.id=a.department_id and a.title='"+opt3.role+"'");
                let d=results[0];
                update_role(d);
            }
        } )
    })



}

function update_dept(dep){
    inquirer.prompt([
        {
            type: "input",
            name: "newName", 
            message: "New Name? ",
            default: dep
        }
    ])
    .then(opt3 => {
        conn.query("update department set name='"+opt3.newName+"' where name ='"+dep+"'", function(error, results){
            if (error){
                console.log("error de consulta ", error);
            }
    
        } )
        //console.log(opt3.newName);
        upd();
    })


}

function upd_department(){
    console.log("Update Department");
    opts=[];
    conn.query("select * from department", function(error, results, fields){
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
            name: "departments", 
            message: "Department ",
            choices: opts
        } 
    ])
    .then(opt3 => {
        update_dept(opt3.departments);
    })
}

function all_departments(){
    console.log("All DEpartments");
    console.log("Name - Id");
    conn.query("select * from department", function(error, results, fields){
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
    conn.query("SELECT a.title as title, a.salary as salary, a.department_id, b.name as dept from role a, department b where b.id=a.department_id"
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
               " from employee a, role b, department c, employee d where b.id=a.role_id and c.id=b.department_id and d.id=a.manager_id"
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
    conn.query("select * from department", function(error, results, fields){
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
                " from employee a, role b, department c, employee d "+
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
                   " from employee a, role b, department c, employee d"+ 
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
    conn.query("select * from department", function(error, results, fields){
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
                    +opt3.SalaryRole+",(select id from department where name='"+opt3.departmentRole+"'))",
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
        conn.query("insert into department (name) values ('"+opt3.mameDepartment+"')", function(error, results){
            if (error){
                console.log("error de consulta ", error);
                //throw error;
            }
    
        } )
        add();
    })
}

function remove(){
    inquirer.prompt([
        {
            type: "list",
            name: "opt", 
            message: "What do want to Remove? ",
            choices: ["Department",
                      "Role",
                      "Employee",
                      "Exit"
                    ]
        }
    ])
    .then(opt2 => {
        if (opt2.opt=="Department"){
            rem_department();
        }else{
            if (opt2.opt=="Role"){
                rem_role();
            }else{
                if (opt2.opt=="Employee"){
                    rem_employee();
                }else{    
                    begin();
                }
            }
        
        }
    })
}

function upd(){
    console.log("Update")
    inquirer.prompt([
        {
            type: "list",
            name: "opt", 
            message: "What do want to update? ",
            choices: ["Department",
                      "Role",
                      "Employee",
                      "Exit"
                    ]
        }
    ])
    .then(opt2 => {
        if (opt2.opt=="Department"){
            upd_department();
        }else{
            if (opt2.opt=="Role"){
                upd_role();
            }else{
                if (opt2.opt=="Employee"){
                    upd_employee();
                }else{    
                    begin();
                }
            }
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
    console.log("Main");
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
                    upd();
                }else{
                    if (opt1.opt=="Remove"){
                        remove();
                    }else{
                        thisisend();
                    }
                }
            }
        }
    })
}

begin();
