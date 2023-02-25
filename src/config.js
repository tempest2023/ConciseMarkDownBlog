/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 17:02:50
 * @modify date 2023-02-25 14:23:25
 * @desc config file
 */
const config = {
  debug: false,
  // github readme url
  readmeUrl: 'https://github.com/623059008/ConciseMarkDownBlog/blob/main/README.md',
  // blog title, on left top of the page
  title: "Tempest's Blog",
  // author name
  name: 'Tempest(Tao Ren)',
  // social links, on bottom of the page
  social: {
    github: 'https://github.com/623059008/',
    linkedin: 'https://www.linkedin.com/in/taoren-pitt/'
  },
  email: 'tar118@pitt.edu',
  repo: 'https://github.com/623059008/ConciseMarkDownBlog',
  resume_url: 'https://drive.google.com/file/d/1Myh0ANA3SbAuVLkLnGjr9xeMBaxz2RJc/view?usp=share_link',
  // default content shown on the main page, /src/articles/[config.defalt].md
  default: 'About',
  headers: [
    /**
     * each header is an object with the following properties:
     * @title - header title, also can be the default path of the content
     * @type - header type, can be 'link' or 'article', link means a link to another page, article means a markdown file
     * @customUrl - custom url. for article, it chooses the custom url first, which means the path will be /articles/[customUrl]
     * then uses title, which means the path will be /src/articles/[title].md
     * for links, it will be a direct link to other page.
     */
    {
      title: 'About',
      type: 'article'
    },
    {
      title: 'Blog',
      type: 'article'
    },
    {
      title: 'Projects',
      type: 'article',
      customUrl: 'Projects/Project'
    },
    {
      title: 'MarkDown',
      type: 'article'
    },
    {
      title: 'Resume',
      type: 'link',
      customUrl: 'https://drive.google.com/file/d/1iVeW9GOa1LEDt3dqW4KKw63wrsfYrjm-/view?usp=share_link'
    },
    {
      title: 'Links',
      type: 'article'
    }
  ],
  // markdown settings
  markdown: {
    // set it false to disable markdown editor
    enable: true,
    // set it true to enable loading animation in refreshing markdown preview.
    loading: false,
    // delay time for refreshing markdown preview
    renderDelay: 0,
    // tab size for markdown editor
    tabSize: 2,
    // the links in markdown does not have underlines, set it true to enable underline
    linkStyle: {
      textDecoration: 'none',
      // link blue
      color: '#0077ff'
    },
  },
  themeChange: true,
  colors: {
    light: {
      background: '#ffffff',
      foreground: '#feb272',
      gray: '#212529'
    },
    dark: {
      background: '#212020',
      foreground: '#653208',
      gray: '#a9a9b3'
    }
  }
}

export default config;
