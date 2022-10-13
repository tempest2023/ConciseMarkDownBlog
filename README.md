# Concise MarkDown Blog

[![PayPal][badge_paypal_donate]][paypal-donations]

<a href="https://www.buymeacoffee.com/tempes666" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

## Build Your Blog with in 5 mins

1. ⭐️ Star and fork this repository, edit in your own repository.
2. ✍🏻 Edit the config file, and write some articles, anything you want to show on your blog
3. ```shell
   git add .
   git commit -m 'some msg'
   git push
   ```
4. 🚀 Use [Github Page][7] to deploy within 1 mins.
   - Click **Settings** on your repo
   - Click **Pages** on left sidebar
   - Choose **Deploy from a branch**.
   - Choose branch `gh-pages`
     > if you don't have this branch, update your `main` branch. It will automatically run Github Actions to create the `gh-pages` branch after new changes on `main`.
   - Check your own online blog.

## 🙋‍♂️ Why

> I previously developed a profile web application by Bootstrap Template and ThinkJS. It's tortured to update that blogs because everytime I need to use rich-text editor to generate the HTML content and write it to MySQL. Yeah, I had a small server at that time. Now I don't want to pay a server, but I still need a place to record and share my experience.

I've been looking for a way to setup an **easily update**, **configurable** and **extensible** personal blog by **static** web pages.

Specifically, I want to implement it without any server resources from my side.

It should be a concise web blog with the following parts.

- Self Introduction
- Blogs, includes contents with text contents, hyperlink and media resources.
- Projects Presentation
- Resume & Social Links
- Modularization & Flexibile Configs
- Update Easily (Low Code) & Version Control
- High Accessibility, Easy Deployment with CI/CD
- Free 💵
## 🧐 How
> Github + Markdown + React = Concise MarkDown Blog 
### Deployment by [Github Page][7]
> Considering my requirements, I think using **Git** and **Github** to complete the version control of my blog will be a good idea. Also Git is not a great barrier for non-technical people.
In this way, a static web application can be updated easily by maintaining Gitub repository. I even don't need to worry about the deployment and accessibility after every upadte, because once I set the CI/CD(Github Actions) ready, the process wil be automatical and stable.

To avoid extra server resources from my side, I use [Github Page][7] to deploy my project, a staic web application. It is totally free, and every github user can use it.

### Concise and Easy by MarkDown

Markdown is a good choice for blog, elegant and concise. All my notes are written by Markdown, it's easy for me to move them to my new Blog. Also Markdown is powerful enough to write and display technical article, class notes, casual thoughts, math formula, even fiction.


What I need are links, images, lists, codes, and texts, and MarkDown is good.

### React Web Application

Here is the idea, I build this blog by dynamic loading MarkDown documents for almost every part except the basic Frontend codes for rendering MarkDown, supporting configurations or other fancy animations I want, all contents are written by MarkDown.

It reduces the difficulty to maintain my own website & blog and update the contents.

No worry about the codes, only focus on markdown documents.

#### Dynamic Loading

Using `require.context` to create a context module for all MarkDown files under `/src/articles/`

> A context module is generated. It contains references to all modules in that directory that can be required with a request matching the regular expression. The context module contains a map which translates requests to module ids.
> [More about Webpack][1]

The navbar is configurable by a config file, and each navigation button can navigate to the specific markdown document. It will play an entrance role.

The content in each page is dynamically loaded and presented by a react [markdown renderer][2].

### Update Blogs

1.  Update some contents by MarkDown, clear up the links and media.

2.  ```shell
    git add .
    git commit -m 'some msg'
    git push
    ```
3.  If you already set up your Github Pages, you don't need to do anything, it will automatically run Github Actions to build this project and deploy it on `gh-pages` branchs. It will cost 3-5 mins, and then you can check the updates online and share it to your friends.

By this way, I can maintain my own Website & Blogs by MarkDown and Github.

## 👨‍💻 Editor

Although you can use any [markdown editor][6] you have, I provide an Online MarkDown Editor, the input part is based on a [Fancy TextArea][3] and the preview part is based on the react [markdown renderer][2] I just mentioned, exactly the one that every page uses to render the MarkDown documents.

At least, you can use this online MarkDown editor to check the final preview of your article before `git push`.

It supports following features:

- [x] Github Flavored [MarkDown][4]
  - [x] H1-H5
  - [x] **Bold** & _italic_ & ~~strikethrough~~
  - [x] Link
  - [x] List and Tasklist
  - [x] Image
  - [x] Footnote
  - [x] Insert Codes
  - [x] Latex Math
  - [x] Table, not good, still need improvement
- [x] Some [Typora][5] Styles
  - [x] Block Quote
  - [x] H1&H2 with a divider
- [ ] Shortcut key
- [ ] Automatically Save & Recover
- [ ] Export to MarkDown file
- [ ] Export to PDF
- [ ] Electron Bundle

In the future, this editor may be separated when it is good enough to be a separate project.

## 📋 Reminder

#### Comment

This is not an interactive blog, it doesn't support comments unless I implement it by Github Issue, kinds of silly, but it can work.

#### Online Publishment

This is a static web application, there is no way to update it synchronously. And a blog doesn't need updates synchronously. After writing new blogs, put them to `/src/articles/`, clear up links from entrance document, use `git` update new articles to your repo. In case you know nothing about [git][8].

## 📄 Configuration

Configurate everything in `/src/config.js`.
Blog Title, Blog Navbar, some parameters about MarkDown Editor and MarkDown Preview.

### Update & Add Articles

All articles are under `/src/articles/`. You can add folders and MarkDown articles here.

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

Router work with `url?page=[page]` like customUrl.

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

It leads to `/src/articles/subdir/demo.md`, case sensitive.

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

It also supports hierarchical direcotry,

```javascript
{
  title: 'Demo Link',
  type: 'link',
  // An inner link with page parameter
  customUrl: '/?page=subdir/demo.md&extra_params=not_interrupt'
}
```

The target path of this custoomUrl is `/src/articles/subdir/demo.md`, extra url parameters won't interrupt it.

#### Reserved Name

You can not use 'Markdown' as a title, or a url parameter in the customUrl. It will navigate to my online markdown editor, case insensitive. You can close it in config.js `markdown.enable`.

`404.md` under `/src/articles/` always is for Not Found page. You can change the content as other makrdown files.

#### Navigation in Markdown (`<a />`)

If you want to jump to another markdown page in a markdown document, which is a frequent requirements in our entrance document like the blog catalog.

Usually we use `(text)[url]` to put a link. And use a same domain link with parameter `page`, we can assign an inner markdown document navigation.

For Example,

```markdown
[My Project 1](/?page=Projects/project1.md)
```

It will lead to `/src/articles/Projects/project1.md`, you need to create directory `Projects` under `articles`.

For external link, direcly url on Markdown can create a link ([Github Flavored Markdown][4]).

For Example,

```markdown
www.google.com
```

#### Images and Media Resources (`<img />`)

I highly suggest that you upload your resources to third-party platform like google drive and oneDrive, and use the external link in markdown file.

For example:

```markdown
![TestImage](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWKZ9OYF0vsfYHFdozFXWdr6VBqSxu7mdHa5izCN7HWw&s)

## Base64 datasource

![TestImage2](data:image/png;base64,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)
```

You can also place your media resources under `/src/articles/`, you can create custom folders to save your resources.
It can only support the absolute path which means the path should start with `/src/articles`.

For example:

For resource at `/src/articles/Blogs/test.png`

In markdown, the reference should be

```markdown
![TestImage2](/src/articles/Blogs/test.png)
```

Support media types: svg, png, jpg, gif, jpeg, mp4, mp3, avi, ogg.

But I don't recommend you do in this way, github repositories are not cloud storage, the access speed also can not be guaranteed.

Some suggestions about images cloud storage:

- https://sm.ms/
- https://www.google.com/drive/
- https://www.microsoft.com/en-us/microsoft-365/onedrive/online-cloud-storage

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

Typora was a fancy, free markdown editor with awesome cross-platform compatibility, definitely my favorite production. I used it all the time for my undergraduate notes. It's still fancy now, but not free.

## 😋 How to contribute

Have an idea? Found a bug? See [how to contribute][contributing].

## 💖 Support my projects

I open-source almost everything I can, and I try to reply to everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications _for free_! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

- Starring and sharing the projects you like 🚀
- [![PayPal][badge_paypal]][paypal-donations] — You can make one-time donations via PayPal. I'll probably buy a coffee or tea. 🍵
- **ETH** — You can send me Ethereum at this address (or scanning the code below): `0x2a25Dad6f9E314317168FC67790c62fDEdcEd9c9`

  ![my_eth_wallet_address](https://s2.loli.net/2022/09/14/ACnm391s7bDJkFU.png)

- Alipay - You can make one-time donations via Alipay.

  <img style="width: 30%; height: auto;" src="https://s2.loli.net/2022/09/21/cYjP9ZDIzHM5RAW.jpg" />

- WeChat - You can make one-time donations via WeChat.

  <img style="width: 30%; height: auto;" src="https://s2.loli.net/2022/09/21/jqkZDpNz7ag5ist.jpg" />

Thanks! ❤️

## 📜 License

[MIT][license] © [Tempest][website]

[1]: https://webpack.js.org/guides/dependency-management/
[2]: https://github.com/remarkjs/react-markdown
[3]: https://github.com/rpearce/react-expanding-textarea
[4]: https://github.github.com/gfm/
[5]: https://typora.io
[6]: https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one
[7]: https://pages.github.com/
[8]: https://docs.github.com/en/get-started/quickstart/hello-world
[badge_paypal]: https://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: https://ionicabizau.github.io/badges/paypal_donate.svg
[paypal-donations]: https://www.paypal.com/paypalme/TaoTempest
[license]: /LICENSE
[contributing]: https://github.com/623059008/ConciseMarkDownBlog/blob/main/CONTRIBUTING.md
[website]: https://blog.epicanecdotes.games/
