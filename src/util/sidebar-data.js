const catalog = require('../data/articles.json');
const counts = new Map();
catalog.filter(entry => entry.isPost).forEach(entry => counts.set(entry.category, (counts.get(entry.category) || 0) + 1));
// Lead with the current research focus; retain every topic and its real count.
const priority = name => ({ AI: 0, DeepLearning: 1 }[name] ?? 2);
const topics = [...counts].sort((a, b) => priority(a[0]) - priority(b[0]) || b[1] - a[1]).map(([name, count]) => ({ name, count, href: '/writing/#' + name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') }));
module.exports = { topics, postCount: catalog.filter(entry => entry.isPost).length };
