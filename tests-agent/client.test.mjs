import test from 'node:test';
import assert from 'node:assert/strict';
import client from '../src/util/agent-client.js';
import agent from '../server/personal-agent.cjs';
const { conversationHistory, safeAgentHref } = client;
test('only known public links become clickable, never model-supplied tracking destinations', () => {
  assert.equal(safeAgentHref('/work/'), '/work/');
  assert.equal(safeAgentHref('/?page=Work#fineedit'), '/work/#fineedit');
  assert.equal(safeAgentHref('https://github.com/tempest2023'), 'https://github.com/tempest2023');
  assert.equal(safeAgentHref('mailto:tar118@pitt.edu'), 'mailto:tar118@pitt.edu');
  for (const href of ['https://evil.example/track', '//evil.example', 'javascript:alert(1)', '/work/?tracking=secret', 'https://github.com/tempest2023?leak=secret', undefined]) assert.equal(safeAgentHref(href), undefined);
});
test('history excludes failed turns, trims long replies and stays valid after many rounds', () => {
  const messages = [];
  for (let i = 0; i < 10; i++) {
    messages.push({ role: 'user', content: `question ${i}`, status: 'complete' });
    messages.push({ role: 'assistant', content: 'x'.repeat(3000), status: 'complete' });
  }
  messages.push({ role: 'user', content: 'failed question', status: 'question' }, { role: 'assistant', content: 'failed reply', status: 'error' });
  const question = '中'.repeat(2000);
  const history = conversationHistory(messages, question);
  assert.equal(history[0].role, 'user');
  assert.equal(history.at(-1).role, 'assistant');
  assert.equal(history.length, 4);
  assert.ok(history.every(message => !message.content.includes('failed') && message.content.length <= 2000));
  assert.doesNotThrow(() => agent.validateMessages({ messages: [...history, { role: 'user', content: question }] }));
  const chinese = messages.map(message => ({ ...message, content: '中'.repeat(2000) }));
  const chineseRequest = { messages: [...conversationHistory(chinese, question), { role: 'user', content: question }] };
  assert.ok(Buffer.byteLength(JSON.stringify(chineseRequest)) <= agent.limits.bodyBytes);
  assert.doesNotThrow(() => agent.validateMessages(chineseRequest));
});
