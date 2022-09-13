### [2227. Encrypt and Decrypt Strings](https://leetcode.com/problems/encrypt-and-decrypt-strings/)

### Soluition
Easy Python3 solution, encrypt the dictionary when initialization
```python
class Encrypter:
    def __init__(self, keys: List[str], values: List[str], dictionary: List[str]):
        self.keysDict = defaultdict(int)
        self.keys = keys
        for i in range(len(keys)):
            self.keysDict[keys[i]] = i+1 # index + 1
        self.values = values
        self.dictionary = defaultdict(int)
        for i in range(len(dictionary)):
            self.dictionary[self.encrypt(dictionary[i])] +=1

    def encrypt(self, word1: str) -> str:
        res = ''
        for c in word1:
            res += self.values[self.keysDict[c]-1]
        return res

    def decrypt(self, word2: str) -> int:
        return self.dictionary[word2]

# Your Encrypter object will be instantiated and called as such:
# obj = Encrypter(keys, values, dictionary)
# param_1 = obj.encrypt(word1)
# param_2 = obj.decrypt(word2)
```


Original Link: [Encrypt and Decrypt Strings](https://leetcode.com/problems/encrypt-and-decrypt-strings/discuss/1909102/easy-python3-encrypt-dictionary-when-init)