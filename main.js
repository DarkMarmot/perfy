
function DStream(){

}

DStream.prototype.handle = function(d){

};

const NULL_STREAM = new DStream();

function RStream(f, next){
    this.v = 0;
    this.f = f;
    this.next = next || NULL_STREAM;
}

RStream.prototype.handle = function(d){

    const f = this.f;
    const v = this.v = f(d, this.v);
    this.next.handle(v);

};

function MStream(f, next){

    this.f = f;
    this.next = next || NULL_STREAM;
}

MStream.prototype.handle = function(d){
    const f = this.f;
    this.next.handle(f(d));
};


function FStream(f, next){
    this.f = f;
    this.next = next || NULL_STREAM;
}

FStream.prototype.handle = function(d){

    const f = this.f;
    f(d) && this.next.handle(d);

};


function FMStream(f, m, next){
    this.f = f;
    this.m = m;
    this.next = next || NULL_STREAM;
}

FMStream.prototype.handle = function(d){

    const f = this.f;
    const m = this.m;
    f(d) && this.next.handle(m(d));

};


function add1(x){
        return x + 1;
}

function even(x){
    return x % 2 === 0;
}

function sum(x, y){
    return x + y;
}

const s3 = new RStream(sum);
const s2 = new MStream(add1);
const s1 = new FStream(even);

s1.next = s2;
s2.next = s3;


var dd = Date.now();

for(var j = 0; j < 100; j++) {
    s3.v = 0;
    for (var i = 0; i < 1000000; i++) {
        s1.handle(i);
    }
    //console.log(s3.v, Date.now() - dd);
}
console.log(s3.v, Date.now() - dd);