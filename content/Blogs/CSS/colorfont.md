### CSS The gradient font
> 2019-03-26 15:15:20

I found that Animation.css they use a gradient color font, very interesting.
So I inspect the css they used.

```css
  .site__title {
    color: #f35626;
    background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-animation: hue 60s infinite linear;
  }
@-webkit-keyframes hue {
    from {
      -webkit-filter: hue-rotate(0deg);
    }
    to {
      -webkit-filter: hue-rotate(-360deg);
    }
  }
```

Use `-webkit-background-clip: text` to clip the background to leave text content

And then use `-webkit-text-fill-color: transparent` to set text transparent

Use hue animation to adjust the color from 0 deg to -360 deg in 60 seconds, that's why the color changes over time.

![](https://img-blog.csdnimg.cn/img_convert/d0d48aad7448590c9f808587ca487d4f.png)