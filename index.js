const RaskRask_pdf = require('./creates/RaskRask_pdf.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  creates: { [RaskRask_pdf.key]: RaskRask_pdf },
};
