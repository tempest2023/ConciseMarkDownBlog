# 204. Count Primes

[Count Primes - LeetCode](https://leetcode.com/problems/count-primes/)

Given an integer `n`, return *the number of prime numbers that are strictly less than* `n`.

**Example 1:**

```
Input: n = 10
Output: 4
Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.
```

**Example 2:**

```
Input: n = 0
Output: 0
```

**Example 3:**

```
Input: n = 1
Output: 0
```

**Constraints:**

- `0 <= n <= 5 * 106`

## Solution

Use Sieve of Eratosthenes to sieve primes, find all composite numbers.

Every marking starts from $start^2$ to $n$, and skip all even numbers except 2.

```python
class Solution:
    def countPrimes(self, n: int) -> int:
        if(n<=2):
            return 0
        res = [1]*n
        res[0] = 0
        res[1] = 0
        start = 2
        
        while(start*start<n):
            if(res[start] == 1):
                for j in range(start*start, n, start):
                    res[j] = 0
            start += 1 if start == 2 else 2
        return sum(res)
```