### 2321. Maximum Score Of Spliced Array
> [problem link](https://leetcode.com/problems/maximum-score-of-spliced-array/)

### Solution

According to the description of this problem, we need to find the max value of

`_sum1 + sum(num2[l:r])-sum(num1[l:r])`

or the max value of

`_sum2 + sum(num1[l:r]-sum(num2[l:r])), 0<=l<=r<=len(nums1)`

Which means repalcing the part of `nums1[l:r]` with `nums2[l:r]` and gets the sum value, or repalcing the part of `nums2[l:r]` with `nums1[l:r]`. Please notice that `l==r` which means no replacement is allowed.

Considering `_sum1` and `_sum2` is fixed: `sum(nums1), sum(nums2)`

We need to find the max value of `sum(num2[l:r])-sum(num1[l:r])` or `sum(num1[l:r]-num2[l:r])`
if we define num3, `num3[i] = num2[i]-num1[i], 0<=i<n`
and num4, `num4[i] = num1[i]-num2[i], 0<=i<n`

what we need to find is the max subarray of num3, num4, which is an old question
https://en.wikipedia.org/wiki/Maximum_subarray_problem

Here is how we implements the above description.

```python
class Solution:
    def maximumsSplicedArray(self, nums1: List[int], nums2: List[int]) -> int:
        n = len(nums1)
		nums3 = [0]*n
		nums4 = [0]*n
		for i in range(n):
			nums3[i] = nums1[i]-nums2[i]
			nums4[i] = nums2[i]-nums1[i]
		maxsubseq1 = maxsubseq2 = 0
		v1 = v2 = 0 
		# use kadane algorithm to solve this max subseq problem
		for i in range(n):
			maxsubseq1 = max(maxsubseq1 + nums3[i], nums3[i])
			maxsubseq2 = max(maxsubseq2 + nums4[i], nums4[i])
			v1 = max(v1, maxsubseq1)
			v2 = max(v2, maxsubseq2)
		_sum1 = sum(nums1)
		_sum2 = sum(nums2)
		return max(_sum1 + v2, _sum2 + v1)
```

Obviously, we can simplify it to one iteration to get better performance.

```python
class Solution:
    def maximumsSplicedArray(self, nums1: List[int], nums2: List[int]) -> int:
        # simplify the whole process
        v1 = v2 = 0
        n = len(nums1)
        _sum1 = sum(nums1)
        _sum2 = sum(nums2)
        res = _sum1
        for i in range(n):
            v1 = max(v1 + nums1[i] - nums2[i], nums1[i] - nums2[i])
            v2 = max(v2 + nums2[i] - nums1[i], nums2[i] - nums1[i])
            res = max(_sum1 + v2, _sum2 + v1, res)
        return res
```

If you like it, please upvote me.


Original Link: [Maximum Score Of Spliced Array](https://leetcode.com/problems/maximum-score-of-spliced-array/discuss/2238633/convert-to-max-subarray-problem-faster-than-87)