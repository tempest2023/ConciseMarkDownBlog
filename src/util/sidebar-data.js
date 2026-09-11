const catalog = require('../data/articles.json');
const counts = new Map();
catalog.filter(entry => entry.isPost).forEach(entry => counts.set(entry.category, (counts.get(entry.category) || 0) + 1));
const topics = [...counts].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, href: '/writing/#' + name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') }));
module.exports = { topics, postCount: catalog.filter(entry => entry.isPost).length };
