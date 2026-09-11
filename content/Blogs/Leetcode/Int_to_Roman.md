### 12. Integer to Roman
> [problem link](https://leetcode.com/problems/integer-to-roman/)

### Solution

Due to array operators and the range of num(1-3999), the normal answer runs faster than the smart one.

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        # normal answer
        s = []
        convertor = [(1, 'I'),(4, 'IV'),(5, 'V'),(9, 'IX'),(10, 'X'),(40, 'XL'),(50, 'L'),(90, 'XC'),(100, 'C'),(400, 'CD'),(500, 'D'),(900, 'CM'),(1000, 'M')][::-1]
        while(num>0):
            for ind,each in enumerate(convertor):
                if(num>=each[0]):
                    num -= each[0]
                    s.append(each[1])
                    break
        return "".join(s)
```

```python
class Solution:
    def intToRoman(self, num: int) -> str:
        # smart solution
        I = ["", "I", "II", "III", "IV","V", "VI", "VII", "VIII", "IX"]
        X = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"]
        C = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]
        M = ["", "M", "MM", "MMM"]
        return M[num//1000] + C[(num%1000)//100] + X[(num%1000%100)//10] + I[(num%1000%100%10)]
```