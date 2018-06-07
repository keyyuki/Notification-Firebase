import RegisDeviceTokenValidateForm from '../Form/RegisDeviceTokenValidate.form';
import { AuthenService } from '../Service/Authentication.service';
import UserMock from '../../../Mock/User.mock';
import AccountMock from '../../../Mock/Account.mock';
import OrganizationMock from '../../../Mock/Organization.mock';
import OrganizationAccountMock from '../../../Mock/OrganizationAccount.mock';
import AppMock from '../../../Mock/App.mock';
import DeviceMock from '../../../Mock/Device.mock';
import AccountDeviceMock from '../../../Mock/AccountDevice.mock';

import { user } from 'firebase-functions/lib/providers/auth';
import FormBase from '../../../Base/Form';

/**
 * 
 * @param request 
 * @param response 
 */
export const registTokenAction = async(request, response) =>
{
    
    let validateForm = new RegisDeviceTokenValidateForm();
    validateForm.setValues(request.body);
    // 1. Kiểm tra có đủ các param ko (1) 
    if(validateForm.isValid()){
        const formValues = validateForm.getValues();        
        const userMock =  new UserMock();
        const accountMock = new AccountMock();

        //2. Kiểm tra user với email đã tồn tại hay chưa
        let userDoc = await userMock.getByEmail(formValues['userEmail']);

        if(!userDoc){
            // 2.1 Thêm mới user
            userDoc = await userMock.add({
                email: formValues['userEmail'],
                fullName: formValues['userFullName']
            });
        }

        // 3. Kiểm tra account đã tồn tại chưa
        let accountDoc = await accountMock.isExisted(
            AuthenService.getServiceSnap().id, 
            userDoc.id);
            
        if(accountDoc == false){
            // 3.1,  Thêm mới account
            accountDoc = await accountMock.add({
                userId: userDoc.id,
                serviceId: AuthenService.getServiceSnap().id,
                identifier: formValues['accountIdentifier'],
                serviceName: AuthenService.getServiceSnap().get('name'),
                serviceCode: AuthenService.getServiceSnap().get('code'),
                userFullName: userDoc.get('fullName')
            });
        } 

        // 4. Kiểm tra organization đã tồn tại chưa
        const organizationMock = new OrganizationMock;
        let organizationDoc = await organizationMock.isExisted(
            AuthenService.getServiceSnap().id, 
            formValues['organizationIdentifier']
        );

        if(!organizationDoc){
            //4.1. Tạo mới organization
            organizationDoc = await organizationMock.add({
                serviceId:  AuthenService.getServiceSnap().id,
                identifier: formValues['organizationIdentifier'],
                name: formValues['organizationName']
            });
        }

        // 5. Kiêm tra organization account đã tồn tại chưa
        const organizationAccountMock = new OrganizationAccountMock();
        let orgAccount = await organizationAccountMock.isExisted(
            accountDoc.id, organizationDoc.id
        )
        if(!orgAccount){
            //5.1 Tạo mới Organization-account
            orgAccount = await organizationAccountMock.add({
                accountId: accountDoc.id,
                organizationId: organizationDoc.id,  
            });
        }

        //5.2. Kiểm tra app đã tồn tại hay chưa
        const appMock =  new AppMock();
        let appDoc = await appMock.isExisted(formValues['appName']);
        if(!appDoc){
            // 5.3 Tạo mới app
            appDoc = await appMock.add({
                name: formValues['appName'],
                platForm: formValues['devicePlatform'] || null,
                serviceId: AuthenService.getServiceSnap().id
            })
        }

        //6. Kiểm tra device đã tồn tại chưa
        const deviceMock = new DeviceMock();
        let deviceDoc = await deviceMock.isExisted(formValues['deviceToken']);
        if(!deviceDoc){
            // 6.1 Tạo mới device
            deviceDoc = await deviceMock.add({
                token: formValues['deviceToken'],
                platform: formValues['devicePlatform'],
                appId: appDoc.id,
            })
        }

        // 7. Kiểm tra device-account đã tồn tại hay chưa
        const accountDiviceMock = new AccountDeviceMock();
        let accountDiviceDoc = await accountDiviceMock.isExisted(accountDoc.id, deviceDoc.id);
        if(!accountDiviceDoc){
             // 7.1 Tạo mới device-account
             accountDiviceDoc = await accountDiviceMock.add({
                accountId: accountDoc.id,
                deviceId: deviceDoc.id,
                accountIdentifier: formValues['accountIdentifier'],
                deviceToken: formValues['deviceToken'],
            })
        }

        //8. Tìm trong bảng devices-accounts WHERE deviceId = this.device AND AccountID != this.accountId
        let needDeleteAccountDevices = await accountDiviceMock.getAllByDeviceIdExceptAccountId(deviceDoc.id, accountDoc.id)
        if(needDeleteAccountDevices){
            //8.1 Lăp, lấy từng device-account vừa tìm thấy
            needDeleteAccountDevices.forEach(doc => {
                // 8.2 Xóa device-account
                doc.ref.delete()
            })
        }

        let autoTopics = [];
        

        response.send({code: 1});
    } else {
        response.send({code: 0, messages: validateForm.getErrorMessages()});
    }
    return true;
};
