/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 15:21:40
 * @modify date 2022-09-02 23:33:03
 * @desc format link
 */
// describe how to format a link.
export function formatLink (link) {
  return `?page=${link}`;
}

// convert page to relative path of the articles
export function formatPage (page) {
  if (!page) return '';
  let path = page;
  // if the tail is not .md, add it.
  if (!page.match(/\.md$/)) {
    path = page + '.md';
  }
  // if the head is not ./, add it.
  if (!page.match(/^\.\//)) {
    path = './' + path;
  }
  return path;
}

export function getUrlParameters () {
  const query = window.location.search.substring(1);
  const params = {}
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    params[pair[0]] = pair[1];
  }
  return params;
}

export function openUrl (url) {
  // [TODO] check if the url is the same domain, if not, open in new tab,
  // otherwise open in same tab.
  window.location.href = url;
}
