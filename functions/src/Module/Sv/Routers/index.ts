import * as express from 'express';
import ServiceMock from '../../../Mock/Service.mock';
import { AuthenService } from '../Service/Authentication.service';

const app = express.Router();

app.post('/create-topic', (request, response) => {
    response.send(AuthenService.token);
});

export default app;