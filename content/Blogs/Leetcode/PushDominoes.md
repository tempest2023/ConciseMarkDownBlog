### 838. Push Dominoes
There are n dominoes in a line, and we place each domino vertically upright. In the beginning, we simultaneously push some of the dominoes either to the left or to the right.

After each second, each domino that is falling to the left pushes the adjacent domino on the left. Similarly, the dominoes falling to the right push their adjacent dominoes standing on the right.

When a vertical domino has dominoes falling on it from both sides, it stays still due to the balance of the forces.

For the purposes of this question, we will consider that a falling domino expends no additional force to a falling or already fallen domino.

You are given a string dominoes representing the initial state where:

- dominoes[i] = 'L', if the ith domino has been pushed to the left,
- dominoes[i] = 'R', if the ith domino has been pushed to the right, and
- dominoes[i] = '.', if the ith domino has not been pushed.

Return a string representing the final state.

#### Example 1:
```shell
Input: dominoes = "RR.L"
Output: "RR.L"
Explanation: The first domino expends no additional force on the second domino.
```

#### Example 2:
```shell
Input: dominoes = ".L.R...LR..L.."
Output: "LL.RR.LLRRLL.."
```

Constraints:

- n == dominoes.length
- 1 <= n <= $10^5$
- dominoes[i] is either 'L', 'R', or '.'.

-----------------
## Solution
To update dominoes, we convert it to a list.

In every bfs, we detect if there is a new change because of the L/R.

And add this new change to `pre_change` list. It is updated to dominoes after we finished a bfs because if we update dominoes immediately it will cause errors when we detect adjacent position.

For example: "R..L",

If we change the "." to "R" immediately, when we check the second "." because of "L", we will keep "." because it is "RR.L". So we must update all changes caused by a bfs simultaneously to get the right results.

That's why we use `pre_change` list. 

```python
class Solution:
    def pushDominoes(self, dominoes: str) -> str:
        dominoes = [c for c in dominoes]
        q = []
        new_q = [] # bfs queue
        n = len(dominoes)
        oppos = {
            'L':'R',
            'R':'L'
        }
        pre_change = [] # save changes and render them after finished one bfs
        
        # init queue
        for i in range(len(dominoes)):
            if(dominoes[i] != '.'):
                q.append((i, dominoes[i]))
        # start bfs
        while(q):
            (ind, dire) = q.pop()
            # consider left effect
            if(dire == 'L' and ind>0):
                if(dominoes[ind-1] == '.'):
                    if((ind-1>0 and dominoes[ind-2] != oppos[dire]) or ind-1==0):
                        # add this change to pre_change list
                        pre_change.append((ind-1, dire))
                        # append the new change, it may cause following changes
                        new_q.append((ind-1, dire))
            # considere right effect
            if(dire == 'R' and ind<n-1):
                if(dominoes[ind+1] == '.'):
                    if((ind+1<n-1 and dominoes[ind+2] != oppos[dire]) or ind+1 == n-1):
                        # add this change to pre_change list
                        pre_change.append((ind+1, dire))
                        # append the new change, it may cause following changes
                        new_q.append((ind+1, dire))
            if(not q):
                # render pre changes
                for (ind,d) in pre_change:
                    dominoes[ind] = d
                pre_change = []
                q = new_q
                new_q = []
        return "".join(dominoes)    
```

Original Link: [Push Dominoes](https://leetcode.com/problems/push-dominoes/discuss/1794351/python-bfs-easy-to-understand)