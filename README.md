# Concise Profile Blog
I will publish some interesting projects here to record what I learnt.

# Commands to run
Simply run the following commmand in the terminal:

This will install LiveTerm to the current directory. You can start building your website with:

```bash
cd LiveTerm && yarn dev
```

Start editing `config.json` and try saving and see the updated changes!

Alternatively, you can clone this repository to a location of your choosing

```bash
git clone https://github.com/Cveinnt/LiveTerm.git && cd LiveTerm
```

Then install dependencies and start developing there:

```bash
yarn install && yarn dev
```
## 📄 Configuration

### Basic Configuration

### Themes

You can find several pre-configured themes in `themes.json`, and you can replace the colors in `config.json` with the theme color you like! The themes are based on the themes on [this website](https://glitchbone.github.io/vscode-base16-term/#/).

### Favicons

Favicons are located in `public/`, along with the other files you may want to upload to your website. I used this [website](https://www.favicon-generator.org/) to generate favicons.

### Banner

You may also want to change the output of the `banner` command. To do that, simply paste your generated banner in `src/utils/bin/commands.ts`. I used this [website](https://manytools.org/hacker-tools/ascii-banner/) to generate my banner.

### Advanced Configuration

If you want to further customize your page, feel free to change the source code to your liking!

## 🌐 Deploy on Vercel

The easiest way to deploy a Next.js app is to use the [Vercel Platform](https://vercel.com/) from the creators of Next.js.

You can install `vercel` cli and follow the instruction [here](https://vercel.com/docs/concepts/deployments/overview).

You can also connect your github account to vercel and have vercel automatically deploy the github repository for you.

## Credit

Based on M4TT72's awesome [Terminal](https://github.com/m4tt72/terminal).
