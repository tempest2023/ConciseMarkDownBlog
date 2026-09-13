import test from 'node:test';
import assert from 'node:assert/strict';
import history from '../src/util/agent-history.js';

const { historyKey, legacyHistoryKey, loadConversations, serializeConversations } = history;
const pair = [{ role: 'user', content: 'Research?', status: 'complete' }, { role: 'assistant', content: 'A research answer.', model: 'backup/model', status: 'complete' }];
function storage(t, values) {
  const before = globalThis.window;
  globalThis.window = { localStorage: { getItem: key => values[key] ?? null } };
  t.after(() => { if (before === undefined) delete globalThis.window; else globalThis.window = before; });
}

test('legacy history imports complete pairs without mutating browser storage', t => {
  storage(t, { [legacyHistoryKey]: JSON.stringify([...pair, { role: 'user', content: 'Unanswered question' }]) });
  const saved = loadConversations();
  assert.equal(saved.activeId, saved.conversations[0].id);
  assert.equal(saved.conversations[0].messages.length, 2);
  assert.equal(saved.conversations[0].messages[1].model, 'backup/model');
});

test('multi-chat serialization excludes failures, bounds history and restores selection', t => {
  const conversations = Array.from({ length: 22 }, (_, index) => ({ id: `chat-${index}`, updatedAt: index, messages: [...Array.from({ length: 22 }, () => pair).flat(), { role: 'user', content: 'Failed', status: 'question' }, { role: 'assistant', content: 'Private error', status: 'error' }] }));
  const serialized = serializeConversations(conversations, 'chat-4');
  assert.ok(!serialized.includes('Private error'));
  storage(t, { [historyKey]: serialized });
  const saved = loadConversations();
  assert.equal(saved.activeId, 'chat-4');
  assert.equal(saved.conversations.length, 20);
  assert.equal(saved.conversations[0].messages.length, 40);
});

test('empty selection and deletion survive reload without resurrecting legacy history', t => {
  storage(t, { [historyKey]: serializeConversations([], null), [legacyHistoryKey]: JSON.stringify(pair) });
  assert.deepEqual(loadConversations(), { conversations: [], activeId: null });
});

test('malformed storage and duplicate identities cannot corrupt the selected conversation', t => {
  const values = { [historyKey]: '{invalid' };
  storage(t, values);
  assert.deepEqual(loadConversations(), { conversations: [], activeId: null });
  values[historyKey] = JSON.stringify({ version: 2, activeId: 'missing', conversations: [{ id: 'valid', messages: pair }, { id: 'valid', messages: pair }, { id: 'invalid', messages: [null, {}] }] });
  assert.equal(loadConversations().conversations.length, 1);
  assert.equal(loadConversations().activeId, 'valid');
});
