import {AuthenService} from '../Service/Authentication.service';
import ServiceMock from '../../../Mock/Service.mock';

const AuthenticatePlugin = async(req, res, next) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
        res.status(403).send('Unauthorized');
        return;
    }    
    const idToken = req.headers.authorization.split('Bearer ')[1];

    const serviceMock = new ServiceMock();

    const snap = await serviceMock.findByToken(idToken);

    if(snap){
        AuthenService.token = idToken;
        AuthenService.setServiceSnap(snap);
        next();   
        return;  
    }
     
    
    
    res.status(403).send('Authorized Failed');
    return;
}
export default AuthenticatePlugin;