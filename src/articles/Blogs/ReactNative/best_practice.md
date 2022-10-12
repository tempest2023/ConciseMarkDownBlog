## Best Practice for React Native Project
> 2022-10-12 02:47:05

In recent, I'm working on React Native application setup. That's the work for my lab, SHRS-Rehab Sci & Tech Lab in the University of Pittsburgh.

My mentor asked me to set up a modulization application with the good compatibility for iOS and Android. And we have an old project powered by React Native and it performs not bad. That's why I've been doing React Native recently. I won't talk much about the details about my work, but I'd like to share some common libraries and experience here.

Here is a recipe I explored. I tried to combine all the best practice in React community and also suggested by the official (React Native developers). There is no doubt that many replacements are different with React (web applications).

## Scaffold & cli-tool
[expo](https://docs.expo.dev/)

It's not totally free because they provide deployment and release services.

But as a scaffold, it's free and suggested by React Native official developers.

Personally, I met some version problems and read the old docs, it's messy. So make sure you get the latest version and documents.

It's on good maintainance, but not every demo can run succesfully on my computer :<.

### Commands

#### Dependencies Installs
`yarn install`

#### Launch a iOS app
Require: Mac OS

Open a iOS simulator first: `open -a simulator`

If you don't have a simulator, install one before launch.
After open the simulator, run this command to launch the app on your simulator

`yarn ios`

#### Launch an Android app

Require: Android Simulator

`yarn android`

#### Launch a Web App
`yarn web`

## Components Library

[react-native-paper](https://callstack.github.io/react-native-paper/getting-started.html)

That's depends on your demand for UI. But react-native-paper is a react-native components library with material design.

It provides simple components you may need to build an mobile application. But it doesn't include a map component.

Also it has rich demo and components examples so that developer can directly copy to use.

Expo demo with react-native-paper can not launch on my computer, it's the version problem of expo-cli (pay attension to it).

## Router
[react-navigation v6.x](https://reactnavigation.org/docs/getting-started)

Router is a common concept in React web application. In React applicaiton, we may use react-router to manage our pages switching.

However, it is not a good choice on React Native applicaiton. Here is a replacement: [react-navigation v6.x](https://reactnavigation.org/docs/getting-started)

React Navigation is suggested by expo. It uses Stack to manage pages switching and going back and provides rich pages switch animation.
It helps us to define the content of the header for each pages, very friendly for Android/iOS developers.

## State Manager

[Redux](https://redux.js.org/introduction/getting-started)

As same as web


## Validation & Lint

### ESLint & Prettier
Here is an article to teach you to set up the eslint and prettier for react-native.
[How to set up?](https://three29.com/set-up-eslint-and-prettier-for-react-native-projects/)

Due to version problem, there are some changes.
```js
{
    "env": {
        "browser": true,
        "es2021": true,
        "react-native/react-native": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb",
        "airbnb/hooks",
        "prettier"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "rules": {
        // custom rules, if you don't want to set it off, delete it
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-props-no-spreading": "off",
        "react/forbid-prop-types": "off",
        "react/require-default-props": "off",
        "no-unused-vars": "warn"
    }
}
```


### Props Types
[PropTypes](https://www.npmjs.com/package/prop-types)

No need to say, it's as the same as React web application.

JavaScript only. If you use TypeScript, no need to install it.

## LocalStorage or Cookie
> Cookie based auth can not work properly for now: [issue](https://github.com/facebook/react-native/issues/23185)

So it's suggested to use keychain to save user token.

### Async Storage
> An equivalent of Local Storage from the web

[React Async Storage](https://react-native-async-storage.github.io/async-storage/docs/install/)

Total storage size is capped at 6 MB by default, Per-entry is limited by a size of a WindowCursor, a buffer used to read data from SQLite. Currently it's size is around 2 MB.

If you want to handle larger size, see documents about multiGet/multiSet

Use it for:
- Persisting non-sensitive data across app runs
- Persisting Redux state
- Persisting GraphQL state
- Storing global app-wide variables

Do not use it for:
- Token storage
- Secrets

### Secure Storages

[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)

On iOS, it uses the keychain services, and on Android, it uses the SharedPreferences.

Size limit for a value is 2048 bytes, it won't work for web.

So you should detect the Platform (provided by React Native) and invoking localStorage or other web secure lib to replace it if you want to provide web compatibility.


