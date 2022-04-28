# Quality Unit Enhanced FAQ

Quality Unit's Enhanced FAQ helps to improve searchability of pages created in Gutenberg with the FAQ widget, which fully support schema.org and supports basic formatting and links.

This plugin allows you to write up to ten (10) questions and answers. Question is a simple text without any specific style, and the answer supports headings, basic formatting (bold, italic), links, lists (bullet, numeric). Question is limited to 255 characters and the answer can contain up to 2048 characters.

## GETTING STARTED

Upload the plugin files to the `/wp-content/plugins/enhanced-faq` directory, or install the plugin through the WordPress plugins screen directly.

It's safe to activate the plugin at this point. Activate the plugin through the 'Plugins' screen in WordPress

#### Development Process

<details>
 <summary> Don't have <code>Node.js</code> + <code>yarn/npm</code> installed? You have to install them first. (CLICK TO EXPAND)</summary>

Go to the Node's site [download + install](https://nodejs.org/en/download/) Node on your system. This will install both `Node.js` and `npm`, i.e., node package manager — the command line interface of Node.js.

As we prefer `yarn` package manager over `npm`, install Yarn with command:

```sh
npm install --global yarn

# You might need to run this with sudo, like sudo npm install
```

You can verify the install by opening your terminal app and typing...

```sh
node -v
# Results into 7.19.1 — or installed version.

npm -v
# Results into v14.15.1 — or installed version.

yarn -v
```
</details>

Follow the following steps to add your functionalities to the plugin:

1. Navigate to plugin files `/wp-content/plugins/enhanced-faq`, open terminal app.
2. Run the `yarn install` command to install npm dependencies, wait sometimes to complete it.
3. Run the `yarn packages-update` command to update the package.
4. Run `yarn start` command to initialize development of React JS, Development can be done any time. Use it in the development environment.
5. Run the `yarn build` command to finalize the development and be ready for production. The command creates production files. After building the production file move it to the production level.


## Changelog
### 1.0.0
* Initial Release

## License & Attribution
- GPLv2 or later
