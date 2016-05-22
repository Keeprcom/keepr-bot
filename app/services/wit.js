'use strict';

module.exports = {
  actions: {
    say: (sessionId, context, message, cb) => {
      console.log('here');
      cb();
    },
    merge: (sessionId, context, entities, message, cb) => {
      cb(context);
    },
    error: (sessionId, context, err) => {
      console.log(err.message);
    }
  }
};
