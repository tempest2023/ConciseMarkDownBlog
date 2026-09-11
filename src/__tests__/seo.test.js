import {
  extractArticleDescription,
  extractArticleTitle,
  getCanonicalUrl,
  normalizePage,
  updateSeoMetadata
} from '../util/seo';

describe('SEO utilities', () => {
  it('extracts article titles and plain-text descriptions from Markdown', () => {
    const markdown = '# Building an LLM Agent\n\nI build **reliable agents** with [tools](https://example.com).';

    expect(extractArticleTitle(markdown, 'Blogs/agent')).toBe('Building an LLM Agent');
    expect(extractArticleDescription(markdown)).toBe('I build reliable agents with tools.');
  });

  it('normalizes Markdown page names and creates stable canonical URLs', () => {
    expect(normalizePage('./Blogs/agent.md')).toBe('Blogs/agent');
    expect(getCanonicalUrl('About')).toBe('https://tempest.fun/');
    expect(getCanonicalUrl('Blogs/Deep Learning/agent.md')).toBe('https://tempest.fun/blog/deep-learning/agent/');
  });

  it('updates document metadata for an article', () => {
    updateSeoMetadata({
      page: 'Blogs/agent',
      markdown: '# Building an LLM Agent\n\nA practical guide to reliable tool use.'
    });

    expect(document.title).toBe("Building an LLM Agent | Tempest's Blog");
    expect(document.querySelector('meta[name="description"]').content).toBe('A practical guide to reliable tool use.');
    expect(document.querySelector('meta[property="og:type"]').content).toBe('article');
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://tempest.fun/blog/agent/');
    expect(document.querySelector('#seo-structured-data').textContent).toContain('BlogPosting');
  });
});
