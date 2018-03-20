[![Build Status](https://travis-ci.org/mike-goodwin/pug-bootstrap.svg?branch=master)](https://travis-ci.org/mike-goodwin/pug-bootstrap)

# pug-bootstrap

A port of [JADE-Bootstrap](http://rajasegar.github.io/JADE-Bootstrap/) from jade to pug.

This repo is for modifing several bugs found in the original repo [pug-bootstrap](https://github.com/mike-goodwin/pug-bootstrap)

# About this fork (he110world/pug-bootstrap)

Added attributes support to mixins, ie: 

``` pug
+btn("Button")(id="myId")
```

will be converted to

``` html
<button class="btn btn-default" type="button" id="myId">Button</button>
```


