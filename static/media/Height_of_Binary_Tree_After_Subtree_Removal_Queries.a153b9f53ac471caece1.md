### 2458. Height of Binary Tree After Subtree Removal Queries
> [problem link](https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries/)

#### Hint
> 1. Try pre-computing the answer for each node from 1 to n, and answer each query in O(1).
> 2. The answers can be precomputed in a single tree traversal after computing the height of each subtree.
### Solution

For each node, we record his neighbors' height in DFS. 

When delete this node and its subtree, obviously his neighbors may have the larger height.

We remove the height contributed from this node and check what is the rest.

We only need to record first 2 largest height for each depth because every removal is independent.

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def treeQueries(self, root: Optional[TreeNode], queries: List[int]) -> List[int]:
        m = len(queries)
        q = [(root,[])]
        new_q = []
        h = 0

        depth2NodeHeight = defaultdict(list) # neighbors with first 2 largest height in this depth
        node2depth = defaultdict(int)
        node2height = defaultdict(int)
        
        def max2ele(l, a):
            l.append(a)
            l.sort(reverse=True)
            return l[0:2]
        '''
        use dfs to iterate all nodes and record their depths, height, and the height list with different depth
        '''
        def dfs(node, depth):
            if(not node):
                return depth-1
            # set depth for this node value
            node2depth[node.val] = depth
            # get height from childrens
            heightLeft = dfs(node.left, depth + 1)
            heightRight = dfs(node.right, depth + 1)
            # set height for this node value
            node2height[node.val] = max(heightLeft, heightRight)
            # for this depth, keep first 2 largest height
            depth2NodeHeight[depth] = max2ele(depth2NodeHeight[depth], node2height[node.val])
            
            return node2height[node.val]
        '''
        remove the value from a list with max length 2
        if the value is not in list, do nothing
        '''
        def removeFromList(l, v):
            # len of l can only be [0,1,2]
            if(len(l) == 0):
                return l
            if(v not in l):
                return l
            if(len(l)>0 and l[0] == v):
                l = [] if len(l)==1 else [l[1]]
            elif(len(l)>1):
                l = [l[0]] if l[1] == v else [l[1]]
            return l

        dfs(root, 0)
        
        # print(node2depth, node2height, depth2NodeHeight)
        res = [0]*m  
        for i in range(m):
            removal = queries[i]
            depth = node2depth[removal]
            height = node2height[removal]
            depthList = depth2NodeHeight[depth]
            # remove the height of this node's subtree
            depthList = removeFromList(depthList, height)
            if(len(depthList) == 0):
                # no neighbors can provide larger height, the max height will be depth - 1
                res[i] = depth-1
            else:
                res[i] = depthList[0]
        return res
        
        
```