import * as express from 'express';
import ServiceMock from '../../../Mock/Service.mock';
import { AuthenService } from '../Service/Authentication.service';
import { registTokenAction } from '../Controller/Manage'

const app = express.Router();

app.post('/regis-device', registTokenAction);

export default app;