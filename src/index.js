import {test as coreTest} from './core';

/**
 * Filter an array according to an expression
 * 
 * let arr = [{"a":1},{"a":2}];
 * 
 * filter(arr,"a=1") -> true
 * filter(arr,"a=4") -> false
 * 
 * @param {Array} arr 
 * @param {String} expr 
 */
export function filter(arr,expr){
    return arr.filter(item=> test(item,expr));
}

/**
 * Test if an item an expression
 * 
 * let item = {"a":1};
 * 
 * test(item,"a=1") -> true
 * test(item,"a=2") -> false
 * 
 * @param {Object} item 
 * @param {String} expr 
 */
export function test(item,expr){
    return coreTest(item,expr)
}