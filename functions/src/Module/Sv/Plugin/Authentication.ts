import {AuthenService} from '../Service/Authentication.service';
import ServiceMock from '../../../Mock/Service.mock';

const AuthenticatePlugin = (req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        res.status(403).send('Unauthorized');
        return;
    }    
    const idToken = req.headers.authorization.split('Bearer ')[1];

    const serviceMock = new ServiceMock();
    if(serviceMock.findByToken(idToken)){
        AuthenService.token = idToken;
        AuthenService.serviceSnap = serviceMock.getCurrentDoc();
        next();   
        return;   
    }
    
    res.status(403).send('Authorized Failed');
    return;
}
export default AuthenticatePlugin;