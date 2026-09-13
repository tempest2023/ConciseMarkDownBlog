import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { consumeChatStream } from '../util/chat-stream';
import { conversationHistory, safeAgentHref, friendlyAgentError } from '../util/agent-client';
import { historyKey, legacyHistoryKey, loadConversations, serializeConversations, maxConversations } from '../util/agent-history';
import ConversationSidebar from './ConversationSidebar';
import '../styles/agent.css';

const defaultModel = 'inception/mercury-2.5';
const suggestions = ['What AI systems has Tempest built?', 'Tell me about Tempest’s research.', 'What is Tempest’s industry experience?', "What's new in Tempest research papers lately?"];
const emptyMessages = [];

export default function PersonalAgent ({ newChatRequest = 0, onConversationChange }) {
  const [initialHistory] = useState(loadConversations);
  const [conversations, setConversations] = useState(initialHistory.conversations);
  const [activeId, setActiveId] = useState(initialHistory.activeId);
  const [chatting, setChatting] = useState(initialHistory.conversations.length > 0);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(min-width: 48rem)').matches === true);
  const [available, setAvailable] = useState(null);
  const [primaryModel, setPrimaryModel] = useState(defaultModel);
  const [fallbackModels, setFallbackModels] = useState([]);
  const messages = conversations.find(item => item.id === activeId)?.messages || emptyMessages;
  const model = [...messages].reverse().find(message => message.role === 'assistant' && message.model)?.model || primaryModel;
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const controller = useRef(null);
  const persistedHistory = useRef(null);
  const input = useRef(null);
  const sequence = useRef(0);
  const transcript = useRef(null);
  const followReply = useRef(true);
  const lastNewChatRequest = useRef(newChatRequest);
  function setMessages (update, conversationId = activeId) {
    setConversations(previous => previous.map(item => item.id === conversationId ? { ...item, messages: update(item.messages) } : item));
  }
  function persistHistory (items, selectedId) {
    const serialized = serializeConversations(items, selectedId);
    if (serialized === persistedHistory.current) return;
    try {
      window.localStorage.setItem(historyKey, serialized);
      // Retire the legacy copy only after the replacement is safely written.
      window.localStorage.removeItem(legacyHistoryKey);
      persistedHistory.current = serialized;
    } catch {}
  }

  useLayoutEffect(() => { onConversationChange?.(chatting); }, [chatting, onConversationChange]);
  useEffect(() => {
    if (followReply.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [messages]);
  useEffect(() => {
    // Streaming changes only the unfinished turn. Keep storage off that render path.
    if (!busy) persistHistory(conversations, activeId);
  }, [conversations, activeId, busy]);
  useEffect(() => {
    const status = new AbortController();
    fetch('/api/chat', { signal: status.signal }).then(response => response.ok ? response.json() : { available: false }).then(data => {
      const configuredPrimary = typeof data.model === 'string' && data.model ? data.model : defaultModel;
      const configuredFallbacks = Array.isArray(data.fallbackModels) ? data.fallbackModels.filter(name => typeof name === 'string' && name) : [];
      setAvailable(data.available === true);
      setPrimaryModel(configuredPrimary);
      setFallbackModels(configuredFallbacks);
    }).catch(() => { if (!status.signal.aborted) setAvailable(false); });
    return () => { status.abort(); controller.current?.abort(); };
  }, []);
  useEffect(() => {
    if (lastNewChatRequest.current === newChatRequest) return;
    lastNewChatRequest.current = newChatRequest;
    stopActiveRequest();
    setActiveId(null);
    setQuestion('');
    closeMobileSidebar();
    input.current?.focus();
  }, [newChatRequest]);

  function stopActiveRequest () {
    const previous = controller.current;
    controller.current = null;
    previous?.abort();
    setBusy(false);
    setMessages(current => current.map(message => message.status === 'streaming' ? { ...message, content: 'Reply stopped. You can try again whenever you’re ready.', status: 'error' } : message));
  }

  function closeMobileSidebar () {
    if (window.matchMedia?.('(max-width: 47.999rem)').matches) setSidebarOpen(false);
  }

  function selectConversation (id) {
    if (id !== activeId) {
      stopActiveRequest();
      setActiveId(id);
      setQuestion('');
      followReply.current = true;
    }
    closeMobileSidebar();
    input.current?.focus();
  }

  function deleteConversation (id) {
    const remaining = conversations.filter(item => item.id !== id);
    const nextActiveId = id === activeId ? remaining[0]?.id || null : activeId;
    if (id === activeId) {
      stopActiveRequest();
      setActiveId(nextActiveId);
      setQuestion('');
    }
    setConversations(previous => previous.filter(item => item.id !== id));
    persistHistory(remaining, nextActiveId);
  }

  async function ask (text, retryMessageId = null) {
    if (controller.current || !text.trim() || available !== true) return;
    const retryIndex = retryMessageId === null ? -1 : messages.findIndex(message => message.id === retryMessageId && message.status === 'error');
    const retryQuestion = retryIndex > 0 ? messages[retryIndex - 1] : null;
    if (retryMessageId !== null && retryQuestion?.role !== 'user') return;
    const value = text.trim();
    const history = conversationHistory(messages, value);
    followReply.current = true;
    const id = ++sequence.current;
    const request = new AbortController();
    controller.current = request;
    const conversationId = activeId || `chat-${Date.now()}-${id}`;
    if (!activeId) {
      setActiveId(conversationId);
      setConversations(previous => [{ id: conversationId, updatedAt: Date.now(), messages: [] }, ...previous]);
    } else {
      setConversations(previous => [{ ...previous.find(item => item.id === activeId), updatedAt: Date.now() }, ...previous.filter(item => item.id !== activeId)]);
    }
    setChatting(true);
    setQuestion(''); setBusy(true);
    setMessages(previous => [...previous.filter(message => message.id !== retryMessageId && message.id !== retryQuestion?.id), { id: `${id}-user`, role: 'user', content: value, status: 'question' }, { id, role: 'assistant', content: '', status: 'streaming', model: primaryModel }], conversationId);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...history, { role: 'user', content: value }] }), signal: request.signal });
      await consumeChatStream(response, event => {
        if (controller.current !== request) return;
        if (event.type === 'delta') setMessages(previous => previous.map(message => message.id === id ? { ...message, content: message.content + event.text } : message), conversationId);
        if (event.type === 'model' && typeof event.model === 'string') {
          setMessages(previous => previous.map(message => message.id === id ? { ...message, model: event.model } : message), conversationId);
        }
      });
      if (controller.current !== request) return;
      setMessages(previous => previous.map(message => message.id === id || message.id === `${id}-user` ? { ...message, status: 'complete' } : message), conversationId);
      setConversations(previous => previous.slice(0, maxConversations));
    } catch (error) {
      if (controller.current !== request) return;
      const friendlyReply = request.signal.aborted ? 'Reply stopped. You can try again whenever you’re ready.' : friendlyAgentError(error);
      setMessages(previous => previous.map(message => message.id === id ? { ...message, content: friendlyReply, status: 'error' } : message), conversationId);
    } finally { if (controller.current === request) { controller.current = null; setBusy(false); } }
  }

  return (
    <section className={`personal-agent ${chatting ? 'is-chatting' : 'is-onboarding'}`} aria-label="Ask Tempest">
      {chatting && <ConversationSidebar conversations={conversations} activeId={activeId} open={sidebarOpen} onToggle={() => setSidebarOpen(value => !value)} onSelect={selectConversation} onDelete={deleteConversation} />}
      <div className="agent-conversation-panel">
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
            <div className="agent-transcript" ref={transcript} onScroll={event => { const area = event.currentTarget; followReply.current = area.scrollHeight - area.scrollTop - area.clientHeight < 64; }} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" tabIndex={chatting ? 0 : -1}>
              {!messages.length && <div className="agent-empty-chat"><span className="eyebrow">A NEW CONVERSATION</span><h2>What’s on your mind?</h2><p>Ask Saber about Tempest’s work, or pick up a conversation from your history.</p><button type="button" onClick={() => ask(suggestions[0])} disabled={available !== true}>{suggestions[0]}</button></div>}
              {messages.map((message, index) => <div className={`agent-message ${message.role}`} key={message.id} role={message.status === 'error' ? 'alert' : undefined}>
                {message.role === 'assistant' && <span className="agent-message-avatar" aria-hidden="true"><img src="/assets/agent-avatar/focused.png" alt="" draggable="false" /></span>}
                <span className="message-role">{message.role === 'user' ? 'You' : 'Saber (AI Agent)'}</span>
                <div className="message-content"><ReactMarkdown skipHtml transformLinkUri={safeAgentHref} components={{ img: () => null, a: ({ href, children }) => href ? <a href={href} rel="nofollow noreferrer">{children}</a> : <span>{children}</span> }}>{message.content || (message.status === 'streaming' ? 'Thinking…' : 'Saber is busy right now. Please try again in a moment.')}</ReactMarkdown>{message.status === 'error' && !busy && messages[index - 1]?.role === 'user' && <button type="button" className="agent-message-retry" onClick={() => ask(messages[index - 1].content, message.id)}>Try again</button>}</div>
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
              <small>{available === null ? 'Connecting…' : `Model · ${model}${fallbackModels.includes(model) ? ' · Fallback' : fallbackModels.length ? ` · Backup · ${fallbackModels.join(' → ')}` : ''}`}</small>
              {busy ? <button type="button" onClick={() => controller.current?.abort()}>Stop</button> : <button className="agent-send" type="submit" disabled={!question.trim() || available !== true} aria-label="Send message">Send ↗</button>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

PersonalAgent.propTypes = { newChatRequest: PropTypes.number, onConversationChange: PropTypes.func };
