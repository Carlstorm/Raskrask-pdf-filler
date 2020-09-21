/* globals describe, expect, test */

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Pdf', () => {
  test('test', async () => {
    const result = await appTester(
      App.creates.RaskRask_pdf_filler.operation.perform,
    );
  });
});
