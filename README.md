# html.js
Javascript HTML Builder

Example:
```
let h = new html('div');
h.append('h1').text('Heading 1').close();
return h.render();

>>> <div><h1>Heading 1</h1></div>
```
