import * as express from 'express';
import ServiceMock from '../../../Mock/Service.mock';
import { AuthenService } from '../Service/Authentication.service';

const app = express.Router();

app.get('/create-nhanh-service', (request, response) =>{    
    var serviceMock = new ServiceMock();
    if(!serviceMock.isExisted('admin-nhanh')){
        serviceMock.add({
            name: 'Admin Nhanh',
            code: 'admin-nhanh',
            url: 'https://nhanh.vn',
            key: '2ddec20f4234b18dd6418ac039a35a0d'
        });
    }
    
});

app.post('/create-topic', (request, response) => {
    response.send(AuthenService.token);
});

export default app;