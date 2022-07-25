# RuffLIB Formulate

__A RuffLIB library for transforming an object schema into an HTML form.__

▶&nbsp; __Version:__ 0.0.1  
▶&nbsp; __Repo:__ <https://github.com/richplastow/rufflib-formulate>  
▶&nbsp; __Homepage:__ <https://richplastow.com/rufflib-formulate>  
▶&nbsp; __Tests:__ <https://richplastow.com/rufflib-formulate/run-browser-tests.html>  
▶&nbsp; __Demo 1:__ <https://richplastow.com/rufflib-formulate/demo/demo-1.html>  


### Typical usage:

```js
new Formulate(
    document.querySelector('#wrap'),
    'my_form',
    {
        _meta: { title:'My Form' },
        outer: {
            _meta: { title:'Outer' },
            an_inner_boolean: Formulate.boolean(false),
            another_boolean: Formulate.boolean(true),
        },
        outer_boolean: Formulate.boolean(true),
    }
);
```


## Dev, Test and Build

Run the test suite in ‘src/’, while working on this library:  
`npm test --src`  
`npm start --src --open --test`  

Build the minified and unminified bundles in ‘dist/’ and ‘docs/’:  
`npm run build`

Run the test suite in ‘docs/’, after a build:  
`npm test`  
`npm start --open --test`  
