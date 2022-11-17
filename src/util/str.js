/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 15:57:02
 * @modify date 2022-11-16 16:37:14
 * @desc [description]
 */
export function compareLowerCase (a, b) {
  if (!(a && b)) {
    return a === b
  }
  return a.toLocaleLowerCase() === b.toLocaleLowerCase();
}

export function getInfoByChildren (children) {
  if (!children) {
    return null;
  }
  if (Array.isArray(children) && children.length > 0) {
    return children[0];
  }
  return '';
}
