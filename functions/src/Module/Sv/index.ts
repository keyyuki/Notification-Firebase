import * as express from 'express';
import Authentication from './Plugin/Authentication';
import ManageRoute from './Routes';


const cookieParse = require('cookie-parser')() ;
const cors = require('cors')({ origin: true });
const bodyParser = require('body-parser');


const app = express();
// enable cross domain
app.use(cors);
// enable cookie parser
app.use(cookieParse);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// implement custom authentication
app.use(Authentication);

// regis router manage/ 
app.use('/manage', ManageRoute);

app.get('/', (req, res) => {
    res.send('please use route /manage !');
    return true;
})
app.use(function (req, res, next) {
    res.status(404).send({code: 0, messages: ['404 Page not found']});
})


export default app;
