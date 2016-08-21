'use strict';

const chai = require('chai');
const expect = chai.expect;

const fbFormatter = require('../../app/helpers/facebookFormatter');
const pokemonGoFixture = require('../fixtures/pokemon-go');
const noImageFixture = require('../fixtures/urls-with-no-image');

describe('Facebook Formatter', () => {
  it('should fetch the metadata correctly', () => {
    const result = fbFormatter.formatForFacebook(pokemonGoFixture);
    expect(result).to.have.length(8);
  });
  
  it('should not return image', () => {
    const result = fbFormatter.formatForFacebook(noImageFixture);
    expect(result).to.have.length(1);
  });
});
