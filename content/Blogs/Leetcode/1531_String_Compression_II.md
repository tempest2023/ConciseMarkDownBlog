# 1531. String Compression II

[String Compression II - LeetCode](https://leetcode.com/problems/string-compression-ii/)

[Run-length encoding](http://en.wikipedia.org/wiki/Run-length_encoding) is a string compression method that works by replacing consecutive identical characters (repeated 2 or more times) with the concatenation of the character and the number marking the count of the characters (length of the run). For example, to compress the string `"aabccc"` we replace `"aa"` by `"a2"` and replace `"ccc"` by `"c3"`. Thus the compressed string becomes `"a2bc3"`.

Notice that in this problem, we are not adding `'1'` after single characters.

Given a string `s` and an integer `k`. You need to delete **at most** `k` characters from `s` such that the run-length encoded version of `s` has minimum length.

Find the *minimum length of the run-length encoded version of* `s` *after deleting at most* `k` *characters*.

**Example 1:**

```
Input: s = "aaabcccd", k = 2
Output: 4
Explanation:Compressing s without deleting anything will give us "a3bc3d" of length 6. 
Deleting any of the characters 'a' or 'c' would at most decrease the length of the compressed string to 5, 
for instance delete 2 'a' then we will have s = "abcccd" which compressed is abc3d. 
Therefore, the optimal way is to delete 'b' and 'd', 
then the compressed version of s will be "a3c3" of length 4.
```

**Example 2:**

```
Input: s = "aabbaa", k = 2
Output: 2
Explanation:If we delete both 'b' characters, the resulting compressed string would be "a4" of length 2.

```

**Example 3:**

```
Input: s = "aaaaaaaaaaa", k = 0
Output: 3
Explanation:Since k is zero, we cannot delete anything. The compressed string is "a11" of length 3.

```

**Constraints:**

- `1 <= s.length <= 100`
- `0 <= k <= s.length`
- `s` contains only lowercase English letters.

## Solution

Using **DFS** to get the min compressed string length.

$dp[i][k]$ can not represent the min length for `s[0:i]` with deleting at most k, because it does not show which chars we delete in `s[0:i]`

It needs four parameters to determine one state: `i`, `prev`, `prev_count`, `k`

For each incoming char, we have two choice:

- Delete
    - if k is not enough to delete, the result is inf means not a valid result.
    - otherwise, continue until we iterate all chars in s
- Keep
    - if prev  == s[i], we merge the incoming char to our last part, check the prev_count to determine the compressed length: ‘’ → ‘a’, ‘a’→’a2’, ‘a9’ → ‘a10’, ‘a99’ → ‘a100’, the max of s is 100, so don’t worry about ‘a999’
    - If prev ≠ s[i], we already compute the compressed length of the last part by +1 to $keep$ in iterations, set the new char to $prev$ and set the count as 1.

What we need to do is return the min of keep and delete, and the dfs will lead the min length of s with at most k deletion.

```python
class Solution:
    def getLengthOfOptimalCompression(self, s: str, k: int) -> int:
        n = len(s)
        memo = defaultdict(int)
        
        '''
        The compressed string length for s[0:i] with deleting at most k chars
        prev: last character
        prev_count: the count of last character
        prev and prev_count can decide the compressed string length if we choose want to keep the coming char or delete it.
        '''
        def helper(i, prev, prev_count, k):
            # invalid k
            if(k<0):
                return math.inf
            if(i==n):
                return 0
            # in memeo
            if((i,prev, prev_count, k) in memo):
                return memo[(i,prev, prev_count, k)]
            # if choose to delete the next char, k-=1 and i+1, prev and prev_count won't change
            delete = helper(i+1, prev, prev_count, k-1)
            # print(f'delete {s[i]}: {s[0:i]}, k:{k} {delete}')
            
            # keep it for the same next char
            if(prev == s[i]):
                keep = helper(i+1, prev, prev_count+1,k)
                # keep one more same char will lead one more length in compressed string, like a -> aa (a->a2), aaaaaaaaa -> aaaaaaaaaa (a9 -> a10)
                # under this situation, the length needs to be added by 1
                if(prev_count in [1, 9, 99]):
                    keep += 1
            else:
                # the next char is not as same as the previous one
                # set new prev and prev_count for this, and add 1 on length (for this new char)
                keep = helper(i+1, s[i], 1, k) + 1
            # print(f'keep {s[i]}: {s[0:i]}, k:{k}, {keep}')
            # store memo
            memo[(i,prev, prev_count, k)] = min(keep, delete)
            # print(f'set dp {(i,prev, prev_count, k)}, {memo[(i,prev, prev_count, k)]}')
            return memo[(i,prev, prev_count, k)]

        return helper(0, "", 0, k)
```