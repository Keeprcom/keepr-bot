'use strict';

const request = require('request-promise');

const config = require('../../config');

module.exports = {
  getFirstMessagingEntry: (body) => {
    const val = body.object == 'page' &&
      body.entry &&
      Array.isArray(body.entry) &&
      body.entry.length > 0 &&
      body.entry[0] &&
      body.entry[0].id == config.Facebook.pageId &&
      body.entry[0].messaging &&
      Array.isArray(body.entry[0].messaging) &&
      body.entry[0].messaging.length > 0 &&
      body.entry[0].messaging[0]
      ;
    return val || null;
  },
  sendTextMessage: (sender, text) => {
    let messageData = {
      text: text
    }
    return request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: config.Facebook.pageToken},
      method: 'POST',
      body: {
        recipient: {id: sender},
        message: messageData,
      },
      json: true
    });
  }
};
