import FormBase from '../../../Base/Form';

export default class AddTopicForm extends FormBase{
    constructor(){
        super();
        this.addElement('sendMode' , {
            isRequired: false,
            filters: ['Digits']
        });
        this.addElement('organizationIdentifier' , {
            isRequired: true,
            filters: ['Digits']
        });
        this.addElement('organizationName' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('topicName' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('topicCode' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('isStatic' , {
            isRequired: false,
            filters: ['Boolean']
        });
        
    }
}