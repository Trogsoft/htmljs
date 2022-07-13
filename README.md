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

```
let optionList = [
    { id: 1, label: 'Brazil' },
    { id: 2, label: 'China' },
    { id: 3, label: 'Canada' },
    { id: 4, label: 'Peru' },
    { id: 5, label: 'France' }
];

let h = new html('form').attr({ target: '/path/to/form/handler', method: 'post' })
        .div('form-group mb-3')
        .textBlock('label','Select an option')
        .append('select').class('form-control').options(optionList).selected(5).close()
        .close() //form-group
        .div('form-group mb-3')
        .textBlock('label','Enter some text')
        .input('text','','form-control')
        .close();
```

Results in (formatted for clarity):

```
<form action="/path/to/form/handler" method="post">
    <div class="form-group mb-3">
        <label>Select an option</label>
        <select class="form-control">
            <option value="1">Brazil</option>
            <option value="2">China</option>
            <option value="3">Canada</option>
            <option value="4">Peru</option>
            <option value="5" selected>France</option>
        </select>
    </div>
    <div class="form-group mb-3">
        <label>Enter some text</label>
        <input type="text" class="form-control" />
    </div>
</form>
```
