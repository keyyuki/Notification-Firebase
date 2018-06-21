import AddTopicForm from '../Form/AddTopic.form';
import EditTopicForm from '../Form/EditTopic.form';
import ListTopicFilter from '../Form/Topic/Filter.form';

import { AuthenService } from '../Service/Authentication.service';
import OrganizationMock from '../../../Mock/Organization.mock';
import TopicMock from '../../../Mock/Topic.mock';

export const addTopicAction = async(request, response) => {
    const formValidate = new AddTopicForm();
    formValidate.setValues(request.body);

    //1. Validate data
    if(!formValidate.isValid()){
        response.send({code: 0, messages: formValidate.getErrorMessagesList()})
        return false;
    }
    const formValues = formValidate.getValues();

    // 2. Kiểm tra organization đã tồn tại chưa
    const orgMock = new OrganizationMock();
    let orgDoc = await orgMock.isExisted(AuthenService.getServiceSnap().id, formValues['organizationIdentifier']);
    if(!orgDoc){
        // 2.1 Tạo mới organization
        orgDoc = await orgMock.add({
            name: formValues['organizationName'],
            identifier: formValues['organizationIdentifier'],
            serviceId: AuthenService.getServiceSnap().id,
            createdDateTime: new Date(),
            updatedDateTime: new Date()
        });
    }

    //3. Kiểm tra Topic đã tồn tại chưa
    const topicMock = new TopicMock();
    let topicDoc = await topicMock.isExisted(formValues['topicCode']);
    if(topicDoc){
        response.send({code: 0, messages: ['topicCode đã tồn tại']});
        return false;
    }

    // 3.1 Tạo mới Topic
    topicDoc = await topicMock.add({
        name: formValues['topicName'],
        code: formValues['topicCode'],
        serviceId: AuthenService.getServiceId(),
        organizationId: orgDoc.id,
        organizationName: orgDoc.data().name,
        organizationIdentifier: orgDoc.data().identifier,
        sendMode: TopicMock.SEND_MODE_ALL,
        type: TopicMock.TYPE_ORGANIZATION,
        createdDateTime: new Date(),
        updatedDateTime: new Date()
    });

    
    response.send({code: 1, data: {
        id: topicDoc.id,
        ...topicDoc.data()
    }});
    return true;
}

export const editTopicAction = async(request, response) => {
    const formValidate = new EditTopicForm();
    formValidate.setValues(request.body);

    //1. Validate data
    if(!formValidate.isValid()){
        response.send({code: 0, messages: formValidate.getErrorMessagesList()})
        return false;
    }
    const formValues = formValidate.getValidValues();

    // 2. Tìm  theo topicId
    const topicMock = new TopicMock();
    let topicDoc = await topicMock.get(formValues['topicId']);
    if(!topicDoc){        
        response.send({code: 0, messages: ['Không tìm thấy topic']});
        return false
    }

    // 3. Kiểm tra param organizationIdentifier có trùng vơi topic.organizationIdentifier ko
    if(topicDoc.get('organizationIdentifier') !== formValues['organizationIdentifier']){
        response.send({code: 0, messages: ['this topic belong other organization']});
        return false
    }

    // 4. Kiểm tra topicCode đã được sử dụng chưa (loại trừ chính bản thân nó)
    if(formValues['topicCode']){
        const isExisted = await topicMock.checkCodeIsExisted(formValues['topicCode'], topicDoc.id);
        if(isExisted){
            response.send({code: 0, messages: ['Mã topic đã tồn tại']});
            return false
        }
    }   

    // 5. Cập nhật thông tin cho topic
    topicDoc = await topicMock.update(topicDoc.id, {
        ...formValues,
        updatedDateTime: new Date()
    });


    response.send({code: 1, data: {
        ...topicDoc.data(),
        id: topicDoc.id
    }});
    return true;
}

export const listTopicAction = async(request, response) => {
    const formValidate = new ListTopicFilter();
    formValidate.setValues(request.body);

    //1. Validate data
    if(!formValidate.isValid()){
        response.send({code: 0, messages: formValidate.getErrorMessagesList()})
        return false;
    }
    const formValues = formValidate.getValidValues();


    // 2. Tìm  theo topicId
    const topicMock = new TopicMock();
    const topicDocs = await topicMock.fetchAll({
        serviceId: AuthenService.getServiceId(),
        ...formValues
    });
    
    const result = topicDocs.map(doc => {
        return {           
            ...doc.data(),
            id: doc.id,
        };
    });
    response.send( {
        code: 1,
        data: {
            filter: formValues,
            data: result
        }
    });
    return true;
}