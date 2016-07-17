'use strict';

const request = require('request-promise');

const config = require('../../config');
const scraper = require('./scraper');

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
    const url = text;

    const metadata = scraper(url);
    return metadata.metadata().then((meta) => {
      let messageData = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Test',
                image_url: meta.image,
                subtitle: 'test',
                buttons: []
              }
            ]
          }
        }
      };

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
    });
  }
};
