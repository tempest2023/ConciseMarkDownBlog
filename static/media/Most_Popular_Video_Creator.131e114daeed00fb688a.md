### 2456. Most Popular Video Creator
> [problem link](https://leetcode.com/problems/most-popular-video-creator/)

### Solution

I'm pretty sure you know how to solve this problem, using hashmap.
But even you know it, it's hard to pass this problem, because its poor and ambiguous description of problem. If you don't know why you fails this problem. Don't worry, it is the fault of this problem, not your ability to apply hashmap to solve the problems.

Here are some points to pay attention but not in description clearly.
1. All videos are unique, there are n videos, whatever the id or creator of the video, they are unique, which means we don't need to add them up for the records with the same creator and id.
2. id and creator are not unique, for the replicated creator name, it refers to the same creator, the old one or a new creator. For the replicated id, it refers to a new video.
3. For each creator, their views are cumulative.

So to solve this problem, we need 2 hashmap, one is to record the videos info of each creator.
`creator2ids = creator: str -> Array<(views: int, ids: str)>`
Another is to record the views of a creator have in total.
`creator2v = creator: str -> views: int`

Firstly, we count up the max views for creators(may be more one creators), at the same time, we get the videos info list for each creator.

And then, we get the video with max views(may be more than one) for the creators we just picked up based on `creator2ids`. For multiple videos, we picked up the videos with the highest views and then sort them as lexicographical order.

```python
class Solution:
    def mostPopularCreator(self, creators: List[str], ids: List[str], views: List[int]) -> List[List[str]]:
        creator2v = defaultdict(int)
        id2v = defaultdict(int)
        creator2id = defaultdict(list)
        n = len(creators)
        maxView = 0
        maxViewCreators = set()
        for i in range(n):
            c = creators[i]
            creator2id[c].append((views[i], ids[i]))
            creator2v[c] += views[i]
            if(maxView==creator2v[c]):
                maxViewCreators.add(c)
            elif(maxView<creator2v[c]):
                maxView = creator2v[c]
                maxViewCreators = {c}
        res = []
        # print(maxViewCreators)
        for creator in maxViewCreators:            
            idList = creator2id[creator]
            # print(idList)
            idList.sort(reverse=True)
            maxViewinId = idList[0][0]
            maxViewIdList = []
            for each in idList:
                if(maxViewinId == each[0]):
                    maxViewIdList.append(each[1])
            maxViewIdList.sort()
            # print('same view:',maxViewIdList)
            res.append([creator, maxViewIdList[0]])
        return res
```