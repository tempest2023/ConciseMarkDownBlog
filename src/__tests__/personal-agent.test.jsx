/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalAgent from '../components/PersonalAgent';
import AgentDock from '../components/AgentDock';
import { consumeChatStream } from '../util/chat-stream';

jest.mock('react-markdown', () => ({ __esModule: true, default: ({ children }) => <p>{children}</p> }));
jest.mock('../util/chat-stream', () => ({ consumeChatStream: jest.fn() }));
const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ available: true }) });
  consumeChatStream.mockImplementation(async (_, emit) => { emit({ type: 'delta', text: 'A public answer.' }); emit({ type: 'done' }); });
});
afterEach(() => { global.fetch = originalFetch; });
async function ready () {
  render(<PersonalAgent />);
  await waitFor(() => expect(screen.getByLabelText('Your question')).toBeEnabled());
}
test('unavailable status offers static alternatives and disables submission', async () => {
  global.fetch.mockResolvedValue({ ok: false });
  render(<PersonalAgent />);
  expect(await screen.findByRole('status')).toHaveTextContent('Chat is not available');
  expect(screen.getByRole('link', { name: 'Explore my work' })).toHaveAttribute('href', '/work/');
  expect(screen.getByLabelText('Your question')).toBeDisabled();
});
test('a suggested question sends one request, renders the reply and supports a clean new conversation', async () => {
  await ready();
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about his research.' }));
  expect(await screen.findByText('A public answer.')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Stop' })).not.toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(JSON.parse(global.fetch.mock.calls[1][1].body).messages).toEqual([{ role: 'user', content: 'Tell me about his research.' }]);
  fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
  expect(screen.queryByText('A public answer.')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Your question')).toHaveFocus();
});
test('failed replies can be retried without duplicate questions', async () => {
  consumeChatStream.mockRejectedValueOnce(new Error('Temporary failure'));
  await ready();
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about his research.' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Temporary failure');
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(await screen.findByText('A public answer.')).toBeInTheDocument();
  expect(screen.getAllByText('Tell me about his research.')).toHaveLength(2); // suggestion + one message
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
test('Stop aborts the request and restores usable controls', async () => {
  await ready();
  global.fetch.mockImplementation((_, options) => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')))));
  fireEvent.click(screen.getByRole('button', { name: 'Tell me about his research.' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Stop' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Reply stopped.');
  expect(global.fetch.mock.calls[1][1].signal.aborted).toBe(true);
  expect(screen.getByRole('button', { name: 'Retry' })).toBeEnabled();
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

test('the avatar-only companion opens and closes the window-sized conversation dialog', async () => {
  render(<AgentDock />);
  const dialog = document.querySelector('dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => {
    dialog.removeAttribute('open');
    fireEvent(dialog, new Event('close'));
  };
  expect(document.querySelector('.companion-avatar')).toHaveAttribute('data-state', 'idle');
  expect(document.querySelectorAll('.companion-avatar-image')).toHaveLength(4);
  expect(document.querySelector('.companion-bubble')).not.toBeInTheDocument();
  expect(document.querySelector('.companion-chat-icon')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open Ask Tempest' }));
  expect(dialog).toHaveAttribute('open');
  fireEvent.click(screen.getByRole('button', { name: 'Close conversation' }));
  expect(dialog).not.toHaveAttribute('open');
});
