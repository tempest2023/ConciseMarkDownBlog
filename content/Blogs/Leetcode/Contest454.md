## Contest 454
> Date: Jun 14-15 2025
# Q1
Skip

# Q2
https://leetcode.com/problems/count-special-triplets/description/
## 3583. Count Special Triplets
You are given an integer array nums.

A special triplet is defined as a triplet of indices `(i, j, k)` such that:

`0 <= i < j < k < n`, where `n = nums.length`
`nums[i] == nums[j] * 2`

`nums[k] == nums[j] * 2`
Return the total number of special triplets in the array.

Since the answer may be large, return it modulo `10**9 + 7`.

 

Example 1:

Input: nums = [6,3,6]

Output: 1

Explanation:

The only special triplet is (i, j, k) = (0, 1, 2), where:

nums[0] = 6, nums[1] = 3, nums[2] = 6
nums[0] = nums[1] * 2 = 3 * 2 = 6
nums[2] = nums[1] * 2 = 3 * 2 = 6
Example 2:

Input: nums = [0,1,0,0]

Output: 1

Explanation:

The only special triplet is (i, j, k) = (0, 2, 3), where:

nums[0] = 0, nums[2] = 0, nums[3] = 0
nums[0] = nums[2] * 2 = 0 * 2 = 0
nums[3] = nums[2] * 2 = 0 * 2 = 0
Example 3:

Input: nums = [8,4,2,8,4]

Output: 2

Explanation:

There are exactly two special triplets:

(i, j, k) = (0, 1, 3)
nums[0] = 8, nums[1] = 4, nums[3] = 8
nums[0] = nums[1] * 2 = 4 * 2 = 8
nums[3] = nums[1] * 2 = 4 * 2 = 8
(i, j, k) = (1, 2, 4)
nums[1] = 4, nums[2] = 2, nums[4] = 4
nums[1] = nums[2] * 2 = 2 * 2 = 4
nums[4] = nums[2] * 2 = 2 * 2 = 4
 

Constraints:

`3 <= n == nums.length <= 10**5`

`0 <= nums[i] <= 10**5`

# Key Thought
Two passes
If we use brute force, it definitely TLE. In brute force method, for each i, we iterate the array to find possible j and iterate the remaining array to find the possible k.
```python3
from collections import defaultdict, Counter
from typing import List
class Solution:
    def bruteforce(self, nums: List[int]) -> int:
        n = len(nums)
        res = set()
        li = defaultdict(tuple)
        for i in range(n):
            for j in range(i+1, n):
                for k in range(j+1, n):
                    if nums[i] == nums[k] and nums[j] * 2 == nums[k]:
                        res.add((i, j, k))
                        li[(i,j,k)] = (nums[i], nums[j], nums[k])
        # for item in res:
        #     print(f"{item} -> {li[item]}")
        return len(res)
```

So we need to optimize our methods. A simple thought is use Hashtable/Counter. Because the `nums[i] = nums[k] = 2*nums[j]`, we can make a Counter and iterate nums, for each j and nums[j], we access the Counter with `2*nums[j]` to find possible i and k.
But here is another issue, we ask `i<j<k`, using the Counter we can not prove that, unless we use a dict map to record the number of indices. So that in indices of `2*nums[j]`, we can search the indices smaller than j and greater than j, to get the count of i and k.
It's complex, and we don't care about the exact number of any i or k. We only need the numbers of i or k and get their product to get the result.

Here is the optimization method: Two Passes

We iterate the nums twice, back and forth. In interations, we build the counter.
When we go from left to right, we build a Counter and this Counter shows possible i for each nums[j]. Because we cannot count any indices greater than j when go from left to right.
When we go from right to left, we build a Counter and this Counter shows possible k for each nums[j]. In this case, we cannot count any indices smaller than j when go right to left.

```python3
from collections import defaultdict, Counter
from typing import List
class Solution:
    def specialTriplets(self, nums: List[int]) -> int:
        c = defaultdict(int)
        n = len(nums)
        res = 0
        potential_i = [0]*n
        potential_k = [0]*n
        for j in range(n):
            # get valid potential_i
            potential_i[j] = c[nums[j]*2]
            c[nums[j]] += 1
        c = None
        c = defaultdict(int)
        for j in range(n-1, -1, -1):
            # get valid potential_k
            potential_k[j] = c[nums[j]*2]
            c[nums[j]] += 1
        for j in range(n):
            v = (potential_i[j]*potential_k[j]) % 1000000007
            res += v
        return res
```

# Q3
https://leetcode.com/problems/maximum-product-of-first-and-last-elements-of-a-subsequence/

## 3584. Maximum Product of First and Last Elements of a Subsequence
You are given an integer array nums and an integer m.

Return the maximum product of the first and last elements of any subsequence of nums of size m.

 

Example 1:

Input: nums = [-1,-9,2,3,-2,-3,1], m = 1

Output: 81

Explanation:

The subsequence [-9] has the largest product of the first and last elements: -9 * -9 = 81. Therefore, the answer is 81.

Example 2:

Input: nums = [1,3,-5,5,6,-4], m = 3

Output: 20

Explanation:

The subsequence [-5, 6, -4] has the largest product of the first and last elements.

Example 3:

Input: nums = [2,-1,2,-6,5,2,-5,7], m = 2

Output: 35

Explanation:

The subsequence [5, 7] has the largest product of the first and last elements.

 

Constraints:

`1 <= nums.length <= 10**5`

`-10**5 <= nums[i] <= 10**5`

`1 <= m <= nums.length`


### Key Thought

For this question, we notices `j-i+1 >=m, j>=i+m-1`
We only care about the first element and the last element. To find the max product of subseqence, we can use **sliding window**, iterate the array, for each last-element `j`, the possible first-element `i <= j-m+1`. We can record the max nums[i], and only update nums[i] when we met a larger  first-element. Then we check the product for each `nums[j]*prev_max_nums_i` to update the res.
Noticed that we have negative number in arrays, that's why we need to store the min value to get the max product.

### Solution

```python3
class Solution:
    def maximumProduct(self, nums: List[int], m: int) -> int:
        # constarint: j - i + 1 >= m, j >= i+m-1
        n = len(nums)
        res = -inf
        min_v = max_v = nums[0]
        for j in range(m-1, n):
            # for new first element in this subseq, use it to update min and max value to get potential better product
            min_v = min(min_v, nums[j-m+1])
            max_v = max(max_v, nums[j-m+1])
            # update res, if the product with new last element and potential max(min) first element is larger
            res = max(res, min_v*nums[j], max_v*nums[j])
        return res
```

# Q4

## 3585. Find Weighted Median Node in Tree
You are given an integer n and an undirected, weighted tree rooted at node 0 with n nodes numbered from 0 to n - 1. This is represented by a 2D array edges of length n - 1, where edges[i] = [ui, vi, wi] indicates an edge from node ui to vi with weight wi.

The weighted median node is defined as the first node x on the path from ui to vi such that the sum of edge weights from ui to x is greater than or equal to half of the total path weight.

You are given a 2D integer array queries. For each queries[j] = [uj, vj], determine the weighted median node along the path from uj to vj.

Return an array ans, where ans[j] is the node index of the weighted median for queries[j].


Example 1:

Input: n = 2, edges = [[0,1,7]], queries = [[1,0],[0,1]]

Output: [0,1]

Explanation:

| Query   | Path   | Edge Weights | Total Path Weight | Half | Explanation                                      | Answer |
|---------|--------|--------------|--------------------|------|--------------------------------------------------|--------|
| [1, 0]  | 1 → 0  | [7]          | 7                  | 3.5  | Sum from 1 → 0 = 7 >= 3.5, median is node 0.    | 0      |
| [0, 1]  | 0 → 1  | [7]          | 7                  | 3.5  | Sum from 0 → 1 = 7 >= 3.5, median is node 1.    | 1      |

Example 2:

Input: n = 3, edges = [[0,1,2],[2,0,4]], queries = [[0,1],[2,0],[1,2]]

Output: [1,0,2]

Explanation:

| Query   | Path       | Edge Weights | Total Path Weight | Half | Explanation                                      | Answer |
|---------|------------|--------------|--------------------|------|--------------------------------------------------|--------|
| [0, 1]  | 0 → 1      | [2]          | 2                  | 1    | Sum from 0 → 1 = 2 >= 1, median is node 1.      | 1      |
| [2, 0]  | 2 → 0      | [4]          | 4                  | 2    | Sum from 2 → 0 = 4 >= 2, median is node 0.      | 0      |
| [1, 2]  | 1 → 0 → 2  | [2, 4]       | 6                  | 3    | Sum from 1 → 0 = 2 < 3. Sum from 1 → 2 = 6 >= 3, median is node 2. | 2      |


Example 3:

Input: n = 5, edges = [[0,1,2],[0,2,5],[1,3,1],[2,4,3]], queries = [[3,4],[1,2]]

Output: [2,2]

Explanation:

| Query   | Path                     | Edge Weights   | Total Path Weight | Half  | Explanation                                                                 | Answer |
|---------|--------------------------|----------------|--------------------|-------|-----------------------------------------------------------------------------|--------|
| [3, 4]  | 3 → 1 → 0 → 2 → 4        | [1, 2, 5, 3]   | 11                 | 5.5   | Sum from 3 → 1 = 1 < 5.5. Sum from 3 → 0 = 1 + 2 = 3 < 5.5. Sum from 3 → 2 = 1 + 2 + 5 = 8 >= 5.5, median is node 2. | 2      |
| [1, 2]  | 1 → 0 → 2                | [2, 5]         | 7                  | 3.5   | Sum from 1 → 0 = 2 < 3.5. Sum from 1 → 2 = 2 + 5 = 7 >= 3.5, median is node 2. | 2      |

Constraints:

`2 <= n <= 10**5`

edges.length == n - 1
edges[i] == [ui, vi, wi]
0 <= ui, vi < n
1 <= wi <= 109

`1 <= queries.length <= 10**5`

queries[j] == [uj, vj]
0 <= uj, vj < n

The input is generated such that edges represents a valid tree.

### Key Thoughts
We can use binary lifting to find the lowest common ancestor (LCA) of the two nodes u, v in the query.
Using Dfs we can find the costs from root node 0 to every node x
Total Path Cost = costs[u] + costs[v] - 2* costs[lca]. We can get half Path Cost
If costs[u] > costs[v], straightforward binary search between the depths of u and lca to find a node whose cost is greater than or equal to halfCost and move down away from LCA
But if costs[u] < costs[v], then find a node from v whose cost is less than or equal to halfCost and move up towards LCA

### Solution
https://leetcode.com/problems/find-weighted-median-node-in-tree/solutions/6844956/python3-binary-lifting-binary-search-simple-o-n-log-n/