import FormBase from '../../../../Base/Form';


export default class AddAccountToTopicForm extends FormBase{
    constructor(){
        super();
        this.addElement('topicId' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('accounts' , {
            isRequired: true,
            filters: ['Array']
        });

        this.addElement('senderAccountId' , {
            isRequired: true,
            filters: ['Digits']
        });
    }

    accounts = [];
    isValid = () => {
        let isValid = super.isValid();
        if(isValid){
            const formValues = this.getValues();
            if(!Array.isArray(formValues['accounts'])){
                isValid = false;
                this.errorMessages['accounts'] = [`"accounts" must be an array`];
                return isValid;
            }

            if(formValues['accounts'].length > 50){
                isValid = false;
                this.errorMessages['accounts'] = [`"accounts" maximum is 50`];
                return isValid;
            }

            for (const row of formValues['accounts']) {
                if(!row['id'] || !row['email']){
                    continue;
                }
                this.accounts.push(row);
            }
        }
        return isValid;
    }

    getValues = () => {
        const values = super.getValues();
        values['accounts'] = this.accounts;
        return values;
    }
}