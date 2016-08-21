'use strict';

const chai = require('chai');
const expect = chai.expect;

const sessions = require('../../app/services/sessions');

describe('Sessions', () => {
  it('should get a sessions', () => {
    const sessionId = sessions.findOrCreateSession('fbid');
    const theSessionId = sessions.findOrCreateSession('fbid');
    expect(sessionId).to.equal(theSessionId);
  });

});
