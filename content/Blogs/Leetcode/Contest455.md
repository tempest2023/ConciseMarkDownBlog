## Contest 455
> Date: Jun 21-23 2025

## Q1
easy, skip

# Q2
## 3592. Inverse Coin Change

> https://leetcode.com/problems/inverse-coin-change/description/

You are given a 1-indexed integer array numWays, where numWays[i] represents the number of ways to select a total amount i using an infinite supply of some fixed coin denominations. Each denomination is a positive integer with value at most numWays.length.

However, the exact coin denominations have been lost. Your task is to recover the set of denominations that could have resulted in the given numWays array.

Return a sorted array containing unique integers which represents this set of denominations.

If no such set exists, return an empty array.

Example 1:

Input: numWays = [0,1,0,2,0,3,0,4,0,5]

Output: [2,4,6]

Example 2:
Input: numWays = [1,2,2,3,4]

Output: [1,2,5]

Example 3:

Input: numWays = [1,2,3,4,15]

Output: []

Explanation:

No set of denomination satisfies this array.

Constraints:

1 <= numWays.length <= 100
0 <= numWays[i] <= 2 * 10**8

### Solution
This is a variant based on classic coin change problem: https://www.geeksforgeeks.org/dsa/coin-change-dp-7/
Coin change problem is a form of knapsack problem, a clasic 2D DP problem.
We use a 2D array dp[i][j] to save our bottom-up DP(Tabulation), it means the count ways we have if we use `i`-first coin denominations to sum up amount `j`.

> The idea is to fill the DP table based on previous values. For each coin, we either include it or exclude it to compute the minimum number of coins needed for each sum. The table is filled in an iterative manner from i = 1 to i = n and for each sum from 0 to sum. 
>
> The dynamic programming relation is as follows: 
> 
> - if (sum-coins[i-1]) > 0, then dp[i][sum] = dp[i][sum-coins[i-1]] + dp[i+1][sum]. 
> - else dp[i][sum] = dp[i+1][sum].

And we can optimize the space usage to 1D.
> In previous approach of dynamic programming we have derive the relation between states as given below:
>
> - if (sum-coins[i]) > 0, then dp[i][sum] = dp[i][sum-coins[i]] + dp[i+1][sum].
> - else dp[i][sum] = dp[i+1][sum].

> If we observe that for calculating current dp[i][sum] state we only need previous row dp[i-1][sum] or current row dp[i][sum-coins[i]]. There is no need to store all the previous states just one previous state is used to compute result.

For this question, we start from empty denominations assumption, and add the coin as a new denomination when our current count ways doesn't satisify the given count ways, until we finish the loop or we met conflict.

```python
class Solution:
    def count(self, coins: List[int], amount: int) -> int:
        n = len(coins)
        dp = [0] * (amount + 1)
        dp[0] = 1
        for i in range(n):
            for j in range(coins[i], amount + 1):
                dp[j] += dp[j - coins[i]]
        return dp[amount]
    def findCoins(self, numWays: List[int]) -> List[int]:
        n = len(numWays)
        denos = []
        for coin in range(1,n+1):
            ways = numWays[coin-1]
            if len(denos) == 0:
                if ways == 1:
                    denos.append(coin)
                    continue
                elif ways == 0:
                    continue
                else:
                    return []
            way_cal = self.count(denos, coin)
            if way_cal == ways - 1:
                denos.append(coin)
            elif way_cal == ways:
                continue
            else:
                return []
        return denos
```


# Q3
### 3593. Minimum Increments to Equalize Leaf Paths

> https://leetcode.com/problems/minimum-increments-to-equalize-leaf-paths/description/

You are given an integer n and an undirected tree rooted at node 0 with n nodes numbered from 0 to n - 1. This is represented by a 2D array edges of length n - 1, where edges[i] = [ui, vi] indicates an edge from node ui to vi .

Each node i has an associated cost given by cost[i], representing the cost to traverse that node.

The score of a path is defined as the sum of the costs of all nodes along the path.

Your goal is to make the scores of all root-to-leaf paths equal by increasing the cost of any number of nodes by any non-negative amount.

Return the minimum number of nodes whose cost must be increased to make all root-to-leaf path scores equal.


Example 1:

Input: n = 3, edges = [[0,1],[0,2]], cost = [2,1,3]

Output: 1



Example 2:

Input: n = 3, edges = [[0,1],[1,2]], cost = [5,1,4]

Output: 0


Example 3:

Input: n = 5, edges = [[0,4],[0,1],[1,2],[1,3]], cost = [3,4,1,1,7]

Output: 1


Constraints:

2 <= n <= 10**5
edges.length == n - 1
edges[i] == [ui, vi]
0 <= ui, vi < n
cost.length == n
1 <= cost[i] <= 10**9
The input is generated such that edges represents a valid tree.


### Solution

This is a greedy dfs solution.
Uses bottom-up DFS to compute the cost of each path.
Greedily ensures all paths from a node to its children are equal
in cost by increasing the lesser ones.
The result is the minimum number of such increments required.

How we did this?

Build an undirected graph G from the edges.
Define a recursive DFS function, i is the current node, f is the parent node.
In the DFS
Recursively collect the total cost from each child subtree into the score list.
If the node is a leaf, just return its own cost.
Find the maximum path cost among children.
For each child whose path cost is less than max,
it must be increased — so count how many need adjustment.
Return the new total cost of this node's path (max child + its own cost).

Start DFS from the root (node 0).
Return the total number of nodes that must be increased.


```python
class Solution:
    def minIncrease(self, n: int, edges: List[List[int]], cost: List[int]) -> int:

        adj = [[] for _ in range(n)]
        for u,v in edges:
            adj[u].append(v)
            adj[v].append(u)
        res = 0
        
        def dfs(node, parent = -1):
            nonlocal res
            score = []
            for nei in adj[node]:
                # skip parent node
                if nei == parent:
                    continue
                child_score = dfs(nei, node)
                score.append(child_score)
            # leaf node
            if not score:
                return cost[node]
            # increase other child nodes if they are not max score
            max_score = max(score)
            for s in score:
                if s < max_score:
                    res += 1
            return max_score + cost[node]
        
        dfs(0, -1)
        return res
```