const assert = require('assert');
const whatsappService = require('../src/services/whatsappService');

function assertSelection(rawPayload, expected) {
  const actual = whatsappService.extractInteractiveSelectionId(rawPayload);
  assert.strictEqual(actual, expected, `Expected ${expected} but got ${actual} from ${JSON.stringify(rawPayload)}`);
}

assertSelection({ interactiveResponseMessage: { nativeFlowResponseMessage: { paramsJson: '{"selected_id":".alive"}' } } }, '.alive');
assertSelection({ interactiveResponseMessage: { nativeFlowResponseMessage: { paramsJson: '{"button":{"id":".menu1"}}' } } }, '.menu1');
assertSelection({ listResponseMessage: { singleSelectReply: { selectedRowId: '.vv' } } }, '.vv');
assertSelection({ buttonsResponseMessage: { selectedButtonId: '.testbutton' } }, '.testbutton');

const matched = whatsappService.matchInteractiveCommand('.alive');
assert.ok(matched && matched.trigger === '.alive');

console.log('interactive selection parsing regression checks passed');
