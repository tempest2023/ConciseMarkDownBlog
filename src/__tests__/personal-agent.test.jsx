/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import PersonalAgent from '../components/PersonalAgent';
import AgentDock from '../components/AgentDock';
import { consumeChatStream } from '../util/chat-stream';
import { TextEncoder } from 'util';

jest.mock('react-markdown', () => ({ __esModule: true, default: ({ children }) => <p>{children}</p> }));
jest.mock('../util/chat-stream', () => ({ consumeChatStream: jest.fn() }));
const originalFetch = global.fetch;
const originalTextEncoder = global.TextEncoder;
beforeAll(() => { global.TextEncoder = TextEncoder; });
afterAll(() => { global.TextEncoder = originalTextEncoder; });
beforeEach(() => {
  window.localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ available: true, model: 'test/model' }) });
  consumeChatStream.mockImplementation(async (_, emit) => { emit({ type: 'delta', text: 'A public answer.' }); emit({ type: 'done' }); });
});
afterEach(() => { global.fetch = originalFetch; });
async function ready (props = {}) {
  const view = render(<PersonalAgent {...props} />);
  await waitFor(() => expect(screen.getByLabelText('Your question')).toBeEnabled());
  return view;
}
test('unavailable status offers static alternatives and disables submission', async () => {
  global.fetch.mockResolvedValue({ ok: false });
  render(<PersonalAgent />);
  expect(await screen.findByRole('status')).toHaveTextContent('Chat is not available');
  expect(screen.getByRole('link', { name: 'Explore Tempest’s work' })).toHaveAttribute('href', '/work/');
  expect(screen.getByLabelText('Your question')).toBeDisabled();
});
test('a suggested question sends one request, renders the reply and supports a clean new conversation', async () => {
  const view = await ready({ newChatRequest: 0 });
  expect(screen.getByPlaceholderText('Ask about Tempest’s work…')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: "What's new in Tempest research papers lately?" })).toBeInTheDocument();
  expect(screen.queryByText('Complete chats are saved only in this browser.')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about Tempest’s research.' }));
  expect(await screen.findByText('A public answer.')).toBeInTheDocument();
  expect(screen.getByText('Saber (AI Agent)')).toBeInTheDocument();
  expect(document.querySelector('.agent-message-avatar img')).toHaveAttribute('src', '/assets/agent-avatar/focused.png');
  expect(document.querySelector('.agent-message-avatar img')).not.toHaveAttribute('width');
  expect(document.querySelector('.agent-message-avatar img')).not.toHaveAttribute('height');
  expect(screen.queryByText('1 question')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Ask Tempest')).toHaveClass('is-chatting');
  expect(screen.getByText('Model · test/model')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(JSON.parse(global.fetch.mock.calls[1][1].body).messages).toEqual([{ role: 'user', content: 'Tell me about Tempest’s research.' }]);
  await waitFor(() => expect(JSON.parse(window.localStorage.getItem('ask-tempest:messages:v1'))).toHaveLength(2));
  view.rerender(<PersonalAgent newChatRequest={1} />);
  expect(screen.queryByText('A public answer.')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Ask Tempest')).toHaveClass('is-onboarding');
  expect(window.localStorage.getItem('ask-tempest:messages:v1')).toBeNull();
  expect(screen.getByLabelText('Your question')).toHaveFocus();
});
test('the configured default model remains visible with an older availability response', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ available: true }) });
  await ready();
  expect(screen.getByText('Model · inception/mercury-2.5')).toBeInTheDocument();
});
test('the configured primary and backup models are both visible', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ available: true, model: 'inception/mercury-2.5', fallbackModels: ['alibaba/qwen3.8-flash'] }) });
  await ready();
  expect(screen.getByText('Model · inception/mercury-2.5 · Backup · alibaba/qwen3.8-flash')).toBeInTheDocument();
});
test('the displayed model follows the model actually selected for the reply and survives refresh', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ available: true, model: 'inception/mercury-2.5', fallbackModels: ['alibaba/qwen3.8-flash'] }) });
  consumeChatStream.mockImplementationOnce(async (_, emit) => {
    emit({ type: 'delta', text: 'A fallback answer.' });
    emit({ type: 'model', model: 'alibaba/qwen3.8-flash' });
    emit({ type: 'done' });
  });
  const view = await ready();
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about Tempest’s research.' }));
  expect(await screen.findByText('Model · alibaba/qwen3.8-flash · Fallback')).toBeInTheDocument();
  await waitFor(() => expect(JSON.parse(window.localStorage.getItem('ask-tempest:messages:v1'))[1].model).toBe('alibaba/qwen3.8-flash'));
  view.unmount();
  await ready();
  expect(screen.getByText('Model · alibaba/qwen3.8-flash · Fallback')).toBeInTheDocument();
});
test('complete local conversation history is restored after a refresh', async () => {
  window.localStorage.setItem('ask-tempest:messages:v1', JSON.stringify([
    { role: 'user', content: 'A saved question' },
    { role: 'assistant', content: 'A saved answer' }
  ]));
  await ready();
  expect(screen.getByText('A saved question')).toBeInTheDocument();
  expect(screen.getByText('A saved answer')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Continue the conversation…')).toBeInTheDocument();
  expect(screen.getByLabelText('Ask Tempest')).toHaveClass('is-chatting');
});
test('streaming never rereads or rewrites retained history and completion saves once', async () => {
  window.localStorage.setItem('ask-tempest:messages:v1', JSON.stringify(Array.from({ length: 40 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: 'x'.repeat(2000) }))));
  let emit;
  let finish;
  consumeChatStream.mockImplementationOnce((_, onEvent) => {
    emit = onEvent;
    return new Promise(resolve => { finish = resolve; });
  });
  const view = await ready();
  const reads = jest.spyOn(Storage.prototype, 'getItem');
  const writes = jest.spyOn(Storage.prototype, 'setItem');
  try {
    fireEvent.change(screen.getByLabelText('Your question'), { target: { value: 'Tell me about Tempest’s research.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(emit).toBeDefined());
    for (const text of ['A ', 'streamed ', 'answer.']) {
      await act(async () => { emit({ type: 'delta', text }); });
    }
    expect(reads).not.toHaveBeenCalled();
    expect(writes).not.toHaveBeenCalled();
    await act(async () => { emit({ type: 'done' }); finish(); });
    expect(writes).toHaveBeenCalledTimes(1);
    const saved = JSON.parse(writes.mock.calls[0][1]);
    expect(saved).toHaveLength(40);
    expect(saved[39].content).toBe('A streamed answer.');
    fireEvent.change(screen.getByLabelText('Your question'), { target: { value: 'Another question' } });
    expect(reads).not.toHaveBeenCalled();
    expect(writes).toHaveBeenCalledTimes(1);
    view.rerender(<PersonalAgent newChatRequest={1} />);
    expect(window.localStorage.getItem('ask-tempest:messages:v1')).toBeNull();
  } finally { reads.mockRestore(); writes.mockRestore(); }
});
test.each([
  'Chat is busy. Please wait a minute before trying again, or explore the public profile.',
  'The chat limit has been reached. Please try later or contact Tempest directly.',
  'The selected model is not available for this AI Gateway key. Check Gateway credits or choose another model.'
])('preserves actionable endpoint guidance: %s', async message => {
  consumeChatStream.mockRejectedValueOnce(new Error(message));
  await ready();
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about Tempest’s research.' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(message);
});
test('failed replies can be retried without duplicate questions', async () => {
  consumeChatStream.mockRejectedValueOnce(new Error('Temporary failure'));
  await ready();
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about Tempest’s research.' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Saber is busy right now. Please try again in a moment.');
  expect(screen.queryByText('Temporary failure')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByText('A public answer.')).toBeInTheDocument();
  expect(screen.getAllByText('Tell me about Tempest’s research.')).toHaveLength(2); // suggestion + one message
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
test('retrying an older failure sends its own question and preserves other turns', async () => {
  consumeChatStream.mockRejectedValueOnce(new Error('First failure')).mockRejectedValueOnce(new Error('Second failure'));
  await ready();
  const send = async text => {
    fireEvent.change(screen.getByLabelText('Your question'), { target: { value: text } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument());
  };
  await send('First question');
  await send('Second question');
  await send('Third question');
  const firstFailure = screen.getAllByRole('alert')[0];
  fireEvent.click(within(firstFailure).getByRole('button', { name: 'Try again' }));
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument());
  const requestMessages = JSON.parse(global.fetch.mock.calls[4][1].body).messages;
  expect(requestMessages).toEqual([
    { role: 'user', content: 'Third question' },
    { role: 'assistant', content: 'A public answer.' },
    { role: 'user', content: 'First question' }
  ]);
  expect(screen.getAllByText('First question')).toHaveLength(1);
  expect(screen.getByText('Second question')).toBeInTheDocument();
  expect(screen.getByText('Third question')).toBeInTheDocument();
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  const saved = JSON.parse(window.localStorage.getItem('ask-tempest:messages:v1'));
  expect(saved.filter(message => message.role === 'user').map(message => message.content)).toEqual(['Third question', 'First question']);
});
test('Stop aborts the request and restores usable controls', async () => {
  await ready();
  global.fetch.mockImplementation((_, options) => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')))));
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about Tempest’s research.' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Stop' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Reply stopped. You can try again whenever you’re ready.');
  expect(global.fetch.mock.calls[1][1].signal.aborted).toBe(true);
  expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
});
test('Enter submits but Shift+Enter and IME composition do not', async () => {
  await ready();
  const input = screen.getByLabelText('Your question');
  fireEvent.change(input, { target: { value: '研究经历' } });
  fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  expect(global.fetch).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(await screen.findByText('A public answer.')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('the avatar-only companion keeps the current chat when its dialog is closed and reopened', async () => {
  window.localStorage.setItem('ask-tempest:messages:v1', JSON.stringify([
    { role: 'user', content: 'A saved question' },
    { role: 'assistant', content: 'A saved answer' }
  ]));
  render(<AgentDock />);
  const dialog = document.querySelector('dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => {
    dialog.removeAttribute('open');
    fireEvent(dialog, new Event('close'));
  };
  expect(document.querySelector('.agent-dock')).toHaveClass('agent-dock--above-config');
  expect(document.querySelector('.companion-avatar')).toHaveAttribute('data-state', 'idle');
  expect(document.querySelectorAll('.companion-avatar-image')).toHaveLength(4);
  expect(document.querySelector('.companion-bubble')).not.toBeInTheDocument();
  expect(document.querySelector('.companion-chat-icon')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open Ask Tempest' }));
  expect(dialog).toHaveAttribute('open');
  expect(await screen.findByText('A saved answer')).toBeInTheDocument();
  expect(dialog).toHaveClass('agent-dialog--chatting');
  fireEvent.click(screen.getByRole('button', { name: 'Close conversation' }));
  expect(dialog).not.toHaveAttribute('open');
  fireEvent.click(screen.getByRole('button', { name: 'Open Ask Tempest' }));
  expect(dialog).toHaveAttribute('open');
  expect(screen.getByText('A saved answer')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'New chat' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'New chat' }));
  expect(dialog).not.toHaveClass('agent-dialog--chatting');
});
