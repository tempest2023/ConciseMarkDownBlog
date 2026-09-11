# 1293. Shortest Path in a Grid with Obstacles Elimination

[Shortest Path in a Grid with Obstacles Elimination - LeetCode](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/)

You are given an `m x n` integer matrix `grid` where each cell is either `0` (empty) or `1` (obstacle). You can move up, down, left, or right from and to an empty cell in **one step**.

Return *the minimum number of **steps** to walk from the upper left corner* `(0, 0)` *to the lower right corner* `(m - 1, n - 1)` *given that you can eliminate **at most*** `k` *obstacles*. If it is not possible to find such walk return `-1`.

### Example

```
Input: grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1
Output: 6
Explanation:
The shortest path without eliminating any obstacle is 10.
The shortest path with one obstacle elimination at position (3,2) is 6. Such path is (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) ->(3,2) -> (4,2).
```

![https://assets.leetcode.com/uploads/2021/09/30/short1-grid.jpg](https://assets.leetcode.com/uploads/2021/09/30/short1-grid.jpg)

## Solution

Use bfs to explore from `(0,0)` with elimination `k`, which is state `(0,0,k)`

If the `grid[x][y]` is obstacle, eliminate it and push a new state to stack `(x, y, k-1)` if `k>0`

If it is a cell, push a new state to stack `(x, y, k)`

Maintain a visited set to record the visited sate `(i, j, k)`

If the `x,y` hits the destination `(m-1, n-1)`, return `depth`.

```python
class Solution:
    def shortestPath(self, grid: List[List[int]], k: int) -> int:
        directions = [(0,1),(-1,0),(1,0),(0,-1)]
        elimination = k
        m = len(grid)
        n = len(grid[0])
        q = [(0,0,elimination)]
        new_q = []
        visited = set()
        if(m+n-1<=k):
            return m+n-2
        depth = 1
        while(q):
            (i,j,k) = q.pop()
            for dx,dy in directions:
                x = i+dx
                y = j+dy
                if(x<0 or x>=m or y<0 or y>=n):
                    continue
                if(grid[x][y] == 1):
                    if(k>0 and (x,y,k-1) not in visited):
                        visited.add((x,y,k-1))
                        new_q.append((x,y,k-1))
                else:
                    if((x,y,k) not in visited):
                        if(x==m-1 and y == n-1):
                            return depth
                        visited.add((x,y,k))
                        new_q.append((x,y,k))
            if(not q):
                depth += 1
                q = new_q
                new_q = []

        return -1
```
