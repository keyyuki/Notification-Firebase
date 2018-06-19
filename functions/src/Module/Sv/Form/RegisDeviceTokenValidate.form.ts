import FormBase from '../../../Base/Form';

export default class RegisDeviceTokenValidate extends FormBase{
    constructor(){
        super();
  
        this.addElement('organizations' , {});
       
        this.addElement('accountIdentifier' , {
            isRequired: true,
            filters: ['Digits']
        });
        this.addElement('userFullName' , {
            isRequired: true,
            filters: ['StringTrim']
        });
        this.addElement('userEmail' , {
            isRequired: true,
            filters: ['StringTrim']
        });
        this.addElement('deviceToken' , {
            isRequired: true,
            filters: ['StringTrim']
        });
        this.addElement('appName' , {
            isRequired: true,
            filters: ['StringTrim']
        });    
        this.addElement('devicePlatform' , {
            isRequired: false,
            filters: ['StringTrim']
        });
       
        
    }

}