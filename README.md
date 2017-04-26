## Prokki Ajax

[![LICENSE](https://img.shields.io/badge/release-0.0.2-blue.svg?style=flat)](https://github.com/prokki/prokki-ajax/tree/0.0.2)
[![LICENSE](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](LICENSE)
[![https://jquery.com/](https://img.shields.io/badge/jQuery->3.0-red.svg?style=flat)](https://jquery.com/)

This is a small javascript snippet to extend the default `jQuery.ajax()` function with an overlay while loading.
 
### Integrations

Download the code from GitHub and copy the dist directory to your project.

Include the following lines of code in the `<head>` section of your HTML.

```html
<link href="path/to/jquery.prokkiajax.min.css" rel="stylesheet" />
<script src="path/to/jquery.prokkiajax.min.js"></script>
```

### The Basics

Since jQuery 3.0 the `jQuerty.ajax()` returns a `jqXHR` object which extends the chainable [Deferred Object](https://api.jquery.com/category/deferred-object/).

The methods `success`, `complete` and `error` are marked as *deprecated*, the deferred methods `done`, `fail` and `always` should be used instead. 

#### Options

```javascript
let pa = $.prokkiajax({
    overlay: "#ajax-loading",
    overlayAuto: true,
    spinner: "<i class=\"fa fa-spinner fa-spin fa-3x fa-fw\"></i><span class=\"sr-only\">Refreshing...</span>",
    minDuration: 500,
    beforeSend: null
});
```

#### Simple Usage

The `ajax()` is responsible for
1. showing the overlay and
2. excuting the asynchronous request.

In the deferred `always` method the overlay will be hidden.

```javascript
let pa = $.prokkiajax({
    url: 'my_controller.php',
});

pa.ajax().always(pa.hideOverlay.bind(pa));
```

#### Extended Usage

```javascript
let pa = $.prokkiajax({
    url: 'my_controller.php',
    beforeSend: function ()
    {
        console.log('Overlay is visible, but ajax request was not sent.');
    }
});

pa.ajax()
    .done(function ()
    {
        console.log('Method done: Overlay is still visible.');
    })
    .always(function ()
    {
        console.log('Method always I: Overlay is still visible.');
        
        pa.hideOverlay();
        
        console.log('Method always I: Overlay is removed.');
    })
    .always(function ()
    {
        console.log('Method always II: Overlay is removed');
    });
```
