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
    before(() => {
        // tạo 1 record trống devices-topics/test111 trong database để tham chiếu
        //admin.firestore().doc('devices-topics/test111').create({})
    });
    after(() => {
        // Do cleanup tasks.
        test.cleanup();
        
        // xóa record devices-topics/test111
        //admin.firestore().doc('devices-topics/test111').delete()
    });
    it('Triggle when new device-topic created, case 1 (data invalid)', (done) => {
        console.log('testing Triggle when new device-topic created, case 1 (data invalid)... ')
        const wrapped = test.wrap(myFunctions.onDeviceTopicCreate);

        const dataTest = require('./data/onDeviceTopicCreate/invalid.data.json')
        const snap = test.firestore.makeDocumentSnapshot(dataTest, 'devices-topics/test111'); 
        const compare = new Promise((resolve, reject) => {
            wrapped(snap).then((rs)=>{
                admin.firestore().collection('devices-topics').doc('test111').get().then((val) => {
                    if(val.exists){      
                        console.log('record tested', val.data())     
                        
                        resolve(val.data()['status']);

                    } else {
                        reject('not found')
                    }                
                })
            })
            
        })
        compare.then(result => {
            return assert.equal(result, 3)
        }).then(done, done);
    });


    it('Triggle when new device-topic created, case 2 (data valid)', (done) => {
        console.log('testing Triggle when new device-topic created, case 2 (data valid)... ')
        const wrapped = test.wrap(myFunctions.onDeviceTopicCreate);

        const dataTest = require('./data/onDeviceTopicCreate/valid.data.json')
        const snap = test.firestore.makeDocumentSnapshot(dataTest, 'devices-topics/test111'); 
        const compare = new Promise((resolve, reject) => {
            wrapped(snap).then((rs)=>{
                admin.firestore().collection('devices-topics').doc('test111').get().then((val) => {
                    if(val.exists){      
                        console.log('record tested', val.data())
                        resolve(val.data()['status']);
                    } else {
                        reject('not found')
                    }                
                })
            })
            
        })
        compare.then(result => {
            return assert.equal(result, 2)
        }).then(done, done);
    });

    it('Triggle when new device-topic deleted, case 1 (data invalid)', (done) => {
        console.log('testing Triggle when new device-topic delete, case 1 (token invalid)... ')
        
        const wrapped = test.wrap(myFunctions.onDeviceTopicDelete);
        const dataTest = require('./data/onDeviceTopicCreate/invalid.data.json')

        // Trước khi test chuyển status của record test về success (2)
        admin.firestore().collection('devices-topics').doc('test111').update({
            status: 2
        })

        const snap = test.firestore.makeDocumentSnapshot(dataTest, 'devices-topics/test111'); 
        const compare = new Promise((resolve, reject) => {
            wrapped(snap).then((rs)=>{
                admin.firestore().collection('devices-topics').doc('test111').get().then((val) => {
                    if(val.exists){      
                        console.log('record tested', val.data())
                        resolve(val.data()['status']);
                    } else {
                        reject('not found')
                    }                
                })
            })            
        })
        compare.then(result => {
            return assert.equal(result, 4)
        }).then(done, done);
    });

    it('Triggle when new device-topic deleted, case 2 (data valid)', (done) => {
        console.log('testing Triggle when new device-topic delete, case 1 (token invalid)... ')
        
        const wrapped = test.wrap(myFunctions.onDeviceTopicDelete);
        const dataTest = require('./data/onDeviceTopicCreate/valid.data.json')

        // Trước khi test chuyển status của record test về success (2)
        admin.firestore().collection('devices-topics').doc('test111').update({
            status: 2
        })

        const snap = test.firestore.makeDocumentSnapshot(dataTest, 'devices-topics/test111'); 
        const compare = new Promise((resolve, reject) => {
            wrapped(snap).then((rs)=>{
                admin.firestore().collection('devices-topics').doc('test111').get().then((val) => {
                    if(val.exists){      
                        console.log('record tested', val.data())
                        resolve(val.data()['status']);
                    } else {
                        reject('not found')
                    }                
                })
            })            
        })
        compare.then(result => {
            return assert.equal(result, 2)
        }).then(done, done);
    });
})
