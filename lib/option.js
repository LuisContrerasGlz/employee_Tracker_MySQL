class Option {
    constructor(key,value){
        this.key=key;
        this.value=value;
    }

    getKey(){
        return this.key;
    }
    getValue(){
        return this.value;
    }

}

module.exports.Option=Option;