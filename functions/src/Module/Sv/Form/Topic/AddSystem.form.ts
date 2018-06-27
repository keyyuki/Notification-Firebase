import FormBase from '../../../../Base/Form';

export default class AddSystemForm extends FormBase{
    constructor(){
        super();
        this.addElement('name' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('code' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('sendMode' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('userList' , {
            isRequired: false,
            filters: ['Array']
        });
        this.addElement('messageTemplate' , {
            isRequired: false,
            filters: ['String']
        });
    }
}