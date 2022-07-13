# html.js
Javascript HTML Builder

Examples:
```
let h = new html('div');
h.append('h1').text('Heading 1').close();
return h.render();

>>> <div><h1>Heading 1</h1></div>
```

```
let h = new html('div')
        .textBlock('h1','Heading 1')
        .textBlock('p','This is a paragraph of text, styled dangerously.','text-danger')
        .close();
return h.render();

>>> <div><h1>Heading 1</h1><p class="text-danger">This is a paragraph of text, styled dangerously.</p></div>
```
