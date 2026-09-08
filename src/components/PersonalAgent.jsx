import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { consumeChatStream } from '../util/chat-stream';
import { conversationHistory, safeAgentHref } from '../util/agent-client';
import '../styles/agent.css';

const suggestions = ['What AI systems has Tao built?', 'Tell me about his research.', 'What is his industry experience?', 'Is Tao open to new roles?'];
export default function PersonalAgent () {
  const [available, setAvailable] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const controller = useRef(null);
  const lastQuestion = useRef('');
  const input = useRef(null);
  const sequence = useRef(0);
  const transcript = useRef(null);
  const followReply = useRef(true);
  useEffect(() => {
    if (followReply.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [messages]);
  useEffect(() => {
    const status = new AbortController();
    fetch('/api/chat', { signal: status.signal }).then(response => response.ok ? response.json() : { available: false }).then(data => setAvailable(data.available === true)).catch(() => { if (!status.signal.aborted) setAvailable(false); });
    return () => { status.abort(); controller.current?.abort(); };
  }, []);

  async function ask (text, retry = false) {
    if (controller.current || !text.trim() || available !== true) return;
    const value = text.trim();
    const history = conversationHistory(messages, value);
    followReply.current = true;
    const id = ++sequence.current;
    const request = new AbortController();
    controller.current = request;
    lastQuestion.current = value;
    setQuestion(''); setError(''); setBusy(true);
    setMessages(previous => [...(retry ? previous.filter(message => message.status !== 'error' && message.status !== 'question') : previous), { id: `${id}-user`, role: 'user', content: value, status: 'question' }, { id, role: 'assistant', content: '', status: 'streaming' }]);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...history, { role: 'user', content: value }] }), signal: request.signal });
      await consumeChatStream(response, event => {
        if (event.type === 'delta') setMessages(previous => previous.map(message => message.id === id ? { ...message, content: message.content + event.text } : message));
      });
      setMessages(previous => previous.map(message => message.id === id || message.id === `${id}-user` ? { ...message, status: 'complete' } : message));
    } catch (problem) {
      setError(request.signal.aborted ? 'Reply stopped.' : problem.message);
      setMessages(previous => previous.map(message => message.id === id ? { ...message, status: 'error' } : message));
    } finally { controller.current = null; setBusy(false); }
  }

  return (
    <section className="personal-agent" aria-label="Ask Tempest">
      <div className="agent-heading"><span className="eyebrow">ASK TEMPEST</span><span className="agent-badge">AI guide</span></div>
      <h2>What would you like to know?</h2>
      <p className="agent-intro">Ask about my research, engineering work, or the stories behind my projects.</p>
      <div className="agent-suggestions">{suggestions.map(text => <button key={text} onClick={() => ask(text)} disabled={busy || available !== true}>{text}</button>)}</div>
      <div className="agent-transcript" ref={transcript} onScroll={event => { const area = event.currentTarget; followReply.current = area.scrollHeight - area.scrollTop - area.clientHeight < 64; }} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" tabIndex={messages.length ? 0 : undefined}>
        {messages.map(message => <div className={`agent-message ${message.role}`} key={message.id}><span className="message-role">{message.role === 'user' ? 'You' : 'Tempest’s AI guide'}</span><ReactMarkdown skipHtml transformLinkUri={safeAgentHref} components={{ img: () => null, a: ({ href, children }) => href ? <a href={href} rel="nofollow noreferrer">{children}</a> : <span>{children}</span> }}>{message.content || (message.status === 'streaming' ? 'Thinking…' : 'No reply received.')}</ReactMarkdown>{message.status === 'error' && message.content && <small>Incomplete reply</small>}</div>)}
      </div>
      {available === false && <p className="agent-notice" role="status">Chat is not available right now. <a href="/work/">Explore my work</a> or <a href="mailto:tar118@pitt.edu">contact me directly</a>.</p>}
      {error && <div className="agent-notice" role="alert">{error} {!busy && available && <button onClick={() => ask(lastQuestion.current, true)}>Retry</button>}</div>}
      <form onSubmit={event => { event.preventDefault(); ask(question); }}>
        <label htmlFor="agent-question">Your question</label>
        <textarea id="agent-question" ref={input} value={question} onChange={event => setQuestion(event.target.value)} maxLength={2000} rows={3} placeholder="Ask about Tao’s work…" disabled={available !== true} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); ask(question); } }} />
        <div className="agent-actions"><small>{available === null ? 'Connecting…' : `${question.length}/2,000 · Shift + Enter for a new line`}</small><div>{messages.length > 0 && <button type="button" disabled={busy} onClick={() => { setMessages([]); setError(''); input.current?.focus(); }}>New conversation</button>}{busy ? <button type="button" onClick={() => controller.current?.abort()}>Stop</button> : <button className="agent-send" type="submit" disabled={!question.trim() || available !== true}>Send ↗</button>}</div></div>
      </form>
      <p className="agent-privacy">Answers use public blog information and may be mistaken. Messages are sent to the AI provider; this blog does not save conversations. Avoid sharing private information. <a href="/ask/">About this guide</a></p>
    </section>
  );
}
