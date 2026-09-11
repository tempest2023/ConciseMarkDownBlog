## Summer Internship Midterm Report

> Name: Tao Ren
>
> People Soft: xxx
>
> Major: Information Science
>
> Intern Company: Ansys Inc.

### Introduction

In this summer term, I worked at Ansys which is a company focused on providing fast, accurate simulation and 3D design software and modeling solutions in Canonsburg, PA. My internship started on 16 May and will end on 12 Aug.

 

### Major Assignments and Duties

My role at Ansys is to develop Twin Deployer as a software engineer intern. The Twin Deployer is a simulation software based on Python and Typescript to provide data input, simulation, calculation, export models and other functionality to users. There are two parts of this software, the Electron part (front-end) and the back-end part. The front-end part is built by Electron, which is a framework to build the cross-platform application with JavaScript, CSS and HTML5. The back-end is built by Python server framework Tornado and Swagger framework which focus on standard codes generation and document generation. I worked with my leader Grayson to extend the Twin Deployer. I am responsible for the development of the browser mode extension. Specifically, I worked on developing the Electron framework part to enable this application to run in a browser environment and developing new components and APIs that will be used in browser mode. And this project is my internship project. My internship performance will mainly depend on the completion of this project.

 

### Details of My Internship Project

In the past month, I mainly worked on converting our application, Twin Deployer to a browser application. And it is now built by the Electron framework which is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS. It takes care of the hard parts like operating system levels operations, and developers can focus on the core of the application. So basically, the whole application runs on Chromium. To implement the extension to browser mode, I studied Quasar and Vue 2.0 which is the front-end framework used in our project now. I tried to figure out what it needs if it runs on a browser as a web application. For now, all the operations involved in the file system invoke the operation system APIs provided by node.js in Electron. In the browser, it must be converted to invoke the APIs provided by browser. To solve this problem, I developed a new component by invoking the browser file selector to upload file. And I also implement upload file API in back-end. In browser mode, I set the environment variable mode to browser. And the rendering of file upload component depends on this mode var. So the application will use this new component to handle the file operations in browser mode.

In back-end API development, I followed the oriented object programming design to finish the entire development. I finished the methods design of the abstract classes used in my upload API. To define the data structures and auto-generate the documents of APIs, I also used dataclass module in python to declare some data classes with many properties. Then I implement the corresponding methods in a concrete class inherited the abstract class. In API handler, it will create an upload instance to finish file operations. After saving the upload content to the exact file directory, it will return the API response object I defined in the abstract class to clients. And then clients can invoke other project operations like open project, export project with the specific file path.

 

### What I learned

During my internship experience with Ansys, I was able to develop my oriented object programming design skills and software engineering abilities. I particularly found direct interactions with the latest technologies in software engineering to be useful in improving my development skills. Although I found group meetings and weekly reports to be challenging, I believe they were valuable in developing my skills in the workplace.

In conclusion, this intern experience with Ansys was crucial in my development as a software developer. I will take the lessons and skills I learned and apply them to my further work.

-----------------------------------------

## Internship Report
> Tao Ren

In this summer term, from May 16 to Aug 12, I worked at Ansys Inc as my summer internship. I worked in Digital Twin Team and was responsible for
development of Twin Deployer.

Twin Deployer is an application that provides generation and deployment for models. It allows users to change and deploy a model exported from Twin Builder or other model builder software. It is a native application developed by Electron, Quasar and Lumino framework which has the cross-platform
compatibility so that it can run on Windows, Linux and Mac System. It also has a local backend developed by Tornado, which provides APIs to complete simulation, project management, and other calculation tasks.

My task is to transform Twin Deployer from Electron Application to Browser Application. Most of my work revolves around developing browser mode for
Twin Deployer. Before I started, Twin Deployer only supported Electron mode which means users can use this application only after packaging and installation.

It is a great and meaningful idea to transform Twin Deployer from an Electron Native APP to a complete browser APP. There are lots of native Apps having
their browser version, like VScode, Matlab, etc. It not only reduces the problems related to dependencies in operating system, which is always the massive trouble for cross platform APP, but also provides a better user experience. The most common complaint from our users is that our software
doesn't work on their system. And it is either because of a missing dependency or because a certain system version lacks of a specific dependency. Anyway, it greatly affects our user experience. That's why the transformation to browser is such a great idea to solve these problems. In browser version, users can basically use Twin Deployer everywhere without the installation and
considering any dependencies problem. There is no doubt that it can deliver more smoothly user experience in browser mode.

I'm trying to provide the same user experience as native APP. It's not a easy task, to achieve it, there are many problems need to be solved.

First of all, I need to figure out a way to support 2 modes switching in compilation with targeted mode arguments.

Secondly, I need to make sure the dependencies all correct in browser mode, which means I need to prune many Electron dependencies because they
invokes the operating system APIs and these APIs need to be re-implemented in browser mode by the new APIs provided by browser. Besides, for these re-implemented features, I need to develop new APIs on backend to complete the entire process.

For the first problem, I studied from Quasar documents and found out a way to inject the mode variables when booting. In Twin Deployer, we use Quasar framework to create an Electron App, and Quasar also supports SPA (Single Page Application, one popular type of browser application design) compilation with specific configuration. So I edited the “quasar.config.js” file to set a SPA config as browser mode. When developers build the project with “browser” argument, it will use SPA config to build the entire project. And when project boots, it will inject the specific variable mode as “spa” to the global Vue instance and globalThis which is a variable to provide standard access to the
global variable in browser, node and other JavaScript runtime. While in Electron, it will inject the mode as “electron” in booting. Through this trick, in project, we can render different components and import corresponding
dependencies based on mode variable.

That’s how I handle the mode switching and dependencies conflicts. But it is not over for this transform. There are lots of functions can not work in browser as native App. File upload is one of the most characteristic problem.

From Electron to browser, file upload is a very troublesome problem because all the operations related to file system are provided by operating system and can not be used in browser. Due to security policy in browser, a web application can not just operate user’s files without user’s permission. Even user authorizes the permission, it is very restricted to operate to this file unless user upload this file actively. That’s why I need to implement chunk upload function in browser mode. To reduce the changes for the original part (Electron mode) and to support better two mode switching, I choose to implement a new component, which is a HOC(Higher Order Component) wrapper so that I can make it support browser mode with the least changes for original codes.

What I need to do is to add this wrapper to the original component to create a new component only rendering in browser mode, and set the original component as Electron mode. In browser mode, it will only render the new component with new logic to handle import project.

Of course there are many details about File Chunk Upload implementation. I implemented many backend APIs to complete the entire chunk upload process.

I also implemented a concurrent request pool to send upload chunks under the control of this restricted request pool, which avoids request jam for our server.

By the way, based on this request pool, I also implemented a better progress bar depends on each chunk status in request pool. There are many details about backend APIs which developed based on Tornado framework, kinds of redundant, so I will not talk too much about technology details.

After this internship, learned a lot not only in software engineering but also in team work and remotely work style. Through this practice I learned many technology frameworks like Quasar, Vue, Electron, Webpack, TypeScript, Swagger, Tornado, PyTest and Pydantic, it vastly improved my ability in Software Engineering.

## Internship Final Presentation

Transcripts

## Slide 1 - Intro

Hello, everyone, I'm Tempest. Welcome to my final presentation. 

I'm a graduate student in the University of Pittsburgh majoring in Information Science. I spent four year in SUSTech from 2016 to 2020 and completed my Bachelor study in Engineering and Computer Science major. After that, I worked for 1 year at Ant Group as a SDE in Alipay Wealth Team. And then, I decided to come to US and achieve my Master's. Degree. My expected graduation date is Dec 2022.

I'm a typical programmer, a nerdy and scholarly developer and researcher. I enjoy spending my time on programming, studying the latest technology, and discuss them in the community.

I'm interested in video games and also obsessed with game development  and game engine.

## Slide 2 - Twin Deployer

Ok, let's see what did I work on in this summer intership?

The anwser is Twin Deployer.

Twin Deployer is an application which provides generation and deployment for models. It allows users to 

change and deploy a model exported from Twin Builder or other model builder software. It is a native 

application developed by Electron, Quasar and lumino framework which has cross-platform compatibility 

so that it can run on Windows, Linux **/lainʌks/** and Mac System. It also has a local backend developed by 

Tornado, which provides APIs to complete simulation, project managment, and other calculation tasks.

And my task is to transform Twin Deployer from Electorn Applicaiton to Browser Application.

Most of My work revolves around browsers mode. Before I start, the Twin Deployer only supports Electron mode which means we can use this application only after packaging and installation.

It is a great idea to transform Twin Deployer from Electron Native App to a complete browser App. There are lots of native Apps have their browser version, like VScode, matlab. 

It not only reduces the problems related to dependencies in OS, which is always the massive trouble for cross platform App, but also provides a better user experience. 

The most common complaint from our users is that our software doesn't work on their OS. 

And it is either**/ˈiːðər/** because of a missing dependency or because a certain system version lacks of a specific dependency. Anyway, it greatly affects our user experience. That's why the transformation to Browser is such a great idea to solve these problems.

For browser version, you can basically use this App everywhere without installations and considering any dependencies problem. There is no doubt that we can deliver smoothly user experience in browser.


Here are pictures showing the electron mode and browser mode of Twin Deployer. As you see, I'm trying to provide the same user experience as native app. It's not easy, to acheive it, there are many problems need to be solved.

First of all, I need to figure out a way to support 2 modes in compilation.

And I also need to make sure the dependencies all correct in Browser mode, which means I need to prune many electron dependencies because they invokes the OS API and these parts need to be reimplemented in browser mode. OfCourse, for these reimplemented features, I need to develop new APIs for them.

## Slide 3 - Browser Upload

This part is shows how I transformed Twin Deployer to browser mode and how I reimplemented the features. Here is a gif picture to show what is the final work looks like. From electron to browser, file upload is a very troublesome problem because all the operations related to file system are provided by OS and can not be used in browser. 

To reduce the changes for the original part and to support better two mode switching, I choose to implement a new component, which is a HOC(Higher Order Component) wrapper so that I can make it support browsers without changing the style codes. 

What I need to do is add this wrapper to the original component to create a new component only rendering in browser mode, and set the original component as Electron mode. 

Of course there are many details about File Chunk Upload implementation, like this picture shows. I implemented five APIs to complete the entire chunk upload process.

I also implemented a concurrent request pool to send upload chunks under the control of this restricted reqeust pool, which avoids request jam for our server. By the way, based on this request pool, I also implemented a better progress bar depends on each chunk status.

## Slide 4 - Backend

Like I said, the changes from electron  mode to browser mode not only needs the re-implementations of frontend's components, but also needs backend's support. In browser mode, the basic logic of interaction  between client and server needs to be changed. Previously, the client performed file operations through the API provided by the OS, and sent the file path to the backend. 

Now, in browser mode, I need to find a more browser-friendly way to complete this process. That's why I did a lot of work in chunk upload. In browser mode, I develop some new APIs to handle file resources and make sure the whole process is as similar as possible to the original.

Here is a picture to show what happens in backend. 

#### Implementation Detail

When the client starts a file upload, it will invoke chunk upload initialization and after some file operations, the client will receive the signal of initialization ready and then it can send chunks to the server. In this process, the clients can choose to stop and continue upload at anytime. The chunks already uploaded will be saved on the server. After uploading, the client will receive a relative path and it can use this path to request other original APIs in backend, like import project, open project.

There is a timed task to control the resources clean for each upload. After considering multiple implementations, I choose to use Async IO in Tornado to implement the timed task class. Because the async IO in Tornado depends on coroutine, and it has a good performance compared to the process implementation and thread implementation.

--------------------------


Besides, all the backend APIs are implemented using OOP and Dependency Injection for better maintainability. 

And I also created many unit tests to ensure stability of these APIs. In unit tests, I created several different scences, called APIs, and tested uploads under different file sizes, types and different content-type.


## Slide 5 - Lessons Learned

In this internship, I learned a lot not only in software engineering but also in team work and remotely work style. Through this practice I learned many tech frameworks like Quasar, Vue, Electron, Webpack, TypeScript, Swagger, Tornado, PyTest and Pydantic, it vastly improved my ability in Software Engineering.


## Slide 6 - Future Plan

Here I want to mension my future plan. I will finish my Master's Degree. And I will learn more about Typescript, Electron, Rust and to be a better developer.

I want to do more contributions to open-source community, and try more practice on full-stack project.

If I have time, I would like to develop an individual game based on Unreal Engine 5 and develop an interesting App based on AGI(Artificial General Intellingence) like GPT-3


Here I want to appreciate my mentor grayson, who helped me a lot in my internship, always give me the wise directions and joint debugging with me for several hours.

Also I want to say thanks to my Manager Xiao, and colleague**/'kɔli:ɡ/** Adriano, who asked me questions and always inspired me.

Besides, I also want to appreciate Robert in IT department, who saved me from stupid virtual Machine problems.

Last, here is my appendix.

That's all for my presentation. Any questions?