// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');
const functions = require('firebase-functions');

exports.jiraNlp = functions.https.onRequest((request, response) => {
    console.log(request.body.queryResult)
    const parameters = request.body.queryResult.parameters;
    const ticket_number = parameters['any'];
    const jira_type = parameters['jira_type'];

    process.env.DEBUG = 'dialogflow:debug';
    getDataFromJira(jira_type, ticket_number, response);

    function getDataFromJira(jira_type, ticket_number, response) {
        axios({
            method: "get",
            //url:"http://northwind.servicestack.net/customers.json"
            //url:"http://jira.moatads.com:8080/api/"+jira_type+"/"+ticket_number
            url: "http://ec2-34-237-124-252.compute-1.amazonaws.com:3300/api/"+jira_type+"/"+ticket_number
        }).then(function (resp) {
            console.log("resp once " + JSON.stringify(resp.data));
            var finalResult = "The " + jira_type + " of the ticket " + ticket_number + " is :" + resp.data.status;
            response.setHeader('Content-Type', 'applicaiton/json');
            response.send(JSON.stringify({ "fulfillmentText": finalResult }));
        }).catch(function (error) {
            response.send(JSON.stringify({ "fulfillmentText": error.message + "--" }));
        });
    }
});

