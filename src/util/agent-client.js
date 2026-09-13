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
// Preserve actionable public endpoint guidance, but never display arbitrary network/provider errors.
const publicFailures = new Set([
  'Chat is busy. Please wait a minute before trying again, or explore the public profile.',
  'The chat limit has been reached. Please try later or contact Tempest directly.',
  'The selected model is not available for this AI Gateway key. Check Gateway credits or choose another model.',
  'Chat is not available right now. Please explore the public profile or contact Tempest directly.',
  'Please start a new conversation or shorten your question.',
  'Each message must be plain text, up to 2,000 characters.'
]);
function friendlyAgentError (error) {
  return publicFailures.has(error?.message) ? error.message : 'Saber is busy right now. Please try again in a moment.';
}
module.exports = { conversationHistory, safeAgentHref, friendlyAgentError };
