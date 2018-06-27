import FormBase from '../../../../Base/Form';



export default class SendToTopicForm extends FormBase{
    constructor(){
        super();       

        this.addElement('topicCode' , {
            isRequired: true,
            filters: ['String']
        });

        this.addElement('title' , {
            isRequired: true,
            filters: ['String']
        });

        this.addElement('body' , {
            isRequired: true,
            filters: ['String']
        });

        this.addElement('senderAccountIdentifier' , {
            isRequired: false,
            filters: ['String']
        });

        this.addElement('icon' , {
            isRequired: false,
            filters: ['String']
        });

        this.addElement('color' , {
            isRequired: false,
            filters: ['String']
        });

        this.addElement('priority' , {
            isRequired: false,
            filters: ['String']
        });
    }

    
}