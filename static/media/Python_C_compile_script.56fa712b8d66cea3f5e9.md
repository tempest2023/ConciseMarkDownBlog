## Use Python script to help multi C++ files compile on Windows (no make)
> 2017-10-25 11:49:30

Because there is no make on my Windows, so I write this script to help me to compile C++ files.

Comparing make, it can not detect the updates, maybe later I can add diff to it.

Only for small C++ projects compilation

What it supports：
1. **Delete the old files in compilation**
2. **Automatically generate compilig .exe files**
3. **Automatically run the final .exe file**

-------------------

### Code

```python
#coding=utf-8
import os,sys
def delfile(file):
    if(os.path.exists(file)):
        print(file)
        os.remove(file)

#Config
#The files you want to compile
files=['Rational.h','Rational.cpp','test.cpp']
# output file name, will be [output].exe
output="Test"

# if you want to delete the old exe files in last compilation. 0 not 1 yes
isdel=1
# if you want to compile them. 0 not 1 yes
ismake=1
# if you want to run after compilation. 0 not 1 yes
isrun=0

# del old files
if(isdel>0):
    files_name=[]
    print("[*] Start to delete files")
    for i in files:
        if(i.find(".")>=0):
            files_name.append(i[0:i.find(".")])
    for root,dirs,allfiles in os.walk("."):
        for i in allfiles:
            for j in files_name:
                if(i.find(j)>=0):
                    if(i.find(".cpp")==-1 and i.find(".h")==-1):
                        delfile(i)
                    if(i.find(".h.gch")>=0):
                        delfile(i)
    if(os.path.exists(output+".exe")):
        print(output+".exe")
        os.remove(output+".exe")
    print("[*] Finish Delete")


# Compile
if(ismake>0):
    cmd1="g++ -c"
    for i in files:
        cmd1=cmd1+" "+i
    cmd2="g++ -o "+output
    for i in files:
        ind=i.find('.cpp')
        if(ind>=0):
            cmd2 = cmd2 + ' '+i[0:ind]+".o"
    print("[*] "+cmd1)
    print("------Running-------")
    os.system(cmd1)
    print("[*] "+cmd2)
    os.system(cmd2)
    print("------Running-------")


# Run it
if(isrun>0):
    cmd3=output+".exe"
    os.system(cmd3)
```
