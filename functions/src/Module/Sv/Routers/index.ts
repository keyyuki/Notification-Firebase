import * as express from 'express';
const app = express.Router();


app.get('/', (request, response) =>{
    response.send('only serve post request');
    return;
});


app.post('/create-topic', (request, response) => {

});



app.post('/adddevice', (request, response) =>{
    const userId = request.body.userId;
    const deviceToken = request.body.deviceToken;
    console.log(request.body);
    if(!userId || !deviceToken){
        return response.send({code: 0, messages: ['Invalid Params']});
    }
    response.send({code: 1, messages: ['ok']});
    return true;
})

export default app;