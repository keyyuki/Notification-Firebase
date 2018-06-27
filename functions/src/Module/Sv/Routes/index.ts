import * as express from 'express';
import { registTokenAction, } from '../Controller/Manage';
import * as TopicController from '../Controller/Topic';
import * as AccountController from '../Controller/Account';
import * as MessageController from '../Controller/Message';

const app = express.Router();

app.post('/regis-device', registTokenAction);

app.post('/topic/add', TopicController.addTopicAction);
app.post('/topic/edit', TopicController.editTopicAction);
app.post('/topic/list', TopicController.listTopicAction);
app.post('/topic/get', TopicController.getAction);
app.post('/topic/add-system', TopicController.addSystemAction);

app.post('/account/unsubcribe-all', AccountController.unsubcribeAllAction);

app.post('/message/send-to-topic', MessageController.sendToTopic);

export default app;