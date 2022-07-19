// HTML.js by Trogsoft.
// MIT Licence
// https://github.com/trogsoft/htmljs
// Version 3

/**
 * Create a new instance of the HTML object.
 * @param {string} rootNode - the tag name to use as the root node of the constructed HTML document.
 */
const html = function (rootNode, mixins) {

    let h = this;
    h.mixins = mixins || [];

    let node = function (tag) {

        let n = this;
        n.tag = tag.toLowerCase();
        n.attr = {};
        n.text = null;
        n.rawHtml = null;
        n.parent = null;
        n.options = [];
        n.selectedOption = null;

        n.items = [];

        n.add = function (node) {
            node.parent = n;
            n.items.push(node);
            h.current = node;
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        n.render = function () {
            let output = '<' + n.tag + '';
            Object.keys(n.attr).forEach(x => {
                let val = n.attr[x];
                if (typeof val !== "undefined" && val != null)
                    output += ' ' + x + '="' + val + '" ';
            });
            output = output.trim() + '>';
            if (n.text) {
                output += n.text;
            }
            if (n.rawHtml) {
                let dp = new DOMParser();
                let str = dp.parseFromString(n.rawHtml, 'text/html');
                output += str.documentElement.querySelector("body").innerHTML;
            }
            if (n.tag === 'select' && n.options !== null && n.options.length > 0) {

                if (n.options.filter(x => x.group).length) {

                    let distinctGroups = n.options.map(x => x.group).filter(onlyUnique);
                    distinctGroups.forEach(x => {
                        output += '<optgroup label="' + x + '">';
                        n.options.filter(y => y.group == x).forEach(y => {
                            let val = y.id || y.value || 0;
                            let label = y.label || y.title || 'Undefined';
                            let sel = (n.selectedOption && n.selectedOption == val) ? 'selected' : '';
                            output += '<option value="' + val + '" ' + sel + '>' + label + '</option>';
                        });
                        output += '</optgroup>';
                    });

                } else {

                    for (var i = 0; i < n.options.length; i++) {
                        let values = n.options[i];
                        let val = (values.id || values.value || 0);
                        output += '<option value="' + val + '" ' + (n.selectedOption && n.selectedOption === val ? 'selected' : '') + '>' + (values.title || values.label || values.value) + '</option>';
                    }

                }

            }
            if (n.items.length) {
                for (var i = 0; i < n.items.length; i++) {
                    let node = n.items[i];
                    output += node.render();
                }
            }
            output += '</' + n.tag + '>';
            return output;
        }

        return n;

    }

    /**
     * Begin an HTML element.
     * @param {string} tag - the HTML element to append.
     */
    h.append = function (tag) {
        h.current.add(new node(tag));
        return returnValue();
    }

    /**
     * Close the current HTML element and move to the parent element.
     * */
    h.close = function () {
        if (!h.current.parent) {
            h.current = null;
            return;
        }

        h.current = h.current.parent;
        return returnValue();
    }

    /**
     * Set the currently selected option for a <select> element.
     * @param {any} opt - must match the 'id' property of an element defined with .options()
     */
    h.selected = function (opt) {
        if (h.current.tag !== 'select')
            throw new Error('Current element must be <select>');

        h.current.selectedOption = opt;
        return returnValue();
    }

    /**
     * Add options to the current <select> element.
     * @param {object[]} options - an array of objects with 'id' and 'label' properties.
     */
    h.options = function (options, m) {
        if (h.current.tag === 'select') {
            if (m) {
                for (let i = 0; i < options.length; i++) {
                    h.current.options.push(m(options[i]));
                }
            } else {
                for (let i = 0; i < options.length; i++) {
                    h.current.options.push(options[i]);
                }
            }
        } else {
            throw new Error('The current tag is not a <select> element.');
        }
        return returnValue();
    }

    /**
     * Insert an <input> element.
     * @param {string} type - the type attribute for the input element. 
     * @param {string} [value] - the value attribute for the input element.
     * @param {string} [cls] - the class value for the input element.
     * @param {object} [attr] - an object specifying additional attributes and their values. 
     */
    h.input = function (type, value, cls, attr) {
        if (!type) throw new Error('You must specify a type parameter for html.input()');

        h.append('input').attr('type', type);
        if (typeof value !== "undefined" && value != null) h.attr('value', value);
        if (cls) h.class(cls);
        if (attr) h.attr(attr);
        h.close();
        return returnValue();

    }

    /**
     * Add HTML attributes to the current node
     * @param {(string|object)} attr - the name of an attribute to set, or an object specifying multiple attributes and their values.
     * @param {string} value - if name is a single attribute name, this is the value for that attribute.
     */
    h.attr = function (attr, value) {
        if (value && typeof (value) === 'string') {
            if (typeof (attr) !== 'string') {
                throw new Error('attr must be the name of an attribute when specifying a value.');
            }
            return addAttr(attr, value);
        }

        if (h.current.attr) {
            for (var key of Object.keys(attr)) {
                h.current.attr[key] = attr[key];
            }
        } else {
            h.current.attr = attr;
        }
        return returnValue();
    }

    /**
     * Set the inner text value of the current element.
     * @param {string} [text]
     */
    h.text = function (text) {
        h.current.text = text;
        return returnValue();
    }

    /**
     * Set inner HTML for the current element.
     * @param {string} htmlContent - the HTML content to set.
     */
    h.content = function (htmlContent) {
        h.current.rawHtml = htmlContent;
        return returnValue();
    }

    /**
     * Shortcut to add a href attribute to the current element.
     * @param {string} value - the value of the href attribute.
     */
    h.href = function (value) {
        return addAttr('href', value);
    }

    /**
     * Shortcut to create a div with a specified class
     * @param {string} [cls] - the class to use.
     */
    h.div = function (cls) {
        h.append('div');
        if (cls)
            h.class(cls);
        return returnValue();
    }

    /**
     * Insert an HTML table.
     * @param {string} cls - the class 
     * @param {...any} headings - headings to use for each column.
     */
    h.table = function (cls, ...headings) {
        h.append('table');
        if (cls) h.class(cls);
        if (headings && headings.length) {
            h.append('tr');
            headings.forEach(x => {
                h.append('th').text(x).close();
            });
            h.close();
        }
        return returnValue();
    }

    /**
     * Insert a row into the current HTML table.
     * @param {...any} values - the values for each column.
     */
    h.row = function (...values) {
        if (h.current.tag !== 'table') throw new Error('The current tag must be <table>');
        h.append('tr');
        values.forEach(x => {
            h.append('td').text(x).close();
        });
        h.close();
        return returnValue();
    }

    /**
     * Add a single attribute to the current element.
     * @param {string} name - the attribute name
     * @param {string} value - the attribute value
     * @param {boolean} [merge=false] - merge with existing values
     */
    function addAttr(name, value, merge) {
        if (!name) throw new Error('You must specify a name.');

        if (h.current.attr)
            if (merge && h.current.attr[name]) {
                h.current.attr[name] += ' ' + value;
            } else {
                h.current.attr[name] = value;
            }
        else
            h.current.attr = { key: value };
        return returnValue();
    }

    /**
     * Shortcut to insert a single element containing text (eg, p, div, strong, small, textarea)
     * @param {string} tag - the HTML tag.
     * @param {string} [content] - the inner text for the element.
     * @param {string} [cls] - the class string to use
     * @param {object} [attr] - an object containing attributes to set on the element.
     */
    h.textBlock = function (tag, content, cls, attr) {
        if (!tag) throw new Error('You must specify a tag.');

        h.append(tag);
        if (cls)
            h.class(cls);
        if (attr)
            h.attr(attr);
        h.text(content || '');
        h.close();
        return returnValue();
    }

    /**
     * Shortcut to insert a link.
     * @param {string} label
     * @param {string} href
     * @param {string} [cls]
     * @param {object} [attr]
     */
    h.link = function (label, href, cls, attr) {
        if (!label) throw new Error('You must specify a label.');
        if (!href) throw new Error('You must specify a value for href.');

        h.append('a');
        if (attr) h.attr(attr);
        if (cls) h.class(cls);
        h.attr({ href: href });
        h.text(label);
        h.close();
        return returnValue();
    }

    /**
     * Set the class on the current element.
     * @param {string} classList - a space separated list of classes.
     */
    h.class = function (classList) {
        if (!classList) throw new Error('You must specify a class.');
        return addAttr('class', classList, true);
    }

    /**
     * Render the HTML document.
     * */
    h.render = function () {

        let o = '';
        o += root.render();
        return o;

    }

    let root = new node(rootNode);
    h.current = root;

    const htmlProxy = {
        get(obj, prop) {
            if (obj[prop])
                return obj[prop];

            var mixin = obj.mixins[prop];
            if (mixin) {
                return function () {
                    return mixin(proxy, ...arguments);
                }
            }

        }
    }

    const proxy = new Proxy(h, htmlProxy);

    function returnValue() {
        return proxy;
    }

    return returnValue();

}
