import jsep from 'jsep';
jsep.addBinaryOp("in");
jsep.addBinaryOp("notin");

/**
 * Tells if an object is OK against an expression.
 * 
 * Expression could be Attribute compared to a value or Attribute compared to another Attribute value
 * 
 * @param {*} item 
 * @param {*} expr 
 * @return {boolean}
 */
export function test(item,expr){
    if(expr!=="" && item){
        try{
            let parse_tree = jsep(prepareExpression(expr));
            if(parse_tree.type==='BinaryExpression' || parse_tree.type==='LogicalExpression' || parse_tree.type==='UnaryExpression'){
                return check(item,parse_tree);
            }
            else{
                return false;
            }
        }
        catch(ex){
            return false;
        }
    }
}

/**
 * Prepare expression for jsep
 * 
 * Allows user to write "true OR false" instead of "true || false"
 * 
 * IN  -> in
 * AND -> &&
 * OR  -> ||
 * =   -> ==
 * <>  -> !=
 * 
 * @param {*} expr 
 */
function prepareExpression(expr){
    let tmp = expr.toString();

    //add spaces before and after '==' '<=' '>='
    tmp = tmp.replace(/(==)/g, ' == ');
    tmp = tmp.replace(/(<=)/g, ' <= ');
    tmp = tmp.replace(/(>=)/g, ' >= ');

    //replace '=' by ==
    let regex=/[^\s<>!=](=)[^<>=\s]/g;//check for '=' not preced or folowed by operator char
    //repalce all occurence by a place holder
    let groups = regex.exec(tmp);
    while(groups!==null){
        if(groups && groups[1] && groups[1]==="="){
            let s = tmp.split('');
            s[groups.index+1]="•equal•";
            tmp=s.join('');
            groups = regex.exec(tmp);
        }
        else{
            groups=null;
        }
    }
    //replace placeholder by real operator
    tmp = tmp.replace(/(•equal•)/g, ' == ');

    //other operator
    tmp = tmp.replace(/(\sand\s|\sAND\s)/g, ' && ');
    tmp = tmp.replace(/(\sor\s|\sOR\s)/g, ' || ');
    tmp = tmp.replace(/(\sIN\s)/g, ' in ');
    tmp = tmp.replace(/(\sNOTIN\s)/g, ' notin ');
    tmp = tmp.replace(/(\s=\s)/g, '==');
    tmp = tmp.replace(/(<>)/g, '!=');
    return tmp;
}

/**
 * Check recursively a node
 * @param {*} item 
 * @param {*} node 
 * @return {boolean}
 */
function check(item,node){
    switch(node.type){
        //logical expression -> test it
        case "LogicalExpression":{
            switch(node.operator){
                case "&&":
                    return check(item,node.left) && check(item,node.right);
                case "||":
                    return check(item,node.left) || check(item,node.right);
                case "^":
                    return check(item,node.left) ^ check(item,node.right);
                default:
                    throw "Unsupported Logical operator";
            }
        }
        case "UnaryExpression":{
            switch(node.operator){
                case "!":
                    return !check(item,node.argument);
                default:
                    throw "Unsupported Unary operator";
            }
        }
        case "BinaryExpression":{
            let id = null,lit=null;
            //1. determine Identifier part (Identifier) and value part (Literal or ArrayExpression))
            if(node.left.type==="Identifier" && node.right.type==="Identifier"){
                return evalAttrAgainstAttr(item,node,node.left,node.right);
            }
            else if(node.left.type==="Literal" && node.right.type==="Literal"){
                return evalLiteralValueAgainstLiteralValue(item,node,node.left,node.right);
            }
            else if(node.left.type==="Identifier" && node.right.type==="Literal"){
                id=node.left;
                lit=node.right;
            }
            else if(node.right.type==="Identifier" && node.left.type==="Literal"){
                id=node.right;
                lit=node.left;
            }
            else if(node.left.type==="Identifier" && node.right.type==="ArrayExpression"){
                id=node.left;
                lit=node.right;
            }
            else if(node.right.type==="Identifier" && node.left.type==="ArrayExpression"){
                id=node.right;
                lit=node.left;
            }
            else{
                throw `Unsupported node combo :  ${node.right.type} and ${node.left.type}`;
            }
            //check attribute value
            return evalAttrAgainstLiteralValue(item,node,id,lit);
        }
        default:
            throw "Unsupported expression";
    }
}

/**
 * Check if attribute in item identified by id.name eval attribute in item identified by id2.name 
 * @param {*} item 
 * @param {*} node 
 * @param {*} id 
 * @param {*} id2 
 * @return {boolean}
 */
function evalAttrAgainstAttr(item,node,id,id2){
    //pre-condition
    if(!item.hasOwnProperty(id.name) || !item.hasOwnProperty(id2.name)){
        return false;
    }
    switch(node.operator){
        case "==":
            return item[id.name]===item[id2.name];
        case "<=":
            return item[id.name]<=item[id2.name];
        case ">=":
            return item[id.name]>=item[id2.name];
        case "<":
            return item[id.name]<item[id2.name];
        case ">":
            return item[id.name]>item[id2.name];
        case "!=":
            return item[id.name]!==item[id2.name];
        default:
            return false;
    }
}

/**
 * Check if attribute in item identified by id.name eval lit.value 
 * @param {*} item 
 * @param {*} node 
 * @param {*} id 
 * @param {*} lit 
 * @return {boolean}
 */
function evalAttrAgainstLiteralValue(item,node,id,lit){
    //pre-condition
    if(!item.hasOwnProperty(id.name)){
        return false;
    }
    switch(node.operator){
        case "==":
            return item[id.name]===lit.value;
        case "<=":
            return item[id.name]<=lit.value;
        case ">=":
            return item[id.name]>=lit.value;
        case "<":
            return item[id.name]<lit.value;
        case ">":
            return item[id.name]>lit.value;
        case "!=":
            return item[id.name]!==lit.value;
        case "in":
            //check if there's a value in array that match item
            return lit.elements.find(tmp => (item[id.name] && tmp.type==="Literal" && item[id.name]===tmp.value)) !== undefined;
        case "notin":
            //check if there's no value in array that match item
            return lit.elements.find(tmp => (item[id.name] && tmp.type==="Literal" && item[id.name]===tmp.value)) === undefined;
        default:
            return false;
    }
}

/**
 * Eval literal agains literal
 * @param {*} item 
 * @param {*} node 
 * @param {*} id 
 * @param {*} lit 
 * @return {boolean}
 */
function evalLiteralValueAgainstLiteralValue(item,node,lit1,lit2){
    switch(node.operator){
        case "==":
            return lit1.value===lit2.value;
        case "<=":
            return lit1.value<=lit2.value;
        case ">=":
            return lit1.value>=lit2.value;
        case "<":
            return lit1.value<lit2.value;
        case ">":
            return lit1.value>lit2.value;
        case "!=":
            return lit1.value!==lit2.value;
        default:
            return false;
    }
}