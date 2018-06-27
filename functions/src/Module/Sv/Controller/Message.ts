import { Request, Response } from 'firebase-functions'
import SendToTopicForm from '../Form/Message/SendToTopic.form';
import TopicMock from '../../../Mock/Topic.mock';
import MessageMock from '../../../Mock/Message.mock';
import * as admin from 'firebase-admin';
import { AuthenService } from '../Service/Authentication.service';
import * as moment from 'moment';


const toMessageForm = (values) : admin.messaging.Message => {   

    const result =  {
        topic: String(values['topicCode']).toString(),
        notification: {
            title: '',
            body: ''
        },
        data: {
            ts: moment.utc().valueOf().toString(),
            topicName: values['topicName'],

        },
        webpush: {
            notification: {
                icon : 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_96dp.png',
                click_action: '/admin'
            }
        }
    };
    
    if(values['title']){
        result.notification['title'] = values['title'];
        result.data['title'] = values['title'];
    }
    if(values['body']){
        result.notification['body'] = values['body'];
        result.data['body'] = values['body'];
    }

    if(values['topicName']){
        result.data['topicName'] = values['topicName'];

    }
    
    return result;
}


export const sendToTopic = async( request : Request, response: Response ): Promise<Boolean> =>{
    const formValidate = new SendToTopicForm();
    formValidate.setValues(request.body);
    //1. Validate form
    if(!formValidate.isValid){
        response.send({code: 0, messages: formValidate.getErrorMessagesList()});
        return false;
    }
    //2. tạo biến formValues = form.values
    const formValues = formValidate.getValues();

    //3. Tìm topic theo formValues.topicCode
    const topicMock = new TopicMock();
    const topicDoc = await topicMock.isExisted(formValues['topicCode']);
    if(!topicDoc){
        response.send({code: 0, messages: ['Topic not found']});
        return false;
    }

    const fcmFormData = toMessageForm({
        ...formValues,
        topicName: topicDoc.get('name')
    });

    //4. tạo mới record messageDoc trong bảng message
    const messageMock = new MessageMock();
    const messageDoc = await messageMock.add({
        serviceId: AuthenService.getServiceId(),

        topicId: topicDoc.id,
        topicCode: topicDoc.get('code'),
        organizationId: topicDoc.get('organizationId'),
        organizationIdentifier: topicDoc.get('organizationIdentifier'),
        senderAccountIdentifier: formValues['senderAccountIdentifier'],
        title: formValues['title'],
        body: formValues['body'],
        fcmRequest: JSON.stringify(fcmFormData),
        formData: JSON.stringify(formValues),

        status: MessageMock.STATUS_NEW,
        sendType: MessageMock.SENDTYPE_TOPIC,
    });

    //5. Gửi topic lên FCM    
    try {        
        const fcmResponse = await admin.messaging().send(fcmFormData);
        await messageMock.update(messageDoc.id, {
            status: MessageMock.STATUS_FCM_SUCCESS,
            fcmMessageId: fcmResponse
        });
        response.send({code: 1});
    } catch (error) {
        await messageMock.update(messageDoc.id, {
            status: MessageMock.STATUS_FCM_FAILED,
            error: JSON.stringify(error)
        })
        response.send({code: 2, messages: ['Fail to push notification']});
        return false;
    }   
    return true;
}

