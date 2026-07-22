import config from '../config';
import seoConfig from '../seo.config.json';

const DESCRIPTION_MAX_LENGTH = 160;

const stripMarkdown = (value = '') => value
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/^[\s>*#+\-|]+/gm, '')
  .replace(/[~*_]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const truncate = (value, maxLength = DESCRIPTION_MAX_LENGTH) => {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 100 ? lastSpace : maxLength - 1).trim()}…`;
};

export const normalizePage = (page = '') => page
  .replace(/^\.\//, '')
  .replace(/\.md$/i, '');

export const extractArticleTitle = (markdown = '', page = '') => {
  const heading = markdown.match(/^#{1,3}\s+(.+)$/m);
  if (heading) return stripMarkdown(heading[1]);

  const fileName = normalizePage(page).split('/').pop() || config.title;
  return fileName.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
};

export const extractArticleDescription = (markdown = '') => {
  const withoutFrontMatter = markdown.replace(/^---[\s\S]*?---\s*/, '');
  const blocks = withoutFrontMatter.split(/\n\s*\n/);
  const paragraph = blocks.find((block) => {
    const trimmed = block.trim();
    return trimmed &&
      !/^#{1,6}\s/.test(trimmed) &&
      !/^```/.test(trimmed) &&
      !/^[-*+]\s/.test(trimmed) &&
      !/^<svg/i.test(trimmed);
  });

  const description = stripMarkdown(paragraph || '');
  return description ? truncate(description) : seoConfig.defaultDescription;
};

export const getCanonicalUrl = (page = config.default) => {
  const baseUrl = seoConfig.siteUrl.replace(/\/$/, '');
  const normalizedPage = normalizePage(page);

  if (!normalizedPage || normalizedPage.toLowerCase() === normalizePage(config.default).toLowerCase()) {
    return `${baseUrl}/`;
  }

  return `${baseUrl}/?page=${encodeURIComponent(normalizedPage)}`;
};

const setMeta = (key, value, attribute = 'name') => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

const setCanonical = (url) => {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

const setStructuredData = ({ page, title, description, canonicalUrl, noIndex }) => {
  let script = document.head.querySelector('#seo-structured-data');
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-structured-data';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const normalizedPage = normalizePage(page);
  const isBlogPost = normalizedPage.startsWith('Blogs/');
  const pageType = isBlogPost ? 'BlogPosting' : normalizedPage === 'About' ? 'ProfilePage' : 'WebPage';
  const socialProfiles = Object.values(config.social || {}).filter(Boolean);

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${seoConfig.siteUrl.replace(/\/$/, '')}/#person`,
        name: seoConfig.author,
        url: seoConfig.siteUrl,
        sameAs: socialProfiles
      },
      {
        '@type': pageType,
        '@id': `${canonicalUrl}#page`,
        url: canonicalUrl,
        name: title,
        headline: isBlogPost ? title : undefined,
        description,
        inLanguage: seoConfig.language,
        author: { '@id': `${seoConfig.siteUrl.replace(/\/$/, '')}/#person` },
        mainEntity: pageType === 'ProfilePage'
          ? { '@id': `${seoConfig.siteUrl.replace(/\/$/, '')}/#person` }
          : undefined,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${seoConfig.siteUrl.replace(/\/$/, '')}/#website`,
          name: seoConfig.siteName,
          url: seoConfig.siteUrl
        }
      }
    ].filter(() => !noIndex)
  });
};

export const updateSeoMetadata = ({ page, markdown = '', noIndex = false, title: suppliedTitle }) => {
  const articleTitle = suppliedTitle || extractArticleTitle(markdown, page);
  const isHome = normalizePage(page).toLowerCase() === normalizePage(config.default).toLowerCase();
  const title = isHome ? seoConfig.siteName : `${articleTitle} | ${seoConfig.siteName}`;
  const description = markdown ? extractArticleDescription(markdown) : seoConfig.defaultDescription;
  const canonicalUrl = getCanonicalUrl(page);
  const imageUrl = new URL(seoConfig.defaultImage, seoConfig.siteUrl).toString();

  document.title = title;
  document.documentElement.lang = seoConfig.language;
  setCanonical(canonicalUrl);
  setMeta('description', description);
  setMeta('author', seoConfig.author);
  setMeta('keywords', seoConfig.keywords.join(', '));
  setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  setMeta('og:type', normalizePage(page).startsWith('Blogs/') ? 'article' : 'website', 'property');
  setMeta('og:site_name', seoConfig.siteName, 'property');
  setMeta('og:locale', seoConfig.locale, 'property');
  setMeta('og:title', title, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:url', canonicalUrl, 'property');
  setMeta('og:image', imageUrl, 'property');
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', imageUrl);
  setStructuredData({ page, title: articleTitle, description, canonicalUrl, noIndex });
};
