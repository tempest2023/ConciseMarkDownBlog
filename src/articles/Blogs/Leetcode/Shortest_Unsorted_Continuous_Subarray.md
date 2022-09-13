### [581. Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/)

Given an integer array nums, you need to find one continuous subarray that if you only sort this subarray in ascending order, then the whole array will be sorted in ascending order.

Return the shortest such subarray and output its length.



#### Example 1:
```shell
Input: nums = [2,6,4,8,10,9,15]
Output: 5
Explanation: You need to sort [6, 4, 8, 10, 9] in ascending order to make the whole array sorted in ascending order.
```

#### Example 2:
```shell
Input: nums = [1,2,3,4]
Output: 0
```
#### Example 3:
```shell
Input: nums = [1]
Output: 0
```

##### Constraints:

- 1 <= nums.length <= $10^4$
- $-10^5$ <= nums[i] <= $10^5$

**Follow up**: Can you solve it in O(n) time complexity?

### Solution
It is $O(nlogn)$.
1. Sorted this array
2. Compare with sorted array to check where is the left and right

```python
class Solution:
    def findUnsortedSubarray(self, nums: List[int]) -> int:
        left = 0
        right = 0
        aftersort = sorted(nums)
        n = len(nums)
        while(left < n and nums[left]==aftersort[left]):
            left += 1
        # left is at most n which indicates the array is sorted
        if(left == n):
            return 0
        right = n-1
        while(right>left and nums[right]==aftersort[right]):
            right -= 1
        return right - left + 1
```

Original Link: [Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/discuss/2003470/python-easy-understanding-just-compare-with-sorted-array-onlogn)