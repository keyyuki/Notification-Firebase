import FormBase from '../../../../Base/Form';

export default class AddSystemForm extends FormBase{
    constructor(){
        super();
        this.addElement('id' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('name' , {
            isRequired: true,
            filters: ['String']
        });
       
        this.addElement('sendMode' , {
            isRequired: true,
            filters: ['Digits']
        });

        this.addElement('status' , {
            isRequired: true,
            filters: ['String']
        });
        
        this.addElement('messageTemplate' , {
            isRequired: false,
            filters: ['String']
        });
    }
}