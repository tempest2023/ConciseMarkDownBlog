## A SocketIO Error troubled me for a lot time
> 2018-11-10 19:07:57

Got this error when send data with socket.io

- RangeError: Maximum call stack size exceeded

### Reason for this error

Don't send socket object to client, socket is a circular structure object, it will cause the max call stack size exceeded error in buffer.js.

### How this happen?

When I use socket.io to transfer data, I got this errors. This error has a very implicit notification: Maximun call stack size exceeded. How it could be stack overflow only because I call emit to transfer data to the client? This notification heavily troubled me to find solution on Google. And then I use single step debugging to find why this happen: The stack overflow is only the superficial error that the bug causes, not the bug itself.

This problem is based on how the `buffer.js` handle the data we sent.

![send_data](/src/articles/Blogs/JavaScript/images/maximum_call_stack_size_exceeded.png)

### True reason of bug

It's pretty simple, it's because the JSON data we sent includes circular structure.

#### What is circular structure?

Here is a circular structure, if you use `JSON.stringify` to format it, you will get an error to indicate that you can not convert a circular structure to a String.
![circular_structure](https://img-blog.csdnimg.cn/20181110190213220.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTM1NjA5MzI=,size_16,color_FFFFFF,t_70)

#### Why a circular structure will lead the Maximum call stack size exceeded?

Because in `buffer.js`, it needs the content, length of the data you want to transfer, it will use recursion to read the object you send. Obviously, it didn't handle the circular structure in advance. So it will cause this stack error.
In `JSON.stringify`, there is a detection before convert it to a String, and the error will directly show it is a circular structure, no misunderstanding.