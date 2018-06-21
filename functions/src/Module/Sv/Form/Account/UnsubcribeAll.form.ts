import FormBase from '../../../../Base/Form';

export default class UnsubcribeAllForm extends FormBase{
    constructor(){
        super();
        this.addElement('accountIdentifier' , {
            isRequired: true,
            filters: ['Digits']
        });       
    }
}