import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { consumeChatStream } from '../util/chat-stream';
import { conversationHistory, safeAgentHref } from '../util/agent-client';
import '../styles/agent.css';

const defaultModel = 'zai/glm-5.3-flash';
const suggestions = ['What AI systems has Tempest built?', 'Tell me about Tempest’s research.', 'What is Tempest’s industry experience?', "What's new in Tempest research papers lately?"];
const storageKey = 'ask-tempest:messages:v1';

function storedMessages () {
  if (typeof window === 'undefined') return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    if (!Array.isArray(saved)) return [];
    return saved.slice(-40).flatMap((message, index) => {
      if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim()) return [];
      return [{ id: `saved-${index}`, role: message.role, content: message.content.slice(0, 2000), status: 'complete' }];
    });
  } catch { return []; }
}

function completeConversation (messages) {
  const saved = [];
  for (let index = 0; index < messages.length - 1; index++) {
    const user = messages[index];
    const assistant = messages[index + 1];
    if (user.role === 'user' && assistant.role === 'assistant' && user.status === 'complete' && assistant.status === 'complete' && user.content.trim() && assistant.content.trim()) {
      saved.push({ role: 'user', content: user.content.slice(0, 2000) }, { role: 'assistant', content: assistant.content.slice(0, 2000) });
      index++;
    }
  }
  return saved.slice(-40);
}

export default function PersonalAgent ({ newChatRequest = 0, onConversationChange }) {
  const [available, setAvailable] = useState(null);
  const [model, setModel] = useState(defaultModel);
  const [messages, setMessages] = useState(storedMessages);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const controller = useRef(null);
  const lastQuestion = useRef('');
  const input = useRef(null);
  const sequence = useRef(0);
  const transcript = useRef(null);
  const followReply = useRef(true);
  const lastNewChatRequest = useRef(newChatRequest);
  const chatting = messages.length > 0;

  useLayoutEffect(() => { onConversationChange?.(chatting); }, [chatting, onConversationChange]);
  useEffect(() => {
    if (followReply.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [messages]);
  useEffect(() => {
    const saved = completeConversation(messages);
    try {
      if (saved.length) window.localStorage.setItem(storageKey, JSON.stringify(saved));
      else window.localStorage.removeItem(storageKey);
    } catch {}
  }, [messages]);
  useEffect(() => {
    const status = new AbortController();
    fetch('/api/chat', { signal: status.signal }).then(response => response.ok ? response.json() : { available: false }).then(data => {
      setAvailable(data.available === true);
      setModel(typeof data.model === 'string' && data.model ? data.model : defaultModel);
    }).catch(() => { if (!status.signal.aborted) setAvailable(false); });
    return () => { status.abort(); controller.current?.abort(); };
  }, []);
  useEffect(() => {
    if (lastNewChatRequest.current === newChatRequest) return;
    lastNewChatRequest.current = newChatRequest;
    controller.current?.abort();
    setMessages([]);
    try { window.localStorage.removeItem(storageKey); } catch {}
    input.current?.focus();
  }, [newChatRequest]);

  async function ask (text, retry = false) {
    if (controller.current || !text.trim() || available !== true) return;
    const value = text.trim();
    const history = conversationHistory(messages, value);
    followReply.current = true;
    const id = ++sequence.current;
    const request = new AbortController();
    controller.current = request;
    lastQuestion.current = value;
    setQuestion(''); setBusy(true);
    setMessages(previous => [...(retry ? previous.filter(message => message.status !== 'error' && message.status !== 'question') : previous), { id: `${id}-user`, role: 'user', content: value, status: 'question' }, { id, role: 'assistant', content: '', status: 'streaming' }]);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...history, { role: 'user', content: value }] }), signal: request.signal });
      await consumeChatStream(response, event => {
        if (event.type === 'delta') setMessages(previous => previous.map(message => message.id === id ? { ...message, content: message.content + event.text } : message));
      });
      setMessages(previous => previous.map(message => message.id === id || message.id === `${id}-user` ? { ...message, status: 'complete' } : message));
    } catch {
      const friendlyReply = request.signal.aborted ? 'Reply stopped. You can try again whenever you’re ready.' : 'Saber is busy right now. Please try again in a moment.';
      setMessages(previous => previous.map(message => message.id === id ? { ...message, content: friendlyReply, status: 'error' } : message));
    } finally { controller.current = null; setBusy(false); }
  }

  return (
    <section className={`personal-agent ${chatting ? 'is-chatting' : 'is-onboarding'}`} aria-label="Ask Tempest">
      <div className="agent-stage">
        <div className="agent-onboarding" aria-hidden={chatting}>
          <div className="agent-onboarding-copy">
            <div className="agent-heading"><span className="eyebrow">ASK TEMPEST</span><span className="agent-badge">AI guide</span></div>
            <h2>What would you like to know?</h2>
            <p className="agent-intro">Ask about Tempest’s research, engineering work, or the stories behind Tempest’s projects.</p>
          </div>
          <div className="agent-suggestions" aria-label="Suggested questions">{suggestions.map(text => <button key={text} onClick={() => ask(text)} disabled={busy || available !== true} tabIndex={chatting ? -1 : undefined}>{text}</button>)}</div>
        </div>

        <div className="agent-chat" aria-hidden={!chatting}>
          <div className="agent-chat-toolbar">
            <span>{messages.filter(message => message.role === 'user').length} {messages.filter(message => message.role === 'user').length === 1 ? 'question' : 'questions'}</span>
          </div>
          <div className="agent-transcript" ref={transcript} onScroll={event => { const area = event.currentTarget; followReply.current = area.scrollHeight - area.scrollTop - area.clientHeight < 64; }} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" tabIndex={chatting ? 0 : -1}>
            {messages.map(message => <div className={`agent-message ${message.role}`} key={message.id} role={message.status === 'error' ? 'alert' : undefined}>
              {message.role === 'assistant' && <img className="agent-message-avatar" src="/assets/agent-avatar/focused.png" alt="" width="64" height="64" draggable="false" />}
              <span className="message-role">{message.role === 'user' ? 'You' : 'Saber (AI Agent)'}</span>
              <div className="message-content"><ReactMarkdown skipHtml transformLinkUri={safeAgentHref} components={{ img: () => null, a: ({ href, children }) => href ? <a href={href} rel="nofollow noreferrer">{children}</a> : <span>{children}</span> }}>{message.content || (message.status === 'streaming' ? 'Thinking…' : 'Saber is busy right now. Please try again in a moment.')}</ReactMarkdown>{message.status === 'error' && !busy && <button type="button" className="agent-message-retry" onClick={() => ask(lastQuestion.current, true)}>Try again</button>}</div>
            </div>)}
          </div>
        </div>
      </div>

      <div className="agent-composer-area">
        {available === false && <p className="agent-notice" role="status">Chat is not available right now. <a href="/work/">Explore Tempest’s work</a> or <a href="mailto:tar118@pitt.edu">contact Tempest directly</a>.</p>}
        <form onSubmit={event => { event.preventDefault(); ask(question); }}>
          <label htmlFor="agent-question">Your question</label>
          <textarea id="agent-question" ref={input} value={question} onChange={event => setQuestion(event.target.value)} maxLength={2000} rows={1} placeholder={chatting ? 'Continue the conversation…' : 'Ask about Tempest’s work…'} disabled={available !== true} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); ask(question); } }} />
          <div className="agent-actions">
            <small>{available === null ? 'Connecting…' : `Model · ${model}`}</small>
            {busy ? <button type="button" onClick={() => controller.current?.abort()}>Stop</button> : <button className="agent-send" type="submit" disabled={!question.trim() || available !== true} aria-label="Send message">Send ↗</button>}
          </div>
        </form>
      </div>
    </section>
  );
}

PersonalAgent.propTypes = { newChatRequest: PropTypes.number, onConversationChange: PropTypes.func };
