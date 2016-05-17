'use strict';

const request = require('request-promise');

module.exports = {
  latestNews: () => {
    const options = {
      uri: 'http://keepr.herokuapp.com/latest',
      json: true
    };

    return request(options);
  },

  latestNewsByKeyword: (keyword) => {
    const options = {
      uri: `http://keepr.herokuapp.com/ask/${keyword}`,
      json: true
    };

    return request(options);
  }
};
