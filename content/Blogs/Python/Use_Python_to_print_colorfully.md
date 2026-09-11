## Use Python to print colorfully
> 2018-03-07 20:10:40

In Deep Learning homework, I found there is a weird print.

```python
print ("\033[93m" + "There is a mistake in the backward propagation! difference = " + str(0.00001) + "\033[0m")
```

And it can print colorfully.

Obviously the both sides change the color of the content. 

Use different value to try

```python
for i in range(90,110):
	print("\033["+str(i)+"m"+"[*"+str(i)+"*]This is what I want to print."+"\033[0m")
```

And I found this [link](https://www.geeksforgeeks.org/print-colors-python-terminal/), more details about colorful print in python