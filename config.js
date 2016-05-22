'use strict';

module.exports = {
  server: {
    port: process.env.PORT || 3000
  },
  Facebook: {
    pageId: process.env.FB_PAGE_ID || '',
    verifyToken: process.env.VERIFY_TOKEN || '',
    pageToken: process.env.PAGE_TOKEN || ''
  },
  Wit: {
    serverToken: process.env.WIT_TOKEN || ''
  }
}
