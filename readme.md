## Html 2 Template
Babel plug-in that converts *.html import statements into template fragments.

Converts this:
```js
import template from './template.html';
```
into this:
```js
const template = document.createElement('template');
template.innerHTML = `...content of template.html...`;
```

## Why.
Getting tired of having templates for WebComponents as strings, and not having
code-completion in my IDE.

## Usage:
Where every you define your Babel plug-ins...
```json
{
    "plugins": ["html-2-template"]
}
```

with options
```json
{
    "plugins": [["html-2-template", {
        "ext": "template\.html?$"
    }]]
}
```


## Options

### ext
Regular expression string to match against a file-name.
Defaults to `"html?$"`

## Doesn't
Doesn't convert `require('./template.html')` statements, only `import`.

## In the wild..
To be able to split out the markup and code when defining web-components,
means that the IDE can identify the file extension and provide code highlight/completion accordingly.

It also means that the web-component deceleration is cleaner, as it doesn't have a big block
of template string defining the DSL.

Old way:
```js
export default class Component extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                :host{
                    display: block;
                }
            </style>
            <div>
                I am a web component
            </div>
        `
    }
}
```

New way:
```js
// ./index.js
import template from './template.html';

export default class Component extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
```

```html
<!-- ./template.html -->
<style>
    :host{
        display: block;
    }
</style>
<div>
    I am a web component
</div>
```