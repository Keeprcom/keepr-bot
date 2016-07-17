'use strict';

const chai = require('chai');
const expect = chai.expect;

const scraper = require('../../app/services/scraper');

describe('Scraper', () => {
  it('should get image thumbnail', (done) => {
    const metadata = scraper('http://www.elmundotoday.com/2016/07/barack-obama-admite-ahora-que-visito-espana-para-capturar-a-snorlax-en-pokemon-go/');

    metadata.metadata().then((meta) => {
      expect(meta.image).to.equal('http://i0.wp.com/emtstatic.com/2016/07/rajoysnorlax.jpg?fit=559%2C352');
      done();
    });
  });

  it('should get image thumbnail from youtube', (done) => {
    const metadata = scraper('https://youtu.be/TE438jWkcE0');

    metadata.metadata().then((meta) => {
      expect(meta.image).to.equal('https://i.ytimg.com/vi/TE438jWkcE0/maxresdefault.jpg');
      done();
    });
  });
});
