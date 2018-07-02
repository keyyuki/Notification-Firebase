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
app.post('/topic/list-system', TopicController.systemTopicListAction);
app.post('/topic/get-system', TopicController.getSystemTopicAction);
app.post('/topic/edit-system', TopicController.editSystemTopicAction);
app.post('/topic/add-account-to-topic', TopicController.addAccountToTopicAction);
app.post('/topic/list-account-topic', TopicController.getAccountTopicListAction);

app.post('/account/unsubcribe-all', AccountController.unsubcribeAllAction);

app.post('/message/send-to-system-topic', MessageController.sendToSystemTopicAction);


export default app;