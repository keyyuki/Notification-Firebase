import FormBase from '../../../../Base/Form';

export default class TopicFilter extends FormBase{
    constructor(){
        super();
        this.addElement('status' , {
            isRequired: false,
            filters: ['Boolean']
        });
        this.addElement('organizationIdentifier' , {
            isRequired: true,
            filters: ['Digits']
        });
    }
}