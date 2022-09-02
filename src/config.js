/**
 * @author Tempest
 * @email tar118@pitt.edu
 * @create date 2022-09-02 17:02:50
 * @modify date 2022-09-02 17:58:48
 * @desc [description]
 */
const config = {
  // github readme url
  readmeUrl: '',
  // blog title, on left top of the page
  title: "Tempest's Blog",
  // author name
  name: 'Tempest(Tao Ren)',
  // social links, on bottom of the page
  social: {
    github: 'github',
    linkedin: 'linkedin'
  },
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
      customUrl: 'https://drive.google.com/file/d/1iVeW9GOa1LEDt3dqW4KKw63wrsfYrjm-/view?usp=sharing'
    }
  ],
  articles: {
    About: '',
    Projects: '',
    Blog: ''
  },
  markdown: {
    loading: false,
    renderDelay: 0,
    tabSize: 2
  },
  themeChange: true,
  email: 'tar118@pitt.edu',
  repo: 'https://github.com/623059008/Profile',
  resume_url: '',
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
