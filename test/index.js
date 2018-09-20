import { assert } from 'chai';

import {filter,test} from '../src';

describe('Simple comparison', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true
    };

    it('Number equality', function () {
        assert(test(input,'propA == 2'),true);
    });

    it('Number inequality', function () {
        assert(test(input,'propA != 3'),true);
    });

    it('Number comparison 1', function () {
        assert(test(input,'propA < 3'),true);
    });

    it('Number comparison 2', function () {
        assert(test(input,'propA > 1'),true);
    });

    it('Number comparison 3', function () {
        assert(test(input,'propA <= 3'),true);
    });

    it('Number comparison 4', function () {
        assert(test(input,'propA >= 1'),true);
    });
    
    it('String equality', function () {
        assert(test(input,'propB == "OK"'),true);
    });

    it('String inequality', function () {
        assert(test(input,'propB != "KO"'),true);
    });

    it('Boolean equality', function () {
        assert(test(input,'propC == true'),true);
    });

    it('Boolean inequality', function () {
        assert(test(input,'propC != false'),true);
    });
});

describe('Literal comparison', () => {
    let input = {};
    it('Number equality', function () {
        assert(test(input,'1=1'),true);
    });

    it('Number inequality', function () {
        assert(test(input,'1!=3'),true);
    });

    it('Number comparison 1', function () {
        assert(test(input,'1 < 3'),true);
    });

    it('Number comparison 2', function () {
        assert(test(input,'2 > 1'),true);
    });

    it('Number comparison 3', function () {
        assert(test(input,'2 <= 3'),true);
    });

    it('Number comparison 4', function () {
        assert(test(input,'4 >= 1'),true);
    });
    
    it('String equality', function () {
        assert(test(input,'"OK" == "OK"'),true);
    });

    it('String inequality', function () {
        assert(test(input,'"OK" != "KO"'),true);
    });

    it('Boolean equality', function () {
        assert(test(input,'true == true'),true);
    });

    it('Boolean inequality', function () {
        assert(test(input,'true != false'),true);
    });
});

describe('Attribute comparison', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true,
        "propD":4,
        "propE":false,
        "propF":"KO",
        "propG":null
    }

    it('equality', function () {
        assert(test(input,'propA == propA'),true);
    });

    it('inequality', function () {
        assert(test(input,'propA != propB'),true);
    });

    it('Number comparison', function () {
        assert(test(input,'propA < propD'),true);
    });

    it('Number comparison 1', function () {
        assert(test(input,'propD > propA'),true);
    });

    it('String equality', function () {
        assert(test(input,'propB == propB'),true);
    });

    it('Null comparison', function () {
        assert(test(input,'propG == null'),true);
    });

    it('Not Null comparison', function () {
        assert(test(input,'propF != null'),true);
    });

    it('Single quote equality', function () {
        assert(test(input,"propB == 'OK'"),true);
    });

    it('Single quote inequality', function () {
        assert(test(input,"propF != 'OK'"),true);
    });

    it('String inequality', function () {
        assert(test(input,'propB != propF'),true);
    });

    it('Boolean equality', function () {
        assert(test(input,'propC == propC'),true);
    });

    it('Boolean inequality', function () {
        assert(test(input,'propC != propF'),true);
    });
});

describe('Boolean conditions', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true
    }

    it('A&&B', function () {
        assert(test(input,'propA == 2 && propB == "OK"'),true);
    });

    it('B&&A', function () {
        assert(test(input,'propB == "OK" && propA == 2'),true);
    });

    it('A||B', function () {
        assert(test(input,'propA == 2 || propB == "KO"'),true);
    });

    it('B||A', function () {
        assert(test(input,'propB == "KO" || propA = 2'),true);
    });
});

describe('IN NOTIN', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true
    }

    it('IN OK', function () {
        assert(test(input,'propB in ["OK","ko"]')===true,true);
    });

    it('IN KO', function () {
        assert(test(input,'propB in ["K","ko"]')===false,true);
    });

    it('NOTIN OK', function () {
        assert(test(input,'propB notin ["A","B"]')===true,true);
    });

    it('NOTIN KO', function () {
        assert(test(input,'propB notin ["OK","C"]')===false,true);
    });
});

describe('Operator replacement', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true
    }

    it('OR', function () {
        assert(test(input,'propA = 2 OR propB = "KO"')===true,true);
    });

    it('AND', function () {
        assert(test(input,'propB = "OK" AND propA = 2')===true,true);
    });

    it('IN', function () {
        assert(test(input,'propB IN ["OK","ko"]')===true,true);
    });

    it('NOTIN', function () {
        assert(test(input,'propB NOTIN ["OK","C"]')===false,true);
    });

    it('=', function () {
        assert(test(input,'propA = 2'),true);
    });

    it('<>', function () {
        assert(test(input,'propA <> 4'),true);
    });
});

describe('Unary', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true
    };

    it('!(A OR B)', function () {
        assert(test(input,'!(propA = 2 OR propB = "KO")')===false,true);
    });

    it('!(A OR B)', function () {
        assert(test(input,'(propA <> 2) || !(propA = 2 OR propB = "KO")')===false,true);
    });
});

describe('Complex comparison', () => {
    let input = {
        "propA":2,
        "propB":"OK",
        "propC":true
    };

    it('(A OR B) && IN', function () {
        assert(test(input,'(propA = 2 OR propB = "KO") && (propB IN ["OK","ko"])')===true,true);
    });
});

describe('Filter', () => {
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

    it('Filter 0 result', function () {
        assert(filter(input,'name="obj3"').length===0,true);
    });

    it('Filter 1 result', function () {
        assert(filter(input,'name="obj2"').length===1,true);
    });

    it('Filter N result', function () {
        assert(filter(input,'name="obj1" OR name="obj2"').length===2,true);
    });
});

describe('Bad expression', () => {
    let input = {
        "propA":2
    };

    it('JS loop', function () {
        assert(test(input,'while(true){;}')===false,true);
    });

    it('condition', function () {
        assert(test(input,'if(true){;}')===false,true);
    });

    it('!#@..', function () {
        assert(test(input,'sfjsdfjeàçaezi&é"')===false,true);
    });

    it('Missing prop', function () {
        assert(test(input,'propB=4')===false,true);
    });
});