import AddTopicForm from '../Form/AddTopic.form';
import EditTopicForm from '../Form/EditTopic.form';
import ListTopicFilter from '../Form/Topic/Filter.form';
import GetTopicForm from '../Form/Topic/Get.form';
import AddSystemForm from '../Form/Topic/AddSystem.form';
import SystemTopicFilter from '../Form/Topic/SystemTopicFilter.form';
import EditSystemForm from '../Form/Topic/EditSystem.form';
import AddAccountToTopicForm from '../Form/Topic/AddAccountToTopic.form';
import AccountTopicListFilter from '../Form/Topic/AccountTopicList.form';

import { AuthenService } from '../Service/Authentication.service';
import OrganizationMock from '../../../Mock/Organization.mock';
import TopicMock from '../../../Mock/Topic.mock';
import AccountMock from '../../../Mock/Account.mock';
import AccountTopicMock from '../../../Mock/AccountTopic.mock';
import UserMock from '../../../Mock/User.mock';
import AccountDeviceMock from '../../../Mock/AccountDevice.mock';
import DeviceTopicMock from '../../../Mock/DeviceTopic.mock';
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

    //4. lấy  topic
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

export const systemTopicListAction = async(request, response) => {
    const formValidate = new SystemTopicFilter();
    formValidate.setValues(request.body);

    //1. Validate form
    if(!formValidate.isValid()){
        response.send({
            code: 0,
            messages: formValidate.getErrorMessagesList()
        });
        return false;
    }

    const topicMock = new TopicMock();
    const topicDocs = await topicMock.fetchAll({
        serviceId: AuthenService.getServiceId(),
        ...formValidate.getValidValues(),
        type: TopicMock.TYPE_SYSTEM
    });

    const result = topicDocs.map(ele => {
        const obj = {
            id: ele.id,
            name: ele.get('name'),
            code: ele.get('code'),
            status: ele.get('status'),
            sendMode: ele.get('sendMode'),
            sendModeName:'',
            createdDateTime: ele.get('createdDateTime')
        };
        if(ele.get('sendMode') === TopicMock.SEND_MODE_ALL){
            obj.sendModeName = 'all';
        }
        if(ele.get('sendMode') === TopicMock.SEND_MODE_INDIVIDUAL){
            obj.sendModeName = 'individual';
        }
        
        return obj;
    });

    response.send({
        code: 1,
        data: {
            filter: formValidate.getValidValues(),
            data: result
        }
    });
    return true;
}

export const getSystemTopicAction = async(request, response) => {
    if(!request.body || !request.body.id){
        response.send({
            code: 0,
            messages: ['invalid param']
        });
        return false;
    }
    const id = String(request.body.id).toString();
    if(!id){
        response.send({
            code: 0,
            messages: ['invalid param']
        });
        return false;
    }

    const topicMock = new TopicMock();
    const topicDoc = await topicMock.get(id);
    if(!topicDoc){
        response.send({
            code: 0,
            messages: ['Topic not found']
        });
        return false;
    }

    if(topicDoc.get('type') !== TopicMock.TYPE_SYSTEM){
        response.send({
            code: 0,
            messages: ['Topic không phải topic hệ thống']
        });
        return false;
    }

    const result = {
        id: topicDoc.id,
        name: topicDoc.get('name'),
        code: topicDoc.get('code'),
        status: topicDoc.get('status'),
        sendMode: topicDoc.get('sendMode'),
        sendModeName:'',
        createdDateTime: topicDoc.get('createdDateTime'),
        messageTemplate: {},
        totalAccount: 0
    }

    if(topicDoc.get('sendMode') === TopicMock.SEND_MODE_ALL){
        result.sendModeName = 'all';
    }
    if(topicDoc.get('sendMode') === TopicMock.SEND_MODE_INDIVIDUAL){
        result.sendModeName = 'individual';
    }

    if(topicDoc.get('messageTemplate')){
        result.messageTemplate = JSON.parse(topicDoc.get('messageTemplate'))
    }

    const accountTopicMock = new AccountTopicMock();
    result.totalAccount = await accountTopicMock.getTotalAccountOfTopic(topicDoc.id);

    response.send({
        code: 1,
        data: result
    });
    return true;
}

export const editSystemTopicAction = async(request, response) => {
    const formValidate = new EditSystemForm();
    formValidate.setValues(request.body);

    //1. Validate form
    if(!formValidate.isValid()){
        response.send({
            code: 0,
            messages: formValidate.getErrorMessagesList()
        });
        return false;
    }
    const formValues = formValidate.getValues();

    // 2. tìm kiếm Topic
    const topicMock = new TopicMock();
    const topicDoc = await topicMock.get(formValues['id']);
    if(!topicDoc){
        response.send({
            code: 0,
            messages: ['Topic not found']
        });
        return false;
    }

    if(topicDoc.get('type') !== TopicMock.TYPE_SYSTEM){
        response.send({
            code: 0,
            messages: ['Topic không phải topic hệ thống']
        });
        return false;
    }

    
    const dataUpdate = {
        ...formValues,
        updatedDateTime: new Date()
    };
    delete dataUpdate['id'];
    await topicMock.update(formValues['id'], dataUpdate);
    response.send({
        code: 1,        
    });
    return true;

}

export const addAccountToTopicAction = async(request, response) => {
    const formValidate = new AddAccountToTopicForm();
    formValidate.setValues(request.body);

    //1. Validate form
    if(!formValidate.isValid()){
        response.send({
            code: 0,
            messages: formValidate.getErrorMessagesList()
        });
        return false;
    }
    const formValues = formValidate.getValues();

    //2. Tìm kiếm topic theo topicId
    const topicMock = new TopicMock();
    const topicDoc = await topicMock.get(formValues['topicId']);
    if(!topicDoc){
        response.send({
            code: 0,
            messages: ['Topic not found']
        });
        return false;
    }

    if(topicDoc.get('status') !== TopicMock.STATUS_ACTIVE){
        response.send({
            code: 0,
            messages: ['Topic is inactive']
        });
        return false;
    }

    if(topicDoc.get('sendMode') === TopicMock.SEND_MODE_ALL){
        response.send({
            code: 0,
            messages: ['Topic have sendMode all']
        });
        return false;
    }

    //3. tạo biến accountList = Object
    const accountList = {};

    //3.1 Lặp duyệt từng phần tử trong param accounts as acc
    const accountMock =  new AccountMock();
    const userMock = new UserMock();
    for (const acc of formValues['accounts']) {
        
        //3.2 Tìm kiếm account theo acc.id
        let account = await accountMock.getByIdentifier(acc['id'], AuthenService.getServiceId());
        if(!account){
            //3.2.1 tìm kiếm user theo acc.email
            let user = await userMock.getByEmail(acc['email']);
            if(!user){
                // 3.2.2 tạo mới user
                user = await userMock.add({
                    email: acc['email'],
                    fullName: acc['fullName'] || '',
                    createdDateTime: new Date()
                })
            }

            //3.3 Tạo mới account
            account = await accountMock.add({
                serviceId: AuthenService.getServiceId(),
                userId: user.id,
                identifier: parseInt(acc['id']),
                createdDateTime: new Date(),
                updatedDateTime: new Date(),
            });

        }

        //3.4 Bổ sung vào biến accountList
        accountList[account.id] = account;
    }

    //4 Tạo biến deviceList = {}
    const deviceList = {};

    const accountDeviceMock = new AccountDeviceMock();
    const accountTopicMock = new AccountTopicMock();
    //5 duyệt foreach accountList as account
    for (const accountId of Object.keys(accountList)) {
        const account = accountList[accountId];

        //5.1 Tìm danh sách các account-device của account
        const ads = await accountDeviceMock.fetchAllByAccount(accountId);
        
        //5.2 Bổ sung các device vào biến deviceList
        for (const accountDevice of ads) {
            deviceList[accountDevice.get('deviceId')] = {
                deviceId: accountDevice.get('deviceId'),
                deviceToken: accountDevice.get('deviceToken'),
            };
        }

        //5.3 Kiểm tra đã tồn tại account-topic chưa thì bổ sung account-topic
        const isAccountTopicExisted = accountTopicMock.isExisted(accountId, topicDoc.id);
        if(!isAccountTopicExisted){
            await accountTopicMock.add({
                serviceId: AuthenService.getServiceId(),
                topicId: topicDoc.id,
                accountId: accountId,
                accountIdentifier: account.get('identifier'),
                topicCode: topicDoc.get('code'),
                createdByAccountId: formValues['senderAccountId'],
                createdDateTime: new Date()
            });
        }
    }

    const deviceTopicMock = new DeviceTopicMock();
    //6. duyệt biến foreach deviceList as device
    for (const deviceId of Object.keys(deviceList)) {
        const deviceInfo = deviceList[deviceId];
        const isexistedDeviceTopic = await deviceTopicMock.isExisted(deviceId, topicDoc.id);
        if(!isexistedDeviceTopic){
            await deviceTopicMock.add({
                serviceId: AuthenService.getServiceId(),
                deviceId: deviceId,
                topicId: topicDoc.id,
                deviceToken: deviceInfo['deviceToken'],
                topicCode: topicDoc.get('code'),
                status: DeviceTopicMock.STATUS_NEW,
                createdDateTime: new Date()
            })
        }
    }

    response.send({code: 1});
    return true;
}

export const getAccountTopicListAction = async(request, response) => {
    const formValidate = new AccountTopicListFilter();
    formValidate.setValues(request.body);

    //1. Validate form
    if(!formValidate.isValid()){
        response.send({
            code: 0,
            messages: formValidate.getErrorMessagesList()
        });
        return false;
    }
    const formValues = formValidate.getValues();

    //2. Tìm kiếm topic theo topicId
    const topicMock = new TopicMock();
    const topicDoc = await topicMock.get(formValues['topicId']);
    if(!topicDoc){
        response.send({
            code: 0,
            messages: ['Topic not found']
        });
        return false;
    }    

    if(topicDoc.get('sendMode') === TopicMock.SEND_MODE_ALL){
        response.send({
            code: 0,
            messages: ['Topic have sendMode all']
        });
        return false;
    }

    //
    const accountTopicMock = new AccountTopicMock();
    const docs = await accountTopicMock.search({
        serviceId: AuthenService.getServiceId(),
        ...formValues
    });

    const data = docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        }
    });

    const lastDoc = docs.pop();

    const result ={
        data: data,
        paginator: {
            next_page_token: lastDoc.get('accountIdentifier')
        }
    }

    response.send({
        code: 1,
        data: result
    })
    return true;
}