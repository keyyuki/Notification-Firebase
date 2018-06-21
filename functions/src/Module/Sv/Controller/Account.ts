import UnsubcribeAllForm from '../Form/Account/UnsubcribeAll.form'
import { AuthenService } from '../Service/Authentication.service';
import RequestQueueMock from '../../../Mock/RequestQueue.mock';

export const unsubcribeAllAction = async(request, response) => {
    const formValidate = new UnsubcribeAllForm();
    formValidate.setValues(request.body);

    if(!formValidate.isValid()){
        response.send({code: 0, messages: formValidate.getErrorMessagesList()})
        return false;
    }

    const requestQueueMock = new RequestQueueMock();
    await requestQueueMock.add({
        serviceId: AuthenService.getServiceId(),
        body: JSON.stringify(formValidate.getValues()),
        type: RequestQueueMock.TYPE_ACCOUNT_UNSUBCRIBE_ALL,
        status: RequestQueueMock.STATUS_NEW,
        createdDateTime: new Date()
    });

    response.send({code: 1});
    return true;
}