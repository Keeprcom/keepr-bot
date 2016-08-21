'use strict';

const _ = require('lodash');

const scraper = require('../services/scraper');

module.exports = {
  formatForFacebook: (response) => {
    const numbers = _.get(response, 'numbers', []);

    const newsWithUrls = _.filter(numbers, (tweet) => {
      return tweet.urls.length > 0;
    });

    const urls = newsWithUrls.map((e) => {
      const url = e.urls[0].expanded_url;
      const metadata = scraper(url);
      return metadata.metadata().then((meta) => {
        if (meta.image) {
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
        } else {
          return {};
        }
      });
    });

    return urls;
  }
}
