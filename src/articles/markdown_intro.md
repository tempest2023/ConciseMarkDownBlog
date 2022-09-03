### [GitHub Flavored Markdown](https://github.github.com/gfm/)
> ##### I also added some Typora Style Markdown support.
> ##### H1 and H2 will have a divider.
> ##### Block will have a grey font color and grey left border.
# H1

## H2

### H3

###### H5

## Font Style

**bold**

__bold__

*italic*

_italic*

~Strikethrough~

~one~ or ~~two~~ tildes.

## Autolink literals

www.github.com, https://github.com 

## Add a link
```shell
[623059008@github.com](https://github.com/623059008)
```
[623059008@github.com](https://github.com/623059008)

## List and Tasklist

- A
  - B
    - C

1. Project1
2. Project2
3. Project3

* [ ] to do
* [x] done

## Block Quote

> ### Foo

> bar

> baz

> A block
> Same Block
> > Sub Block


## Table (to be updated)
| foo | bar |
| --- | --- |
| baz | bim |

| abc | defghi |
:-: | -----------:
bar | baz

## Link and Image

Link: [link](https://www.google.com/).

Image: ![Alt](https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png)


## Insert Codes

```javascript
// An highlighted block
var foo = 'bar';
console.log('Hello World!')
```

```cpp
#include <iostream>
using namespace std;
int main() { 
  cout << "Hello World!";
  return 0;
}
```

```python
from typing import List
def helper(arr:List[]):
  print(arr)
print('Hello World!')
```

## KaTeX Math

Use LaTeX to write math expression [KaTeX](https://khan.github.io/KaTeX/):

$\Gamma(n) = (n-1)!\quad\forall
n\in\mathbb N$ 

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$

## Footnote

Link Foot Note

> Find more about **LaTeX** [here][1].


A text note[2]


 [1]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference
 [2]: Big note.