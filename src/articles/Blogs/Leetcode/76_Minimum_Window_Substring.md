# 76. Minimum Window Substring

[Minimum Window Substring - LeetCode](https://leetcode.com/problems/minimum-window-substring/)

Given two strings `s` and `t` of lengths `m` and `n` respectively, return *the **minimum window*** ***substring** of* `s` *such that every character in* `t` *(**including duplicates**) is included in the window*. If there is no such substring, return *the empty string* `""`.

The testcases will be generated such that the answer is **unique**.

**Example 1:**

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.

```

**Example 2:**

```
Input: s = "a", t = "a"
Output: "a"
Explanation: The entire string s is the minimum window.

```

**Example 3:**

```
Input: s = "a", t = "aa"
Output: ""
Explanation: Both 'a's from t must be included in the window.
Since the largest window of s only has one 'a', return empty string.

```

**Constraints:**

- `m == s.length`
- `n == t.length`
- `1 <= m, n <= 105`
- `s` and `t` consist of uppercase and lowercase English letters.

**Follow up:** Could you find an algorithm that runs in `O(m + n)` time?

## Solution

### 1. Sliding Window

1. We start with two pointers, *left* and *right* initially pointing to the first element of the string S*S*.
2. We use the *right* pointer to expand the window until we get a desirable window i.e. a window that contains all of the characters of T*T*.
3. Once we have a window with all the characters, we can move the left pointer ahead one by one. If the window is still a desirable one we keep on updating the minimum window size.
4. If the window is not desirable any more, we repeat *step*2 onwards

```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        m = len(s)
        n = len(t)
        
        def convert_word2dict(word):
            word_fre = {}
            for c in word:
                fre = word_fre.get(c, 0)
                fre += 1
                word_fre[c] = fre
            # print('convertword2dict', word, word_fre)
            return word_fre
        
        def include(a, b):
            for key in b.keys():
                if(key not in a or b[key]>a[key]):
                    return False
            return True
        
        l = 0
        r = 1
        t_obj = convert_word2dict(t)
        found = False
        # print(t_obj)
        min_window_len = m
        min_window = s
        window = defaultdict(int)
        while(r<=m):
            window[s[r-1]]+=1
            # window = convert_word2dict(s[l:r]) # include l, not include r
            while(l<r and include(window, t_obj)):
                found = True
                # print('include', s[l:r], window, include(window, t_obj))
                if(min_window_len>r-l):
                    min_window_len = r-l
                    min_window = s[l:r]
                window[s[l]]-=1
                l += 1
            else:
                r += 1
        if not found:
            return ""
        return min_window
```

- Time Complexity: $O(|S| + |T|)$ where |S| and |T| represent the lengths of strings S and T. In the worst case we might end up visiting every element of string S twice, once by left pointer and once by right pointer. |T| represents the length of string T.
- Space Complexity: $O(|S| + |T|)$. |S| when the window size is equal to the entire string S. |T| when T has all unique characters.

### 2. Optimized Sliding window

We notices that  there are lots of characters are not necessary to contain T. Obviously we can skip it. We count the (index, char) for S only for the characters shown in T. And at this time we won’t add $l$ and $r$ by 1, rather than moving them to next index in our counter, which means we skip the irrelevant characters. The calculation of length won’t be effected by these skips because we have the indices of both ends.

```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        m = len(s)
        n = len(t)
        
        def convert_word2dict(word):
            word_fre = {}
            for c in word:
                fre = word_fre.get(c, 0)
                fre += 1
                word_fre[c] = fre
            # print('convertword2dict', word, word_fre)
            return word_fre
        
        def include(a, b):
            for key in b.keys():
                if(key not in a or b[key]>a[key]):
                    return False
            return True
        
        l = 0
        r = 0
        t_obj = convert_word2dict(t)
        
        # optimized skip in indices
        optimized_skip = []
        for i in range(m):
            if(s[i] in t_obj):
                optimized_skip.append((i, s[i]))

        # print(t_obj)
        min_window_len = m
        min_window = s
        window = defaultdict(int)
        found = False
        
        while(r<len(optimized_skip)):
            c = optimized_skip[r][1]
            r_ind = optimized_skip[r][0] + 1 # add 1 to apply to slice
            # skip the middle irrelevant chars
            window[c] += 1
            # print(f'add {c} to window')
            # window = convert_word2dict(s[l_ind:r_ind]) # include l, not include r
            while(l<=r and include(window, t_obj)):
                found = True
                prev_c = optimized_skip[l][1]
                l_ind = optimized_skip[l][0]
                if(min_window_len>r_ind-l_ind):
                    min_window_len = r_ind - l_ind
                    min_window = s[l_ind:r_ind]
                # skip the irrelevantt chars
                window[prev_c] -= 1
                l+=1
                # print(f'move {prev_c} out of window')
            r+=1
        if(not found):
            return ""
        return min_window
```