### [820. Short Encoding of Words](https://leetcode.com/problems/short-encoding-of-words/)

A valid encoding of an array of words is any reference string s and array of indices indices such that:

- `words.length == indices.length`
- The reference string s ends with the '#' character.
- For each index indices[i], the substring of s starting from indices[i] and up to (but not including) the next '#' character is equal to words[i].

Given an array of words, return the length of the shortest reference string s possible of any valid encoding of words.

#### Example 1:
```shell
Input: words = ["time", "me", "bell"]
Output: 10
Explanation: A valid encoding would be s = "time#bell#" and indices = [0, 2, 5].
words[0] = "time", the substring of s starting from indices[0] = 0 to the next '#' is underlined in "time#bell#"
words[1] = "me", the substring of s starting from indices[1] = 2 to the next '#' is underlined in "time#bell#"
words[2] = "bell", the substring of s starting from indices[2] = 5 to the next '#' is underlined in "time#bell#"
```

#### Example 2:
```shell
Input: words = ["t"]
Output: 2
Explanation: A valid encoding would be s = "t#" and indices = [0].
```

#### Constraints:

- 1 <= words.length <= 2000
- 1 <= words[i].length <= 7
- words[i] consists of only lowercase letters.

--------------

### Solution

We can see that the shortest reference string is because there are some words can be included by other words.

For example, we can get the shortest reference string for ["time","bell"] which is "time#bell#".

The index array doesn't matter.

If there is a new word "me", the reference string is still "time#bell#" because obviously "time" include "me".

If there is a new word "tell", the reference string needs to be changed to "time#bell#tell#" because "bell" does not include "tell".

So what we need to do is generating a hashmap based on all words' suffix.
For ["time", "me", "bell"], we generate a hashmap like this

```javascript
{
//  "time": 1, don't add this
	"ime": 1,
	"me": 1,
	"e": 1,
//  "bell":1, don't add this
	"ell": 1,
	"ll": 1,
	"l": 1,
}
```
We won't add these entire words to this hashmap, so that when we find word[i] not in the hashmap, we can add this word[i] to reference string. And if we find a word[i] is in the hashmap, which means it is included by other word, which means we don't need to add reference string for it.

By the way, we need to remove duplicates words. Or after adding word[i] to reference string, we need to add this word[i] to hashmap to avoid dupliciates.

```python
class Solution:
    def minimumLengthEncoding(self, words: List[str]) -> int:
        words = list(set(words))
        words.sort(key=len, reverse=True)
        hashmap = defaultdict(bool)
        # for each word, generate suffix hashmap, but don't include the entire word
        # so that if the entire word occurs in the hashmap, we know it is included by other words.
        for word in words:
            for j in range(1, len(word)):
                key = word[j:]+'#'
                hashmap[key] = True
        
        s = ""
        # iterate all words to generate reference string
        for word in words:
            key = word+"#"
            # its ref str is included by other word
            if(key in hashmap):
                continue
            s+=word+"#"
        
        return len(s)
```

Original Link: [820. Short Encoding of Words](https://leetcode.com/problems/short-encoding-of-words/discuss/2176545/python-use-suffix-hashmap-to-skip-extra-ref-faster-than-90)