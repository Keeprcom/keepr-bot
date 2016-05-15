'use strict';

module.exports = {
  actions: {
    say: (sessionId, context, message, cb) => {
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
