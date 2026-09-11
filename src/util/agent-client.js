const profile = require('../data/profile.json');
const catalog = require('../data/articles.json');
const { canonicalHref } = require('./routes');

// Only source links from the public context become clickable. Model output is untrusted.
const allowed = new Set(catalog.map(article => article.path));
function collectLinks (value) {
  if (typeof value === 'string' && /^(https:\/\/|mailto:|\/)/.test(value)) allowed.add(canonicalHref(value).split('#')[0]);
  else if (Array.isArray(value)) value.forEach(collectLinks);
  else if (value && typeof value === 'object') Object.values(value).forEach(collectLinks);
}
collectLinks(profile);
allowed.add(`mailto:${profile.contact.email}`);
function safeAgentHref (href) {
  if (typeof href !== 'string') return undefined;
  const normalized = canonicalHref(href);
  return allowed.has(normalized.split('#')[0]) ? normalized : undefined;
}
function conversationHistory (messages, question) {
  // Keep complete turns, not orphaned assistant replies; never send partial or failed output.
  const pairs = [];
  for (let i = 0; i < messages.length - 1; i++) {
    const user = messages[i]; const assistant = messages[i + 1];
    if (user.role === 'user' && assistant.role === 'assistant' && user.status === 'complete' && assistant.status === 'complete') {
      pairs.push([user, assistant].map(({ role, content }) => ({ role, content: content.slice(0, 2000) })));
      i++;
    }
  }
  const recent = pairs.slice(-3);
  const exceedsLimit = () => {
    const history = recent.flat();
    const characters = history.reduce((sum, message) => sum + message.content.length, question.length);
    const bytes = new TextEncoder().encode(JSON.stringify({ messages: [...history, { role: 'user', content: question }] })).length;
    return characters > 8000 || bytes > 18000;
  };
  while (recent.length && exceedsLimit()) recent.shift();
  return recent.flat();
}
module.exports = { conversationHistory, safeAgentHref };
