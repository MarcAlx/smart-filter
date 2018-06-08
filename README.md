# @smartorigin/smart-filter

[![npm version](https://badge.fury.io/js/%40smartorigin%2Fsmart-filter.svg)](https://badge.fury.io/js/%40smartorigin%2Fsmart-filter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A module that allows smart filtering over js array using SQL-Like where clause.

## Getting started

    npm install @smartorigin/smart-filter

## Usage

Capabilities of the mobule.

With smart-filter you can test if an object match an SLQ-Like where clause.

It could be used to expose to end user an high level language and to easily process end user expressions in JS.

You can filter/test object using the following syntax : (assuming `propA` and `propB` are properties of a js object)

    propA = 1

    propA = "2"

    propA = true

    propA = "Hello" OR propA = "Hi"

    propA = "Hello" AND propA = "Hi"

    !(propA = "Hello" AND propA = "Hi")

    propA IN ["Hello","Hi"]

    propA NOTIN ["Hello","Hi"]

    propA <> propB

    propA > 2

    propA < 4

    propA <= 4

    propA >= 4

    1=1 //means keep all

    1!=1 //means keep none

You can also write operator like this :

    = -> ==
    AND -> && 
    OR -> ||
    <> -> !=

This module is build using [JSEP](http://jsep.from.so).


### ES6

_see also /test/index.js_

First import exposed functions :

    import {filter,test} from '@smartorigin/smart-filter'

**function test(obj,expr)**

    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true,
        "propD":4,
        "propE":false,
        "propF":"KO"
    }

    //simple equality
    test(input,'propA == propA') //return true

    //simple comparison
    test(input,'propA > 1') //returns true

    //boolean expr
    test(input,'propB == "OK" && propA == 2') //return true

**function filter(arr,expr)**

    let input = [
        {
            "name":"obj1",
            "propA":2,
            "propB":"OK",
            "propC":true
        },
        {
            "name":"obj2",
            "propA":34,
            "propB":"KO",
            "propC":false
        }
    ];


    filter(input,'name="obj1" OR name="obj2"') // Returns two results

    filter(input,'name="test"')// Returns empty results

#### Non ES6

For non ES6 env just require module

    var smartfilter = require("@smartorigin/smart-filter");

    let input = {"a":"ok"};

    smartfilter.test(input,'a="ok"'); // returns true

    let arr = [{"a":"1"},{"a":"2"}];
    
    smartfilter.filter(a,'a="1"'); // return an array that contains one object.



## Contributing

Before pushing any pull request you must ensure the following points :

- you have new test to your feature / fix and `npm run test` pass.
- `npm run build` is passing
- `npm run prepublish` is passing

## About

Created by [MarcAlx](https://github.com/MarcAlx) for [Smart/Origin](https://github.com/smartorigin)

## Usefull links

https://github.com/flexdinesh/npm-module-boilerplate

## License

MIT License