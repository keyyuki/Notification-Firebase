import FormBase from '../../../../Base/Form';

export default class TopicGet extends FormBase{
    constructor(){
        super();
        this.addElement('id' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('organizationIdentifier' , {
            isRequired: true,
            filters: ['Digits']
        });
    }
}