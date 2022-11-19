# 295. Find Median from Data Stream

[Find Median from Data Stream - LeetCode](https://leetcode.com/problems/find-median-from-data-stream/)

The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

- For example, for `arr = [2,3,4]`, the median is `3`.
- For example, for `arr = [2,3]`, the median is `(2 + 3) / 2 = 2.5`.

Implement the MedianFinder class:

- `MedianFinder()` initializes the `MedianFinder` object.
- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.
- `double findMedian()` returns the median of all elements so far. Answers within `105` of the actual answer will be accepted.

**Example 1:**

```
Input
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output
[null, null, null, 1.5, null, 2.0]

Explanation
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0

```

**Constraints:**

- `10^5 <= num <= 10^5`
- There will be at least one element in the data structure before calling `findMedian`.
- At most `5 * 10^4` calls will be made to `addNum` and `findMedian`.

**Follow up:**

- If all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?
- If `99%` of all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?

## Solution

we use two heaps to maintain our array, one is a max heap for the left part and another is a min heap for the right part. When we want to get the median, if the total count is odd, we get the smallest number from the right part(in balancing, we always push one more number to the right part), if the total count is even, we get the largest number from the left part(max heap) and the smallest number from the right part(min heap), which is two peaks from two heaps and return the avg of them.

When we add number, we should make the two part balanced. If the total count is even, we add a number to left or right to make the left part has one more number.

In python, there is heapq to handle min heap, but there is no max heap.

So we write a max heap class by insert negative numbers and operate opposite operations.

Pay attention to nlargest and nsmallest if you only want to get the peek, it’s time-consuming. Use pop and push back to get the peak will be faster.

```python
class MaxHeap:
    def __init__(self):
        self.arr = []
    
    def push(self, num):
        heappush(self.arr, -num)
    
    def pop(self):
        if(len(self.arr) == 0):
            raise "Error: MaxHeap is empty"
        return -heappop(self.arr)
    
    # return largest number in maxHeap
    def peek(self):
        if(len(self.arr) == 0):
            raise "Error: MaxHeap is empty"
        x = heappop(self.arr)
        heappush(self.arr, x)
        return -x
    
    def nlargest(self, n):
        return [-i for i in nsmallest(n, self.arr)]
    
    def nsmallest(self, n):
        return [-i for i in nlargest(n, self.arr)]
    
    def __len__(self):
        return len(self.arr)

class MedianFinder:

    def __init__(self):
        self.max_arr = [] # min heap
        self.min_arr = MaxHeap() # max heap
        self.count = 0
        
    def print_heapq(self):
        print(self.min_arr.nsmallest(len(self.min_arr)), '|', nsmallest(len(self.max_arr), self.max_arr))

    def addNum(self, num: int) -> None:
        self.count += 1
        # init
        if(self.count == 1):
            self.max_arr.append(num)
            return
        minMaxV = -inf
        maxMinV = inf
        if(len(self.max_arr)>0):
            x = heappop(self.max_arr)
            minMaxV = x
            heappush(self.max_arr, x)
        if(len(self.min_arr)>0):
            maxMinV = self.min_arr.peek()
        # print('add num', num)
        # self.print_heapq()
        if(self.count % 2 == 0):
            # keep balance
            if(len(self.min_arr)>len(self.max_arr)):
                # max_arr needs a num
                if(num<maxMinV):
                    # move a number from min_arr to max_arr
                    # put new number to min_arr
                    x = heappop(self.min_arr)
                    heappush(self.max_arr, x)
                    heappush(self.min_arr, num)
                else:
                    heappush(self.max_arr, num)
            else:
                # min_arr needs a num
                if(num>minMaxV):
                    # move a number from max_arr to min_arr
                    # put new number to max_arr
                    x = heappop(self.max_arr)
                    self.min_arr.push(x)
                    heappush(self.max_arr, num)
                else:
                    self.min_arr.push(num)
        else:
            # keep max_arr larger
            if(num<maxMinV):
                # move a number from min_arr to max_arr
                # put new number to min_arr
                x = self.min_arr.pop()
                heappush(self.max_arr, x)
                self.min_arr.push(num)
            else:
                heappush(self.max_arr, num)
        # print('after adding')
        # self.print_heapq()
        

    def findMedian(self) -> float:
        if(self.count == 0):
            return 0
        # print('before get', self.count)
        # self.print_heapq()
        if(self.count % 2 == 0):
            maxMinV = self.min_arr.peek()
            x = heappop(self.max_arr)
            minMaxV = x
            heappush(self.max_arr, x)
            return (maxMinV + minMaxV)/2
        else:
            x = heappop(self.max_arr)
            minMaxV = x
            heappush(self.max_arr, x)
            return minMaxV

# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()
```