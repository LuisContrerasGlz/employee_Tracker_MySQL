// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.
let employee = require("./Employee");
class Manager  extends employee.Employee {
    constructor(name,id,email,officeNumber){
        super();
        this.name=name;
        this.id=id;
        this.email=email;
        this.officeNumber=officeNumber;
    }

    getOfficeNumber(){
        return this.officeNumber;
    }
    getRole(){
        return "Manager";
    }

}

module.exports.Manager=Manager;