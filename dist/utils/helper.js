'use strict';

var l=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports);var u=l((m,r)=>{var i={calcItemTotal:function(t){let n=t.price||0,e=t.quantity||1;return (n*e).toFixed(2)},calcSubTotal:function(t){if(t.length===0)return 0;let n=0;return t.forEach(e=>{n+=Number(this.calcItemTotal(e));}),n.toFixed(2)},calcTax:function(t){if(t.length===0)return 0;let n=0;return t.forEach(e=>{let o=e.price,c=e.quantity,a=e.tax||0;n+=o*c*a/100;}),n.toFixed(2)},calcFinalTotal:function(t){if(t.length===0)return 0;let n=Number(this.calcSubTotal(t)),e=Number(this.calcTax(t));return (n+e).toFixed(2)}};r.exports=i;});var helper = u();

module.exports = helper;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=helper.js.map