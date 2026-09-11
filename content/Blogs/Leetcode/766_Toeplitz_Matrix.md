# 766. Toeplitz Matrix

[Toeplitz Matrix - LeetCode](https://leetcode.com/problems/toeplitz-matrix/)

Given an `m x n` `matrix`, return *`true` if the matrix is Toeplitz. Otherwise, return `false`.*

A matrix is **Toeplitz** if every diagonal from top-left to bottom-right has the same elements.

### Example

![https://assets.leetcode.com/uploads/2020/11/04/ex1.jpg](https://assets.leetcode.com/uploads/2020/11/04/ex1.jpg)

```
Input: matrix = [[1,2,3,4],[5,1,2,3],[9,5,1,2]]
Output: true
Explanation:
In the above grid, the diagonals are:
"[9]", "[5, 5]", "[1, 1, 1]", "[2, 2, 2]", "[3, 3]", "[4]".
In each diagonal all elements are the same, so the answer is True.
```

## Solution

```python
class Solution:
    def isToeplitzMatrix(self, matrix: List[List[int]]) -> bool:
        m = len(matrix)
        n = len(matrix[0])
        for i in range(m):
            for j in range(n):
                if(i>0 and j>0 and matrix[i][j] != matrix[i-1][j-1]):
                    return False
        return True
```

Time Complexity: $O(m*n)$

Space Complexity: $O(1)$