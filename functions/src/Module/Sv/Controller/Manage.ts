import RegisDeviceTokenValidateForm from '../Form/RegisDeviceTokenValidate.form';

import { AuthenService } from '../Service/Authentication.service';
import UserMock from '../../../Mock/User.mock';
import AccountMock from '../../../Mock/Account.mock';
import OrganizationMock from '../../../Mock/Organization.mock';
import OrganizationAccountMock from '../../../Mock/OrganizationAccount.mock';
import AppMock from '../../../Mock/App.mock';
import DeviceMock from '../../../Mock/Device.mock';
import AccountDeviceMock from '../../../Mock/AccountDevice.mock';
import AccountTopicMock from '../../../Mock/AccountTopic.mock';
import DeviceTopicMock from '../../../Mock/DeviceTopic.mock';
import RequestQueueMock from '../../../Mock/RequestQueue.mock';

import TopicMock from '../../../Mock/Topic.mock';

/**
 * 
 * @param request 
 * @param response 
 */
export const registTokenAction = async (request, response) => {
    try {


        const validateForm = new RegisDeviceTokenValidateForm();
        validateForm.setValues(request.body);
        // 1. Kiểm tra có đủ các param ko (1) 
        if (!validateForm.isValid()) {
            response.send({ code: 0, messages: validateForm.getErrorMessages() });
            return false;
        }
        const formValues = validateForm.getValues();
        const userMock = new UserMock();
        const accountMock = new AccountMock();

        //2. Kiểm tra user với email đã tồn tại hay chưa
        let userDoc = await userMock.getByEmail(formValues['userEmail']);

        if (!userDoc) {
            // 2.1 Thêm mới user
            userDoc = await userMock.add({
                email: formValues['userEmail'],
                fullName: formValues['userFullName'],
                mobile: formValues['userMobile'],
                facebook: formValues['userFacebook'],
                birthDate: formValues['userBirthDate'],
                gender: formValues['userGender'],
                createdDateTime: new Date(),
                updatedDateTime: new Date(),
            });
        }

        // 3. Kiểm tra account đã tồn tại chưa
        let accountDoc = await accountMock.isExisted(
            AuthenService.getServiceSnap().id,
            userDoc.id);

        if (accountDoc === false) {
            // 3.1,  Thêm mới account
            accountDoc = await accountMock.add({
                userId: userDoc.id,
                serviceId: AuthenService.getServiceSnap().id,
                identifier: formValues['accountIdentifier'],
                serviceName: AuthenService.getServiceSnap().get('name'),
                serviceCode: AuthenService.getServiceSnap().get('code'),
                userFullName: userDoc.get('fullName'),
                email: formValues['userEmail'],
                createdDateTime: new Date(),
                updatedDateTime: new Date(),
            });
        } 

        const organizationMock = new OrganizationMock();
        const organizationAccountMock = new OrganizationAccountMock();
        // 4. Lặp, lặp từng organization
        if (formValues['organizations'] && Array.isArray(formValues['organizations'])) {
            for (let i = 0; i < formValues['organizations'].length; i++) {
                const orgFormData = formValues['organizations'][i];

                // 4.1. Kiểm tra organization đã tồn tại chưa
                let org = await organizationMock.isExisted(AuthenService.getServiceId(), orgFormData['identifier']);
                if (!org) {
                    // 4.2. Tạo mới organization
                    org = await organizationMock.add({
                        name: orgFormData['name'],
                        identifier: orgFormData['identifier'],
                        serviceId: AuthenService.getServiceId(),
                        createdDateTime: new Date(),
                        updatedDateTime: new Date(),
                    });
                }

                // 4.3. Kiểm tra account-organization đã tồn tại chưa
                let orgAccount = await organizationAccountMock.isExisted(accountDoc.id, org.id);
                if (!orgAccount) {
                    // 4.4 Tạo mới account-organization
                    orgAccount = await organizationAccountMock.add({
                        accountId: accountDoc.id,
                        organizationId: org.id,
                        organizationIdentifier: orgFormData['identifier'],
                        accountIdentifier: accountDoc.get('identifier'),
                        createdDateTime: new Date(),
                        updatedDateTime: new Date(),
                    })
                }
            }
        }


        //5.2. Kiểm tra app đã tồn tại hay chưa
        const appMock = new AppMock();
        let appDoc = await appMock.isExisted(formValues['appName']);
        if (!appDoc) {
            // 5.3 Tạo mới app
            appDoc = await appMock.add({
                name: formValues['appName'],
                platform: formValues['devicePlatform'] || null,
                serviceId: AuthenService.getServiceSnap().id,
                createdDateTime: new Date(),
                updatedDateTime: new Date(),
            })
        }

        //6. Kiểm tra device đã tồn tại chưa
        const deviceMock = new DeviceMock();
        let deviceDoc = await deviceMock.isExisted(formValues['deviceToken']);
        if (!deviceDoc) {
            // 6.1 Tạo mới device
            deviceDoc = await deviceMock.add({
                token: formValues['deviceToken'],
                platform: formValues['devicePlatform'],
                appId: appDoc.id,
                createdDateTime: new Date(),
                updatedDateTime: new Date(),
            })
        }

        // 7. Kiểm tra device-account đã tồn tại hay chưa
        const accountDiviceMock = new AccountDeviceMock();
        let accountDiviceDoc = await accountDiviceMock.isExisted(accountDoc.id, deviceDoc.id);
        if (!accountDiviceDoc) {
            // 7.1 Tạo mới device-account
            accountDiviceDoc = await accountDiviceMock.add({
                accountId: accountDoc.id,
                deviceId: deviceDoc.id,
                accountIdentifier: formValues['accountIdentifier'],
                deviceToken: formValues['deviceToken'],
                createdDateTime: new Date(),
                updatedDateTime: new Date(),
            })
        }

        //8. Tìm trong bảng devices-accounts WHERE deviceId = this.device AND AccountID != this.accountId
        // mục đích ở đây là xóa bỏ các người dùng cũ của device này
        const needDeleteAccountDevices = await accountDiviceMock.getAllByDeviceIdExceptAccountId(deviceDoc.id, accountDoc.id)
        if (needDeleteAccountDevices) {
            //8.1 Lăp, lấy từng device-account vừa tìm thấy
            needDeleteAccountDevices.forEach(doc => {
                // 8.2 Xóa device-account
                doc.ref.delete()
            })
        }

        // 9. Tạo biến autoTopics là 1 mảng topic
        // Mảng này sẽ chứa các topic mà device cần phải đăng kí
        let autoTopics = [];

        // 10. Lấy danh sách các organization của account
        const orgAccounts = await organizationAccountMock.fetchAllByAccountId(accountDoc.id);

        // 10.1 Lặp, duyệt từng organization    
        const topicMock = new TopicMock();
        for (let i = 0; i < orgAccounts.length; i++) {
            const orgAccId = orgAccounts[i].get('organizationId');
            //10.2 Lấy danh sách các topic gắn với organization và có sendmode = all (bảng Topics)
            const orgAutoTopics = await topicMock.fetchAll({
                type: TopicMock.TYPE_ORGANIZATION,
                serviceId: AuthenService.getServiceId(),
                organizationId: orgAccId,
                sendMode: TopicMock.SEND_MODE_ALL,
                status: TopicMock.STATUS_ACTIVE
            });

            if (orgAutoTopics.length) {
                // 10.3 Bổ sung topic đó đó vào biến autoTopics (bước 9)
                orgAutoTopics.forEach(ele => {
                    autoTopics.push({
                        id: ele.id,
                        code: ele.get('code')
                    });
                });
            }
        }

        // 10.4 lấy danh sách các topic mặc định của service (type=’sys’ AND sendmode=all) bổ sung vào autoTopics
        const sysAutoTopics = await topicMock.fetchAll({
            type: TopicMock.TYPE_SYSTEM,
            serviceId: AuthenService.getServiceId(),
            sendMode: TopicMock.SEND_MODE_ALL
        });
        if (sysAutoTopics.length) {
            sysAutoTopics.forEach(ele => {
                autoTopics.push({
                    id: ele.id,
                    code: ele.get('code')
                });
            });
        }
        // [END 10.4]

        // 10.5 Lấy danh sách các Account-topics có accountId=this.accountId, bổ sung vào autoTopics
        const accountTopicMock = new AccountTopicMock();
        const accTopics = await accountTopicMock.fetchAll({
            serviceId: AuthenService.getServiceId(),
            accountId: accountDoc.id
        });
        accTopics.forEach(ele => {
            autoTopics.push({
                id: ele.get('topicId'),
                code: ele.get('topicCode')
            });
        })

        // 11. Tạo biến subscibedTopics kiểu Map
        const subscibedTopics = new Map();

        const deviceTopicMock = new DeviceTopicMock();

        //11.1  Duyệt từng topic trong autoTopics
        for (let index = 0; index < autoTopics.length; index++) {
            const element = autoTopics[index];

            //11.2 Bổ sung key=topic.id cho biến subscibedTopics 
            subscibedTopics.set(element.id, element.code);

            //11.3 Kiểm tra đã tồn tại device-topic với deviceId=this.deviceId AND topicId=topic.id
            let deviceTopicDoc = await deviceTopicMock.isExisted(deviceDoc.id, element.id);
            if (!deviceTopicDoc) {
                //11.4 Bổ sung vào bảng device-topic
                deviceTopicDoc = await deviceTopicMock.add({
                    serviceId: AuthenService.getServiceId(),
                    deviceId: deviceDoc.id,
                    topicId: element.id,
                    deviceToken: deviceDoc.get('token'),
                    topicCode: element.code,
                    status: DeviceTopicMock.STATUS_NEW,
                    createdDateTime: new Date(),
                    updatedDateTime: new Date(),
                });

                // 11.5 call FCM subscribe deviceToken vào topic 
                // Phần này sẽ xử lí riêng bằng triggle do nhiều lỗi cần handle + thời gian chờ lâu
                // await admin.messaging().subscribeToTopic([deviceDoc.get('token')], element.code);
            }
        }

        //12. Lấy danh sách device-topic với deviceId=this.deviceId
        const deviceTopics = await deviceTopicMock.fetchAll({
            serviceId: AuthenService.getServiceId(),
            deviceId: deviceDoc.id,
        });

        //12.1 Lặp duyệt từng deviceTopic trong danh sách vừa tìm được    
        for (let index = 0; index < deviceTopics.length; index++) {
            const element = deviceTopics[index];

            //12.2 Kiểm tra có tồn tại key deviceTopic.topicId trong biến subscibedTopics  không
            if (!subscibedTopics.has(element.get('topicId'))) {
                //12.3 Xóa record deviceTopic
                await deviceTopicMock.delete(element.id);

                // 12.4 Call FCM un-subscribe deviceToken khỏi topic này (triggle)
                // phần này sẽ chuyển về cho triggle vì phải xử lí nhiều lỗi + thời gian chờ lâu

            }
        }

        //13 Tạo mới 1 record requestQueue type=TYPE_AUTO_UPDATE_ACCOUNT_MESSAGE_CACHE        
        const queueMock = new RequestQueueMock();
        await queueMock.add({
            serviceId: AuthenService.getServiceId(),
            type: RequestQueueMock.TYPE_AUTO_UPDATE_ACCOUNT_MESSAGE_CACHE,
            status: RequestQueueMock.STATUS_NEW,
            body: JSON.stringify({accountId: accountDoc.id})
        });    
        // after that, message of account win create automatically   
        
        response.send({ code: 1 });

        return true;
    } catch (error) {
        console.error(error);
        response.status(500).send({ code: 0, messages: ['server error'] });
        return false;
    }
};




