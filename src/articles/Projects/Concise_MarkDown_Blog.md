# Concise MarkDown Blog

## 🙋‍♂️ Why

>  I previously set up a profile web application by Bootstrap Template and ThinkJS. It's tortured to update that blogs because everytime I need to use rich-text editor to generate the HTML content and write it to MySQL. Yeah, I had a small server at that time. Now I don't want to pay a server, but I still need a place to record and share my experience.

I've been looking for a way to have a **sustainably updated**, **configurable** and **extensible** personal blog with **static** web pages.

Specifically, I want to implement it without any server resources from my side.

It should be a concise web blog with the following parts.

- Self Introduction
- Blogs
- Projects Presentation
- Resume & Social Links

It should be easy to update more blog articles, and push the updates conveniently.


## Build Your Blog with in 5 mins

1. ⭐️ Fork and start this repo. 
2. ✍🏻 Edit the config file, and write some articles, anything you want to show on your blog
3. ```shell
   git add . 
   git commit -m 'some msg'
   git push
   ```
4. 🚀 Use [Github Page][7] to deploy within 3 mins 

## 🧐 How

### [Github Page][7]

To avoid extra server resources from my side, I use [Github Page][7] to deploy my project, a staic web application. It is totally free, and every github user can use it.

### Concise and Easy by MarkDown

Considering all my notes are finished by MarkDown, and indeed MarkDown is good enough to write all what I want. 

What I need are links, images, lists, codes, and texts, and MarkDown satisfies.

Here is the idea, I build this blog by dynamic loading MarkDown documents for almost every part except the basic Frontend codes for rendering MarkDown, supporting configurations or other fancy animations I want, all contents are implemented by MarkDown.

There is only one type of resources in this web application: **MarkDown** **Documents**.

All markdown documents are packaged within the web application and loaded dynamically.

#### Dynamic Loading

Using `require.context` to create a context module for all MarkDown files under `/src/articles/`
> A context module is generated. It contains references to all modules in that directory that can be required with a request matching the regular expression. The context module contains a map which translates requests to module ids.
[More about Webpack][1]

The navbar is configurable by a config file, and each navigation button can navigate to the specific markdown document. It will play an entrance role.

The content in each page is dynamically loaded and presented by a react [markdown renderer][2].

### Update Blogs

1. Write some blogs by MarkDown, clear up the links in the entry file (also markdown documents).

2. 
   ```shell
   git add . 
   git commit -m 'some msg'
   git push
   ```

By this way, I can update my blogs by markdown and use Github Repository to update, deploy and manage.

## 👨‍💻 Editor

Even you can use any [markdown editor][6] you have, I provide an Online MarkDown Editor, the input part is based on a [Fancy TextArea][3] and the preview part is based on the react [markdown renderer][2] I just mentioned, exactly the one that every page uses to render the MarkDown documents.

At least, you can use this online MarkDown editor to check the final preview of your article before `git push`. 

It supports following features:

* [x] Github Flavored [MarkDown][4]
  * [x] H1-H5
  * [x] **Bold** & *italic* & ~~strikethrough~~
  * [x] Link
  * [x] List and Tasklist
  * [x] Image
  * [x] Footnote
  * [x] Insert Codes
  * [x] Latex Math
  * [x] Table, not good, still need improvement
* [x] Some [Typora][5] Styles
  * [x] Block Quote
  * [x] H1&H2 with a divider
* [ ] Shortcut key
* [ ] Automatically Save & Recover
* [ ] Export to MarkDown file
* [ ] Export to PDF
* [ ] Electron Bundle

In the future, this editor may be separated when it is good enough to be a separate project. 

## 📋 Reminder

#### Comment

This is not an interactive blog, it doesn't support comments unless I implement it by Github Issue, kinds of silly, but it can work.

####  Online Publishment

This is a static web application, there is no way to update it synchronously. And a blog doesn't need updates synchronously. After writing new blogs, put them to `/src/articles/`, clear up links from entrance document, use `git` update new articles to your repo. In case you know nothing about [git][8].

## 📄 Configuration
Configurate everything in ```/src/config.js```.
Blog Title, Blog Navbar, some parameters about MarkDown Editor and MarkDown Preview.

### Update & Add Articles

All articles are under ```/src/articles/```. You can add folders and MarkDown articles here.

After working on you articles, you can edit the config file to set the path of the markdown file. 

The main entrance is **Navbar**.

### Navbar (Header) Config

- deault - the default navbar for main page.

Each header is an object with the following properties:

- title - header title, also can be the default path of the content

- type - header type, can be 'link' or 'article', link means a link to another page, article means a markdown file

- customUrl - custom url. for article, it chooses the custom url first, which means the path will be `/articles/[customUrl]`
  then uses title, which means the path will be `/src/articles/[title].md`
  for links, it will be a direct link to other page.



Router work with ```url?page=[page]``` like customUrl.

For example, we set
```javascript
{
  title: 'Demo',
  type: 'article'
}
```

The final path to the markdown file will be `/src/articles/Demo.md`

If we set
```javascript
{
  title: 'Demo',
  type: 'article',
  customUrl: 'subdir/demo.md',
}
```
It also leads to `/src/articles/subdir/demo.md`, case sensitive.

Through this customUrl, we can create folders under `articles` and set the path of entrances to documents.

Example for external links

```javascript
{
  title: 'Resume',
  type: 'link',
  // An external link
  customUrl: 'https://github.com/623059008'
}
```

There is a way to use link to navigate a markdown document under articles.

```javascript
{
  title: 'Demo Link',
  type: 'link',
  // An inner link with page parameter
  customUrl: '/?page=Demo.md'
}
```

Using url parameter `page`, we can assign a Markdown file to load.

This custom url provides `Demo.md` as parameters with key `page`. So it will automatically load `/src/articles/Demo.md`

It also support hierarchical direcotry,

```javascript
{
  title: 'Demo Link',
  type: 'link',
  // An inner link with page parameter
  customUrl: '/?page=subdir/demo.md&extra_params=not_interrupt'
}
```

The target path of this url is `/src/articles/subdir/demo.md`, extra url parameters won't interrupt it.

#### Reserved Name

You can not use 'Markdown' as a title, or a url parameter in the customUrl. It will navigate to my online markdown editor, case insensitive. You can close it in config.js `markdown.enable`.


#### Navigation in Markdown

If you want to jump to another markdown page in a markdown document, which is a frequent requirements in our entrance document like the blog catalog.

Usually we use `(text)[url]` to put a link. And use a same domain link with parameter `page`, we can assign an inner markdown document navigation.

For Example,
```markdown
[My Project 1](/?page=Projects/project1.md)
```

It will lead to `src/articles/Projects/project1.md`, you need to create directory `Projects` under `articles`.

For external link, direcly url on Markdown can create a link ([Github Flavored Markdown][4]).

For Example,
```markdown
www.google.com
```

## 🚀 Commands to run

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `yarn test`
Run Tests.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.


## 💻 Technical Framework
#### React
To learn React, check out the [React documentation](https://reactjs.org/).
#### Create React App
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

Other related links are in footnotes.

## ✏️ MarkDown Editors

### VSCode - [Markdown All in One][6]

I highly recommend this VSCode Extension, Markdown All in One.

It has 4,787,474 downloads, and it's totally free. 

It is developed by Yu Zhang, a professor at SUSTech, which also is my undergraduate university.

### [Typora][5]

Typora was a fancy, free markdown editor with awesome cross-platform compatibility, definitely my favorite production. I used it all the time for my undergraduate notes.  It's still fancy now, but not free.


[1]: https://webpack.js.org/guides/dependency-management/

[2]: https://github.com/remarkjs/react-markdown

[3]: https://github.com/rpearce/react-expanding-textarea

[4]: https://github.github.com/gfm/

[5]: https://typora.io

[6]: https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one

[7]: https://pages.github.com/

[8]: https://docs.github.com/en/get-started/quickstart/hello-world