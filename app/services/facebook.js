'use strict';

const request = require('request-promise');

const config = require('../../config');

module.exports = {
  sendTextMessage: (sender, text) => {
    let messageData = {
      text: text
    }
    return request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: config.Facebook.token},
      method: 'POST',
      body: {
        recipient: {id: sender},
        message: messageData,
      }
    });
  }
};
