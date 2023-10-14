# my-ui

I dont know whether something like this exists already, but I always wanted to write html components which I can re-use in my projects.

I know that there are frameworks like Angular, React, Vue, etc. but I wanted to write something which is more lightweight and easy to use.

So, I came up with this idea of writing html components which can be imported in other html files and can be used as a tag.

This is just a proof of concept and I am not sure whether this is a good idea or not.

## Installation

```bash
# yet to be published, but for now you can clone the repo and run the following command
```

```bash
# clone the repo
git clone https://github.com/razaahmad333/my-ui.git 
```

```bash
# install the dependencies
npm install
```

```bash
# run the project
npm start
```

and then open `http://localhost:8080` in your browser. Make changes to `app/`  folder and see the changes in the browser.


## Usage

```html
<!-- app/components/my-button.html -->
<button>Click me</button>
```

```html
<!-- app/index.html -->
<html>
  <head> </head>
  <body>
    <import>
      <meta name="my-button" from="my-button.html" />
    </import>
    <my-button></my-button>
  </body>
</html>
```

## How it works

The `import` tag is used to import the components. The `from` attribute is used to specify the path of the component in `app/components` folder. The `name` attribute is used to specify the name of the component. The name of the component should be unique.

## Powered by parse5
This project uses [parse5](https://github.com/inikulin/parse5) to parse the html file and traverse through the nodes. 


