'use strict';

const request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');

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
  sendTextMessage: (sender, elements) => {
    console.log(elements);
    if (_.isString(elements)) {
      return request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: config.Facebook.pageToken},
        method: 'POST',
        body: {
          recipient: {id: sender},
          message: {
            text: elements
          },
        },
        json: true
      });
    }

    let urls = elements.map((e) => {
      const url = e.urls[0].expanded_url;
      const metadata = scraper(url);
      return metadata.metadata().then((meta) => {
        return {
          title: meta.title,
          image_url: meta.image,
          subtitle: meta.description,
          buttons: [{
            type: 'web_url',
            url: url,
            title: 'View Article'
          }]
        }
      });
    });

    /*
    urls = urls.filter((e) => {
      return !_.isEmpty(e.image_url);
    });
    */

    return Promise.all(urls).then((values) => {
      console.log('Sending...');
      console.log(values);
      let messageData = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: values
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
