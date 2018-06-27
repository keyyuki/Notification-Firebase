import AddTopicForm from '../Form/AddTopic.form';
import EditTopicForm from '../Form/EditTopic.form';
import ListTopicFilter from '../Form/Topic/Filter.form';
import GetTopicForm from '../Form/Topic/Get.form';
import AddSystemForm from '../Form/Topic/AddSystem.form';

import { AuthenService } from '../Service/Authentication.service';
import OrganizationMock from '../../../Mock/Organization.mock';
import TopicMock from '../../../Mock/Topic.mock';
import AccountMock from '../../../Mock/Account.mock';
import AccountTopicMock from '../../../Mock/AccountTopic.mock';
import UserMock from '../../../Mock/User.mock';
import * as moment from 'moment';

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

export const getAction = async(request, response) : Promise<Boolean> => {
    const formValidate = new GetTopicForm();
    formValidate.setValues(request.body);

    //1. validate dữ liệu
    if(!formValidate.isValid()){
        response.send({
            code: 0,
            messages: formValidate.getErrorMessagesList()
        })
        return false;
    }

    const formValues = formValidate.getValues();

    // 2. Get topic by id
    const topicMock = new TopicMock();
    const topicDoc = await topicMock.get(formValues['id']);
    if(!topicDoc){
        response.send({
            code: 0,
            messages: ['Không tìm thấy topic']
        })
        return false;
    }

    // 3. Kiểm tra topic organization khớp với param organization ko
    if(topicDoc.get('organizationIdentifier') !== formValues['organizationIdentifier']){
        response.send({
            code: 0,
            messages: ['Topic không thuộc doanh nghiệp']
        })
        return false;
    }

    //4. lấy danh sách account-topic
    const result = {
        id: topicDoc.id,
        name: topicDoc.get('name'),
        code: topicDoc.get('code'),
        status: topicDoc.get('status'),
        sendMode: topicDoc.get('sendMode'),
        sendModeDescription: '',
        isStatic: topicDoc.get('isStatic'),
        messageTemplate: {},
        createdDateTime: topicDoc.get('createdDateTime'),
    };
    if(topicDoc.get('messageTemplate')){
        result.messageTemplate = JSON.parse(topicDoc.get('messageTemplate'));
    }
    if(topicDoc.get('createdDateTime')){
        result.createdDateTime = moment(topicDoc.get('createdDateTime')).utc().unix();
    }
    switch (topicDoc.get('sendMode')) {
        case TopicMock.SEND_MODE_ALL:
            result.sendModeDescription = 'all'
            break;
        case TopicMock.SEND_MODE_INDIVIDUAL:
            result.sendModeDescription = 'individual'
            break;
        default:
            break;
    }

    response.send({
        code: 1,
        data: result
    })

    return true;
}

export const addSystemAction = async(request, response) => {
    const formValidate = new AddSystemForm();
    formValidate.setValues(request.body);

    //1. Validate form
    if(!formValidate.isValid()){
        response.send({
            code: 0,
            messages: formValidate.getErrorMessagesList()
        });
        return false;
    }

    const formData = formValidate.getValues();

    // 2. Kiểm tra topic code đã tồn tại
    const topicMock = new TopicMock();
    const topicIsExisted = await topicMock.isExisted(formData['code'])
    if(topicIsExisted){
        response.send({
            code: 0,
            messages: ['Mã topic đã tồn tại']
        });
        return false;
    }

    //3.0.1 Tạo biến topicAccs
    const topicAccs = new Map();

    // 3.0.2 Kiểm tra topic sendmode == individual
    const accountMock = new AccountMock();
    const userMock = new UserMock();
    if(formData['sendMode'] === TopicMock.SEND_MODE_INDIVIDUAL){
        if(formData['userList'] && Array.isArray(formData['userList'])){
            
            //3. duyệt formData.userList
            for (const userArr of formData['userList']) {
                //3.1 Tìm kiếm account theo userListItem.id
                let account = await accountMock.getByIdentifier(userArr['id'], AuthenService.getServiceId());;
                if(!account){

                    //3.2 Kiểm tra user tồn tại theo email
                    let user = await userMock.getByEmail(userArr['email']);
                    if(!user){
                        //3.3 Tạo mới user
                        user = await userMock.add({
                            email: userArr['email'],
                            fullName: userArr['fullName'],
                            createdDateTime: new Date()
                        });
                    }

                    //3.4 Tạo mới account
                    account = await accountMock.add({
                        serviceId: AuthenService.getServiceId(),
                        userId: user.id,
                        identifier: userArr['id'],
                        createdDateTime: new Date(),
                        updatedDateTime: new Date(),
                    });                    
                }

                //3.5 bổ sung account vào biến topicAccs
                topicAccs.set(userArr['id'], account);
            }
        }
    }

    // 4. tạo mới topic    
    const topic = await topicMock.add({
        name: formData['name'],
        code: formData['code'],
        serviceId: AuthenService.getServiceId(),
        organizationId: '',
        organizationIdentifier: '',
        
        isStatic: false, // xác định topic đó có phải topic mặc định như đơn hàng, bán lẻ hay ko
        status: TopicMock.STATUS_ACTIVE, // status ACTIVE và INACTIVE
        type: TopicMock.TYPE_SYSTEM, // enum [1 | 2], đánh dấu đây là topic của service hay organization
        sendMode: formData['sendMode'],
        messageTemplate: formData['messageTemplate'],
        createdDateTime: new Date(),
    });

    if(topicAccs.size > 0){
        const accountTopicMock = new AccountTopicMock();
        //5. duyệt biến topicAccs
        for (const account of Array.from(topicAccs.values())) {
            //5.1 thêm record vào account-topic
            await accountTopicMock.add({
                serviceId: AuthenService.getServiceId(),
                topicId: topic.id,
                accountId: account.id,
                accountIdentifier: account.get('identifier'),
                topicCode: account.get('code'),
            })
        }
        
    }
    response.send({
        code: 1,
        data: {
            id: topic.id,
            ...topic.data()
        }
    });
    return true;
}