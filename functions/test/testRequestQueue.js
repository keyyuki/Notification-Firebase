var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');
const admin = require('firebase-admin');
const projectConfig = {
    databaseURL: "https://nhanh-notification-dev.firebaseio.com",
    projectId: "nhanh-notification-dev",
    storageBucket: "nhanh-notification-dev.appspot.com",
    messagingSenderId: "820207856177"
};
const test = require('firebase-functions-test')(projectConfig, './config/development/google-json-key.json');

const myFunctions = require('../lib/index.js'); 

describe('Test Triggle', () => {
    after(() => {
        // Do cleanup tasks.
        test.cleanup();
        
        // xóa record devices-topics/test111
        //admin.firestore().doc('devices-topics/test111').delete()
    });
    it('Triggle when new requestQueue type TYPE_ACCOUNT_UNSUBCRIBE_ALL created, case 1 (data valid)', (done) => {
        console.log('Triggle when new requestQueue type TYPE_ACCOUNT_UNSUBCRIBE_ALL created, case 1 (data valid) ')

        const wrapped = test.wrap(myFunctions.onRequestQueueCreated);
        const dataTest = require('./data/onRequestQueueCreated/TYPE_ACCOUNT_UNSUBCRIBE_ALL/valid.data.json')
        const snap = test.firestore.makeDocumentSnapshot(dataTest, 'request-queue/test111'); 

        wrapped(snap).then((result) => {
            return assert.equal(result, true)
        }).then(done, done)
    })
})