import FormBase from '../../../Base/Form';

export default class EditTopicForm extends FormBase{
    constructor(){
        super();
        this.addElement('topicId' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('organizationIdentifier' , {
            isRequired: true,
            filters: ['Digits']
        });  
        this.addElement('sendMode' , {
            isRequired: false,
            filters: ['Digits']
        });
           
        this.addElement('topicName' , {
            isRequired: false,
            filters: ['String']
        });
        this.addElement('topicCode' , {
            isRequired: false,
            filters: ['String']
        });
        this.addElement('status' , {
            isRequired: false,
            filters: ['String']
        });

    }
}