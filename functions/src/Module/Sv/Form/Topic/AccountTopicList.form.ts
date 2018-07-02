import FormBase from '../../../../Base/Form';


export default class AccountTopicListFilter extends FormBase{
    constructor(){
        super();
        this.addElement('topicId' , {
            isRequired: true,
            filters: ['String']
        });
        this.addElement('accountIdentifier' , {
            isRequired: false,
            filters: ['Digits']
        });

        this.addElement('pageToken' , {
            isRequired: false,
            filters: ['Digits']
        });
    }


}