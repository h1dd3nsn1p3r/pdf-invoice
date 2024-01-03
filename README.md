![PDF Invoice](https://github.com/h1dd3nsn1p3r/pdf-invoice/blob/development/examples/hero.png)

📑 Simple yet powerful JavaScript library that generates PDF invoice, estimates & payment receipts from a JSON data. It can be used in any Node JS/Bun JS environment. 

## Installation

via npm:

```bash
npm install @h1dd3nsn1p3r/pdf-invoice
```

via yarn:

```bash
yarn add @h1dd3nsn1p3r/pdf-invoice
```

via pnpm:

```bash
pnpm add @h1dd3nsn1p3r/pdf-invoice
```

## Use:

Once installed, you can import either using `require` or `import`:

```js
const { PDFInvoice } = require('@h1dd3nsn1p3r/pdf-invoice');
```

or ES6 import:

```js
import { PDFInvoice } from '@h1dd3nsn1p3r/pdf-invoice';
```

`PDFInvoice` is a class that takes the payload as an argument. The payload is the data that you want to show on the invoice. For more information check the [Payload Data](https://github.com/h1dd3nsn1p3r/pdf-invoice/blob/development/examples/example.ts) example. 

## Payload Data

The payload is the data that you want to show on the invoice. It is an object with the following structure:

```js
const payload = {
    company: {
        name: "Festrol Corp.",
        address: "1711 W. El Segundo Blvd, Hawthorne, Canada - 90250",
        phone: "Tel: (+11) 245 543 903",
        email: "Mail: hello@festrol.io",
        website: "Web: https://www.festrolcorp.io"
    },
    customer: {
        name: "John Doe",
        address: "1234 Main Street, New York, NY 10001",
        phone: "Tel: (555) 555-5555",
        email: "Mail: joe@example.com",
    },
    invoice: {
        number: 1721,
        date: "25/12/2023", // Default is current date.
        dueDate: "25/12/2023", // Default is current date.
        status: "Paid!",
        currency: "€", // Default is "$"
    },
    items: [
        {
            name: "Cloud VPS Server - Starter Plan",
            quantity: 1,
            price: 400,
            tax: 0, // Specify tax in percentage. Default is 0.
        },
        {
            name: "Domain Registration - example.com",
            quantity: 1,
            price: 20,
            tax: 0, // Specify tax in percentage. Default is 0.
        },
        {
            name: "Maintenance Charge - Yearly",
            quantity: 1,
            price: 300,
            tax: 0, // Specify tax in percentage. Default is 0.
        },
    ],
    qr: {
        src: "https://www.festrolcorp.io",
        width: 100, // Default is 50.
    },
    note: {
        text: "Thank you for your business.",
        italic: false, // Default is true.
    }
};
```

**Note:** If the string is long, then you can use `\n` to break the line. For example:

```js
const payload = {
    company: {
        name: "Festrol Corp.",
        address: "1711 W. El Segundo Blvd, Hawthorne, \n Canada - 90250",
        phone: "Tel: (+11) 245 543 903",
        email: "Mail: email@yourcompany.com"
    },
};
```

Let's understand each of the fields in the payload.

### Company

This is the information about your company. It is an object with the following structure:

```js
const company = {
    logo: "<svg>...</svg>", // Optional. SVG logo of your company.
    name: "Festrol Corp.", // Required.
    address: "1711 W. El Segundo Blvd, Hawthorne, \n Canada - 90250", // Optional.
    phone: "Tel: (+11) 245 543 903", // Optional.
    email: "hello@company.com", // Optional.
    website: "Web: https://www.festrolcorp.io" // Optional.
}
```

For now, only **SVG logo** can be used. The name of the company is required. Rest of the fields are optional.

### Invoice

This is the information about the invoice. It is an object with the following structure:

```js
const invoice = {
    number: 1721, // Required.
    date: "25/12/2023", // Optional. Default is current date.
    dueDate: "25/12/2023", // Optional. Default is current date.
    status: "Paid!", // Optional. Default is "Due pending!".
    currency: "€", // Optional. Default is "$".
}
```

The invoice number is required. It might be a `integer` that you use to track your invoices. In most cases, it is a unique number that reference the `order ID` or invoice sequence number in your database. Rest of the fields are optional.

### Customer

This is the information about your customer. It is an object with the following structure:

```js
const customer = {
    name: "John Doe", // Required.
    address: "1234 Main Street, New York, \n NY 10001", // Optional.
    phone: "Tel: (555) 555-5555", // Optional.
    email: "joedeo@example.com", // Optional.
}
```

The name of the customer is required. Rest of the fields are optional.

### Items

Items are the products or services that you are selling. It is an `array` of objects with the following structure:

```js
const items = [
    {
        name: "Cloud VPS Server - Starter Plan", // Required.
        quantity: 1, // Required.
        price: 400, // Required.
        tax: 0, // Optional. Specify tax in percentage. Default is 0.
    },
    {
        name: "Domain Registration - example.com", // Required.
        quantity: 1, // Required.
        price: 20, // Required.
        tax: 0, // Optional. Specify tax in percentage. Default is 0.
    },
    {
        name: "Maintenance Charge - Yearly", // Required.
        quantity: 1, // Required.
        price: 300, // Required.
        tax: 0, // Optional. Specify tax in percentage. Default is 0.
    },
];
```

The `name`, `quantity` and `price` of the item is required. Rest of the fields are optional. Although if you have single item in the invoice, you need to pass it as an object. For example:

```js
const items = [
    {
        name: "Cloud VPS Server - Starter Plan", // Required.
        quantity: 1, // Required.
        price: 400, // Required.
        tax: 0, // Optional. Specify tax in percentage. Default is 0.
    },
];
```

### QR:

If you want to add a QR code to the invoice, then you can use this field. It is an object with the following structure:

```js
const qr = {
    data: "https://www.festrolcorp.io/", // Required. The data that you want to encode in the QR code.
    width: 100, // Optional. Default is 50. 
}
```

The `data` field is required. It is the data that you want to encode in the QR code. The `width` field is optional. It is the width of the QR code in pixels. Default is `50`. The recommended width of QR is 30 - 100.

### Note:

Use this field if you want to add a note to the invoice. It is an string with the following structure:

```js
const note = "Thank you for your business."; 
```


## Generate PDF:

Once you have the payload ready, you can generate the PDF using the following code:

```js
const { PDFInvoice } = require('@h1dd3nsn1p3r/pdf-invoice');

const handleInvoice = async(): Promise<void> => {
    
    const payload = {
        // Prepare payload.
    };

    /**
    * Create the invoice.
    */
    const invoice = new PDFInvoice(payload);
    const pdf = await invoice.create(); // Returns promise, await it.

    console.log(pdf); // Path to the PDF file. 
}

handleInvoice();
```

Once you call the `create` method, it will return a promise. You can either use `async/await` or `.then()` to handle the promise. The `create` method will return the path to the PDF file if the PDF is generated successfully. Otherwise, it will throw an error.


## Todo: 

- [ ] Add design/style options.
- [ ] Add configuration options.
- [ ] Add support for multi-language.
- [ ] Better error handling.
