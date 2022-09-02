/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 15:57:02
 * @modify date 2022-09-02 17:09:44
 * @desc [description]
 */
export function compareLowerCase (a, b) {
  if (!(a && b)) {
    return a === b
  }
  return a.toLocaleLowerCase() === b.toLocaleLowerCase();
}
