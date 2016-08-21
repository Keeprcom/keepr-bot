'use strict';

const MetaInspector = require('node-metainspector');
const Promise = require('bluebird');

module.exports = (url) => {
  const client = new MetaInspector(url, { timeout: 5000 });

  function metadata() {
    return new Promise((resolve, reject) => {
      client.on("error", function(err){
        if (err) {
          console.log(err);
          resolve({});
        }
      });

      client.on("fetch", () => {
        resolve(client);
      });

      client.fetch();
    });
  }

  return {
    metadata: metadata
  };

};
