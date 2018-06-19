export default class FormBase {
    constructor(){
        this.elements = [];
        this.errorMessages = {};
        this.isRunIsValid = false;
    }
    elements = [];
    errorMessages = {};
    isRunIsValid = false;
    addElement = (name, option = {}) => {
        let element = {
            name: name,
            isRequired: false,
            value: null,
            ...option
        }
        if(this.elements.findIndex(ele => ele.name == name) == -1){
            this.elements.push(element);
        }
        return this;
    }

    filter = () => {
        this.elements = this.elements.map((ele, index) => {
            if(ele.value === undefined || ele.value === null){
                return ele;
            }
            if(ele.filters){
                let value = ele.value;
                ele.filters.forEach((filter) => {
                    if(filter == 'Digits'){
                        value = parseInt(value)
                    }
                    if(filter == 'StringTrim'){
                        value = value.toString().trim();
                    }
                    if(filter == 'Boolean'){
                        if('0' === value){
                            value = false;
                        } else {
                            value = value ? true : false;
                        }
                    }
                });
                ele.value = value;
            }
            return ele;           
        })
    }

    isValid = () => {
        this.filter();
        this.isRunIsValid = true;
        let invalidElements = this.elements.filter((ele) => {
            if(ele.isRequired){
                if(ele.value == null || ele.value == ''){
                    return true;
                }
                // trường hợp số 0 hoặc false vẫn sẽ được pass qua
            }
            return false;
        });
        if(invalidElements.length){
            invalidElements.forEach((ele) => {
                this.errorMessages[ele.name] = [`"${ele.name}" is required`];
            });
            return false;
        }
        return true;
    }

    setValues = (values) => {
        if(!values){
            return false;
        }
        this.elements.forEach(ele => {
            if(values[ele.name] !== undefined){
                ele.value = values[ele.name];
            } else {
                ele.value =  null;
            }
        });
        return this;
    }

    getValues = () : Object => {
        let result = {};
        if(!this.isRunIsValid){
            this.filter();
        }
        this.elements.forEach(ele => {
            result[ele.name] = ele.value;
        })
        return result;
    }

    getValidValues = () => {
        if(!this.isRunIsValid){
            throw new Error('function "getValidValues" must be run after "isValid"');            
        }
        let result = {};
        this.elements.forEach(ele => {
            if(ele.value !== null && ele.value !== undefined ){
                result[ele.name] = ele.value;
            }
            
        })
        return result;
    }

    getErrorMessages = () => {
        return this.errorMessages;
    }

    getErrorMessagesList = () : Array<String> => {
        let result = [];
        if(this.errorMessages){
            for(let key in this.errorMessages){
                this.errorMessages[key].forEach(message => {
                    result.push(message);
                })
            }
        }
        return result;
    }
}