/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 15:21:40
 * @modify date 2022-09-02 17:16:37
 * @desc format link
 */
// describe how to format a link.
export function formatLink (link) {
  return `?page=${link}`;
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
