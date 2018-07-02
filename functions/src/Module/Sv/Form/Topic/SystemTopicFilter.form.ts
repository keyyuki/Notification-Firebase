import FormBase from '../../../../Base/Form';

export default class SystemTopicFilter extends FormBase{
    constructor(){
        super();
        
        this.addElement('status' , {
            isRequired: false,
            filters: ['String']
        });
        this.addElement('sendMode' , {
            isRequired: false,
            filters: ['Digits']
        });
     
    }
}