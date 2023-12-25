# Simple PDF Invoice

🥳 Simple yet powerful node JS library that generates PDF invoice on the fly. 

## Installation: 

For npm users:

```bash
npm install @anuj/simple-pdf-invoice
```

For yarn users:

```bash
yarn add @anuj/simple-pdf-invoice
```

For pnpm users:

```bash
pnpm add @anuj/simple-pdf-invoice
```

## Use:

Once installed, you can import either using `require` or `import`:

```js
const { PDFInvoice } = require('@anuj/simple-pdf-invoice');
```

or

```js
import { PDFInvoice } from '@anuj/simple-pdf-invoice';
```

## Payload: 

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
        date: "25/12/2023",
        dueDate: "25/12/2023",
        status: "Paid!",
    },
    items: [
        {
            name: "Cloud VPS Server - Starter Plan",
            quantity: 1,
            price: 400,
        },
        {
            name: "Domain Registration - example.com",
            quantity: 1,
            price: 20,
        },
        {
            name: "Maintenance Charge - Yearly",
            quantity: 1,
            price: 300,
        },
    ],
    currency: "$",
    path: path.join(__dirname, '/invoice.pdf'),
};
```

Let's understand each of the fields in the payload:

- Company: This is the information about your company. `name` is the required field. All other fields are optional.
- Customer: This is the information about your customer. `name` is the required field. All other fields are optional.
- Invoice: This is the information about the invoice. `number` is required field. If `date` & `dueDate` are not provided, then current date will be used. If `status` is not provided, then label `Due` will be used.
- Items: This is the list of items that you want to show on the invoice. `name`, `quantity` & `price` are required fields.
- Currency: This is the currency symbol that you want to show on the invoice. Default is `$`.
- Path: This is the path where you want to save the PDF file. Default is `./invoice.pdf`. Path is **required**.

## Generate PDF:

Once you have the payload ready, you can generate the PDF using the following code:

```js
const { PDFInvoice } = require('@anuj/simple-pdf-invoice');

const payload = {
    // Payload goes here
};

// Instantiate the PDFInvoice class.
const invoice = new PDFInvoice(payload);

// Create the invoice.
await invoice.create()
.then((res)=> { console.log("Invoice created successfully!") })
.catch((err)=> { console.log(err) });
```

If PDF is created successfully, then path to the PDF file will be returned.


## Credit: 

This library uses [pdfkit](https://pdfkit.org/) under the hood.

## Note: 

This library is still in heavy development stage. This library is not production ready yet. Use it at your own risk.
