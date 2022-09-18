# Errors when compile pintos on Ubuntu
> 2019-03-07 17:29:24

Install bochs and pintos on ubuntu.

After install bochs, enter `pintos/src/threads/` and execute `make check`, it show errors:
```shell
cd build && make check
make[1]: Entering directory '/home/rentao/Desktop/OS/project1/pintos/src/threads/build'
perl -I../.. ../../tests/threads/alarm-multiple.ck tests/threads/alarm-multiple tests/threads/alarm-multiple.result
FAIL tests/threads/alarm-multiple
Run produced no output at all
pintos -v -k -T 60 --bochs  -- -q  run alarm-simultaneous < /dev/null 2> tests/threads/alarm-simultaneous.errors > tests/threads/alarm-simultaneous.output
../../tests/Make.tests:73: recipe for target 'tests/threads/alarm-simultaneous.output' failed
make[1]: *** [tests/threads/alarm-simultaneous.output] Error 127
make[1]: Leaving directory '/home/rentao/Desktop/OS/project1/pintos/src/threads/build'
../Makefile.kernel:10: recipe for target 'check' failed
make: *** [check] Error 2
```
Found a solution [here](http://www.itkeyword.com/doc/8432571668848159x761/pintos-kernel-panic-with-v-option-bochs-on-ubuntu)

Change `pintos/src/test/Make.tests` file 54 line,

```
TESTCMD = pintos -v -k -T $(TIMEOUT)
```
to
```
TESTCMD = pintos -k -T $(TIMEOUT)
```

Then go back to `pintos/src/threads/` to run `../../utils/pintos run alarm-multiple`

It shows this and it run correctly.
![result](https://img-blog.csdnimg.cn/20190307172558834.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTM1NjA5MzI=,size_16,color_FFFFFF,t_70)

