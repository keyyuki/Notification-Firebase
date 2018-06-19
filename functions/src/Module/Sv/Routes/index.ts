import * as express from 'express';

import { 
    registTokenAction, 
    } from '../Controller/Manage';

import * as TopicController from '../Controller/Topic';
const app = express.Router();

app.post('/regis-device', registTokenAction);
app.post('/topic/add', TopicController.addTopicAction);
app.post('/topic/edit', TopicController.editTopicAction);
app.post('/topic/list', TopicController.listTopicAction);

export default app;