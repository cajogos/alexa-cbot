'use strict';
var Alexa = require('alexa-sdk');
var https = require('https');

var APP_ID = undefined;
var SKILL_NAME = "cBot";
var STOP_MESSAGE = "Goodbye!";

var CBOT_SAY = 'seebot';

exports.handler = function(event, context, callback)
{
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};

var handlers = {
	'LaunchRequest': function()
	{
		this.emit('StartIntent');
	},
	'StartIntent': function()
	{
		var speechOutput = 'Hello there, I am ' + CBOT_SAY + ' how may I help?';
		var reprompt = 'Do not fear ' + CBOT_SAY + ' is here!';
		this.emit(':ask', speechOutput, reprompt);
	},
	'GetBitcoinValueIntent': function()
	{
		// var currency = this.event.request.intent.slots.currency;
		var req = https.request({
			host: 'carlos.fyi',
			port: 443,
			path: '/api/cbot.php?method=bitcoinValue',
			method: 'GET'
		},
		res => {
			res.setEncoding('utf8');

			var returnData = '';
			res.on('data', chunk => {
				returnData = returnData + chunk;
			});

			res.on('end', () => {
				var bitcoinValue = JSON.parse(returnData).values.USD;
				var speechOutput = 'A bitcoin is worth ' + bitcoinValue + ' dollars';
				var cardTitle = SKILL_NAME + ' Bitcoin Value';
				this.emit(':tellWithCard', speechOutput, cardTitle, speechOutput);
			});
		});
		req.end();
	},
	'AMAZON.HelpIntent': function ()
	{
		var HELP_MESSAGE = 'I am ' + CBOT_SAY + ' and I can help you with many things. I am also always learning new things!';
		var HELP_REPROMPT = "What can I help you with?";
		var speechOutput = HELP_MESSAGE;
		var reprompt = HELP_REPROMPT;
		this.emit(':ask', speechOutput, reprompt);
	},
	'AMAZON.CancelIntent': function ()
	{
		this.emit(':tell', STOP_MESSAGE);
	},
	'AMAZON.StopIntent': function ()
	{
		this.emit(':tell', STOP_MESSAGE);
	}
};