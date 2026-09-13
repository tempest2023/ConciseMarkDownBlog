const historyKey = 'ask-tempest:conversations:v2';
const legacyHistoryKey = 'ask-tempest:messages:v1';
const maxConversations = 20;

function completedMessages (messages) {
  const saved = [];
  for (let index = 0; index < messages.length - 1; index++) {
    const user = messages[index];
    const assistant = messages[index + 1];
    if (user.role === 'user' && assistant.role === 'assistant' && user.status === 'complete' && assistant.status === 'complete' && user.content.trim() && assistant.content.trim()) {
      saved.push({ role: 'user', content: user.content.slice(0, 2000) }, { role: 'assistant', content: assistant.content.slice(0, 2000), ...(assistant.model ? { model: assistant.model.slice(0, 160) } : {}) });
      index++;
    }
  }
  return saved.slice(-40);
}

function restoreMessages (value, conversationId) {
  if (!Array.isArray(value)) return [];
  const messages = value.slice(-40).map(message => {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim()) return { role: 'invalid' };
    return { role: message.role, content: message.content.slice(0, 2000), status: 'complete', ...(message.role === 'assistant' && typeof message.model === 'string' ? { model: message.model.slice(0, 160) } : {}) };
  });
  return completedMessages(messages).map((message, index) => ({ ...message, id: `${conversationId}-saved-${index}`, status: 'complete' }));
}

function loadConversations () {
  const empty = { conversations: [], activeId: null };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(historyKey);
    if (raw !== null) {
      const saved = JSON.parse(raw);
      if (saved?.version !== 2 || !Array.isArray(saved.conversations)) return empty;
      const ids = new Set();
      const conversations = saved.conversations.slice(0, maxConversations).flatMap(item => {
        if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 160 || ids.has(item.id)) return [];
        ids.add(item.id);
        const messages = restoreMessages(item.messages, item.id);
        if (!messages.length) return [];
        return [{ id: item.id, updatedAt: Number.isFinite(item.updatedAt) ? item.updatedAt : 0, messages }];
      });
      const activeId = saved.activeId === null ? null : conversations.find(item => item.id === saved.activeId)?.id || conversations[0]?.id || null;
      return { conversations, activeId };
    }
    const messages = restoreMessages(JSON.parse(window.localStorage.getItem(legacyHistoryKey)), 'imported-chat');
    return messages.length ? { conversations: [{ id: 'imported-chat', updatedAt: Date.now(), messages }], activeId: 'imported-chat' } : empty;
  } catch { return empty; }
}

function serializeConversations (conversations, activeId) {
  const saved = conversations.map(item => ({ id: item.id, updatedAt: item.updatedAt, messages: completedMessages(item.messages) })).filter(item => item.messages.length).slice(0, maxConversations);
  return JSON.stringify({ version: 2, activeId: saved.some(item => item.id === activeId) ? activeId : null, conversations: saved });
}

function conversationTitle (conversation) {
  return conversation.messages.find(message => message.role === 'user')?.content.slice(0, 80) || 'New conversation';
}

module.exports = { historyKey, legacyHistoryKey, maxConversations, loadConversations, serializeConversations, conversationTitle };
