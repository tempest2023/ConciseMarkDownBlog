### Paint House III
> [Problem Link](https://leetcode.com/problems/paint-house-iii/)

### Solution

```python
class Solution:
    def minCost(self, houses: List[int], cost: List[List[int]], m: int, n: int, target: int) -> int:
        """
        Try to figure it out by 2D dp
        dp[i][j] means the min cost when i-th house painted as color j+1
            (without considering painted house)
            if group < target:
                dp[i][j] = min(dp[i-1])+cost[i][j]
                # if choose different color j, group+=1
            else: # no choice but choose same color with prev one
                dp[i][j] = if : dp[i-1][j] + cost[i][j]

        Obviously we need 3D dp array to cover group changes!

        dp[i][j][k] means the dp[i][j] with k groups
            (withou considering paiinted house)
            # paint it as the same color with prev one
            dp[i][j][k] = dp[i-1][j][k] + cost[i][j]
            # paint it as different colors with prev one
            dp[i][j][k] = dp[i-1][all but not j][k-1] + cost[i][j]
            
        Notice that there are some painted houses at the start, we can not repaint them

        For these houses, cost[i][j] = 0, and dp[i][j except fixcolor][k] = inf which means it is not possible to paint them

        fixcolor = house[i]
        dp[i][fixcolor][k] = min(
                                # prev one with fixcolor, don't need to add k by 1
                                dp[i-1][fixcolor][k],
                                # prev one has different colors, add k by 1
                                dp[i-1][all but not fix color][k-1]
                            )
        By the way, when we iterate k to fill 3D matrix, it is not possible that we have just considered i houses and get i+1 groups. 
        In other words, the max k we can fill when consider i-th houses can not be bigger i.
        For example, when we consider 2-th house, there at most are 2 groups.
        which means we only fill dp[2][j][0] and dp[2][j][1].
        That's why we fill dp array with k in range(min(i+1, target))
        """
        dp = [[[inf]*target  for j in range(n) ] for i in range(m)]

        for i in range(m):
            # if house[i] is pre-painted
            if(houses[i]>0):
                for k in range(min(i+1, target)):
                    fc = houses[i]-1 # fixed color
                    # don't need to consider prev one
                    if(i==0):
                        dp[i][fc][k] = 0
                    elif(k==0):
                        # the prev one must have the same color
                        dp[i][fc][k] = dp[i-1][fc][k]
                    else:
                        # we can consider the prev one have every colors with k-1
                        tmp = dp[i-1][fc][k]
                        for each in range(n):
                            if(each!=fc):
                                tmp = min(tmp, dp[i-1][each][k-1])
                        dp[i][fc][k] = tmp
                continue
            # for non-pre-painted houses, try every colors
            for j in range(n):
                for k in range(min(i+1, target)):
                    # don't need to consider prev one
                    if(i==0):
                        dp[i][j][k] = cost[i][j]
                    elif(k==0):
                        # the prev one must have the same color
                        dp[i][j][k] = dp[i-1][j][k] + cost[i][j]
                    else:
                        # we can consider the prev one have every colors with k-1
                        tmp = dp[i-1][j][k] + cost[i][j]
                        for each in range(n):
                            if(each != j):
                                tmp = min(tmp, dp[i-1][each][k-1] + cost[i][j])
                        dp[i][j][k] = tmp
                    # print(f'({i},{j},{k}), dp:{dp[i][j][k]}')
        res = inf
        # dp[m-1][each color][target-1] means considering m houses, target group, the min cost value of painted schemas (whatever color of each house painted)
        for j in range(n):
            res = min(res, dp[m-1][j][target-1])
        # if not possible to paint as target group, it wiil be inf, because we never fill this position in our 3D dp.
        if(res == inf):
            return -1
        return res
```

Recursion dfs with memo will be faster.

```python
memo = {}
def dfs(ind, color, group):
	"""
	dfs(ind, color, group) means 
	for ind-th house, prev house painted as color, the group for now,
	the min cost can get.
	"""
	# print(f'house:{houses}, nei: {nei}, score: {score}')
	# invalid groups
	if(group<0 or m-ind<group):
		return inf
	# reach the last house
	if(ind == m):
		return 0 if group==0 else inf
	if((ind, color, group) in memo):
		return memo[(ind, color, group)]
	# pre-painted house
	if(houses[ind]):
		memo[(ind, color, group)] = dfs(ind+1, houses[ind], group-(color!=houses[ind]))
	else:
		# paint the same color as the prev house
		tmp = inf
		# try to paint evry colors different with the prev house
		for j in range(1,n+1):
			tmp = min(tmp, cost[ind][j-1] + dfs(ind+1, j, group-(j!=color)))
		memo[(ind, color, group)] = tmp
	return memo[(ind, color, group)]
res = dfs(0, 0, target)
if(res == inf):
	return -1
return res
```

Original Link: [post](https://leetcode.com/problems/paint-house-iii/discuss/2260742/python-dp-and-memo-dfs-solutions-with-explanation)