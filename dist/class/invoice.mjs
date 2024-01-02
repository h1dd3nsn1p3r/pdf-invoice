var a=(n=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(n,{get:(t,e)=>(typeof require<"u"?require:t)[e]}):n)(function(n){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+n+'" is not supported')});var l=a("fs"),h=a("pdfmake"),c=class{payload;company;invoice;customer;items;qr;note;date;constructor(t){this.payload=t,this.company=t.company,this.customer=t.customer,this.invoice=t.invoice,this.items=t.items,this.qr=t.qr,this.note=t.note,this.date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"numeric",day:"numeric"});}create(){let t=new h(this.fonts()),e={pageSize:"A4",orientation:"portrait",pageMargins:[40,40,40,40],info:this.meta(),content:this.render(),defaultStyle:{fontSize:10,lineHeight:1.8,bold:!1,font:"Helvetica",color:"#222222",columnGap:30},styles:{h1:{fontSize:18,bold:!0},h2:{fontSize:16,bold:!0},h3:{fontSize:14,bold:!0},text:{fontSize:10,bold:!1},textBold:{fontSize:10,bold:!0}}},i=t.createPdfKitDocument(e);i.pipe(l.createWriteStream("./invoice.pdf"));i.end();}fonts(){return {Helvetica:{normal:"Helvetica",bold:"Helvetica-Bold",italics:"Helvetica-Oblique",bolditalics:"Helvetica-BoldOblique"}}}meta(){return {title:"Invoice - #"+this.invoice.number,author:this.company.name,subject:"Invoice - "+this.customer.name,keywords:"invoice"}}render(){let t=[],e={columns:[{width:"70%",stack:[],style:"text"},{width:"30%",stack:[],style:"text"}]};this.company.name&&e.columns[0].stack.unshift({text:this.company.name,style:this.company.logo?"h2":"h1"}),this.company.address&&e.columns[0].stack.push({text:this.company.address,style:"text"}),this.company.phone&&e.columns[0].stack.push({text:this.company.phone,style:"text"}),this.company.email&&e.columns[0].stack.push({text:this.company.email,style:"text"}),this.company.website&&e.columns[0].stack.push({text:this.company.website,style:"text"}),this.invoice.label?e.columns[1].stack.unshift({text:this.invoice.label,style:"h1"}):e.columns[1].stack.unshift({text:"I N V O I C E",style:"h1"}),this.invoice.number&&e.columns[1].stack.push({text:`Ref no: #${this.invoice.number||1}`,style:"textBold"}),this.invoice.date&&e.columns[1].stack.push({text:`Date: ${this.invoice.date||this.date}`,style:"text"}),this.invoice.dueDate&&e.columns[1].stack.push({text:`Due Date: ${this.invoice.dueDate||this.date}`,style:"text"}),this.invoice.status&&e.columns[1].stack.push({text:`Status: ${this.invoice.status||"Due to pay!"}`,style:"textBold"}),t.push(e);let i={columns:[{width:300,margin:[0,30,0,0],stack:[{text:"Bill To:",style:"h2"}],style:"text"}]};this.customer.name&&i.columns[0].stack.push({text:this.customer.name,style:"textBold"}),this.customer.address&&i.columns[0].stack.push({text:this.customer.address,style:"text"}),this.customer.phone&&i.columns[0].stack.push({text:this.customer.phone,style:"text"}),this.customer.email&&i.columns[0].stack.push({text:this.customer.email,style:"text"}),t.push(i);let o={margin:[0,30,0,0],lineHeight:1.5,table:{widths:[200,50,"*",50,"*"],headerRows:1,lineHeight:1.5,body:[[`
 Item`,`
 Qty`,`
 Price`,`
 TAX`,`
 Total`]]}};this.items.length>0&&this.items.forEach(s=>{o.table.body.push([`
 ${s.name}`,`
 ${s.quantity}`,`
 ${this.invoice.currency||"$"}${s.price}`,`
 ${s.tax||0}%`,`
 ${this.invoice.currency||"$"}${s.quantity*s.price}`]);}),t.push(o);let r={margin:[0,20,0,0],columns:[{width:"*",stack:[" "],style:"text"},{width:200,lineHeight:1.5,style:"textBold",table:{widths:[100,"*"],headerRows:1,lineHeight:1.5,body:[[`
 Sub total:`,`
 \xA3814`],[`
 Total tax:`,`
 \xA30`],[`
 Total:`,`
 \xA3814`]]}}]};if(t.push(r),this.payload.qr){let s={margin:[0,100,0,0],qr:this.payload.qr.src,fit:this.payload.qr.width||"50"};t.push(s);}if(this.payload.note){let s={margin:[0,this.payload.qr?20:100,0,0],text:this.payload.note.text,italics:this.payload.note.italic||!0};t.push(s);}return t}};

export { c as PDFInvoice };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=invoice.mjs.map