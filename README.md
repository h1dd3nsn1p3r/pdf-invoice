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

## Use

Once installed, you can import either using `require` or `import`:

```js
const { PDFInvoice } = require('@h1dd3nsn1p3r/pdf-invoice');
```

or ES6 import:

```js
import { PDFInvoice } from '@h1dd3nsn1p3r/pdf-invoice';
```

`PDFInvoice` is a class that takes the payload as an argument. The payload is the data that you want to show on the invoice. For more information check the [Payload data](https://github.com/h1dd3nsn1p3r/pdf-invoice/blob/stable/examples/example.ts) example. 

## Payload Data

The payload is the data that you want to show on the invoice. It is an object with the following structure:

```js
const payload = {
	company: {
		logo: "<svg>...</svg>", // Optional. SVG logo of your company.
		name: "Festrol Corp.",
		address: "1711 W. El Segundo Blvd, Hawthorne, Canada - 90250",
		phone: "Tel: (+11) 245 543 903",
		email: "Mail: hello@festrol.io",
		website: "Web: https://www.festrolcorp.io",
		taxId: "Tax ID: 1234567890", // Optional.
		bank: "IBAN: 1234567890AC", // Optional.
	},
	customer: {
		name: "John Doe",
		company: "Xero Inc.", // Optional.
		address: "1234 Main Street, New York, NY 10001",
		phone: "Tel: (555) 555-5555",
		email: "Mail: joe@example.com",
		taxId: "Tax ID: 1234567890", // Optional.
	},
	invoice: {
		number: 1721, // String or number.
		date: "25/12/2023", // Default is current date.
		dueDate: "25/12/2023", // Default is current date.
		status: "Paid!",
		locale: "es-ES", // BCP 47 language tag. Default is "en-US".
		currency: "EUR", // ISO 4217 currency code. Default is "USD".
		path: "./invoice.pdf", // Required. Path where you would like to generate the PDF file.
		orderDiscount: 10, // total order discount
	},
	items: [
		{
			name: "Cloud VPS Server - Starter Plan",
			quantity: 1,
			price: 400,
			discount: 19,
			tax: 0, // Specify tax in percentage. Default is 0.
		},
		{
			name: "Domain Registration - example.com",
			quantity: 1,
			discount: 19,
			price: 20,
			tax: 0, // Specify tax in percentage. Default is 0.
		},
		{
			name: "Maintenance Charge - Yearly",
			quantity: 1,
			discount: 0,
			price: 300,
			tax: 0, // Specify tax in percentage. Default is 0.
		},
	],
	qr: {
		data: "https://www.festrolcorp.io",
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
	name: "Festrol Corp.", // Optional or required if logo is not supplied.
	address: "1711 W. El Segundo Blvd, Hawthorne, \n Canada - 90250", // Optional.
	phone: "Tel: (+11) 245 543 903", // Optional.
	email: "hello@company.com", // Optional.
	website: "Web: https://www.festrolcorp.io" // Optional.
	taxId: "Tax ID: 1234567890", // Optional.
	bank: "IBAN: 1234567890AC", // Optional.
}
```

For now, only **svg logo** can be used. If you wish to use logo & do not want the company name, then do not pass the `name` field. Rest of the fields are optional.

### Invoice

This is the information about the invoice. It is an object with the following structure:

```js
const invoice = {
	number: 1721, // Required.
	date: "25/12/2023", // Optional. Default is current date.
	dueDate: "25/12/2023", // Optional. Default is current date.
	status: "Paid!", // Optional. Default is "Due pending!".
	locale: "es-ES", // Optional. Default is "en-US".
	currency: "EUR", // Optional. Default is "USD".
}
```

The invoice number is required. It might be a `int` that you use to track your invoices. In most cases, it is a unique number that reference the `order ID` or invoice sequence number in your database. Rest of the fields are optional.

The `locale` is the BCP 47 language tag. Default is `en-US`. You can find the list of language tags [here](http://4umi.com/web/html/languagecodes.php). The `currency` is the ISO 4217 currency code. Default is `USD`. You can find the list of currency codes [here](https://www.iban.com/currency-codes). For more information on locale and currency, refer to [Mozilla Int Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) documentation.

If `path` is supplied in the payload, then the PDF will be generated at that location. For example:

```js
const file = "invoice" + "-#" + 1729 + "-" + new Date().getTime(); // invoice-#1729-1630480000000
const location = path.join(__dirname, "/invoices/" + file + ".pdf"); 
const invoice = {
  path: location, // Required.
}
```

If path is not supplied in the payload, then the PDF will be generated in current working directory with the name `invoice.pdf`. 

### Customer

This is the information about your customer. It is an object with the following structure:

```js
const customer = {
	name: "John Doe", // Required.
	company: "Xero Inc.", // Optional.
	address: "1234 Main Street, New York, \n NY 10001", // Optional.
	phone: "Tel: (555) 555-5555", // Optional.
	email: "joedeo@example.com", // Optional.
	taxId: "Tax ID: 1234567890", // Optional.
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

### QR Code

If you want to add a QR code to the invoice, then you can use this field. It is an object with the following structure:

```js
const qr = {
	data: "https://www.festrolcorp.io/", // Required. The data that you want to encode in the QR code.
	width: "100", // Optional. Default is 50. 
}
```

The `data` field is required. It is the data that you want to encode in the QR code. The `width` field is optional. It is the width of the QR code in pixels. Default is `50`. The recommended width of QR is 30 - 100.

### Note

Use this field if you want to add a note to the invoice. It is an string with the following structure:

```js
const note = "Thank you for your business."; 
```

## Generate PDF

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

	console.log(pdf); // Full path to the PDF file.
}

handleInvoice();
```

Once you call the `create` method, it will return a promise. You can either use `async/await` or `.then()` to handle the promise. The `create` method will return the path to the PDF file if the PDF is generated successfully. Otherwise, it will throw an error.

## Configuration

If required you can change the configuration of the invoice. It is an object with the following structure:

### Strings

All the text strings that are used in the invoice can be customized. For example:

```js
const { PDFInvoice } = require('@h1dd3nsn1p3r/pdf-invoice');

const create = async(): Promise<void> => {
    
	const payload = {
		// ....
	};

	const config = {
		// Custom labels.
		string: {
			invoice: "F A C T U A",
			refNumber: "Referencia",
			date: "Fecha",
			dueDate: "Fecha de vencimiento",
			status: "Estado",
			billTo: "Facturar a",
			item: "Artículo",
			quantity: "Cantidad",
			price: "Precio",
			tax: "Impuesto",
			total: "Total",
			subTotal: "Subtotal",
			totalTax: "Total Impuesto",
			grandTotal: "Grand Total", // Added in v1.0.11
		},
	};

	// Create the invoice.
	const invoice = new PDFInvoice(payload, config);
	const pdf = await invoice.create();

	console.log(pdf);
}
```

### Fonts

Following are the fonts that are available build-in with the library:

- Helvetica
- Times 
- Courier

All these three fonts includes regular, bold, italic and bold-italic styles. You can use them in the configuration object. For example:

```js
const config = {
	// ....
	style: {
		font: "Helvetica", // "Helvetica", "Times", "Courier"
		fontSize: 10, // Optional. Default is 10.
		lineHeight: 1.8, // Optional. Default is 1.8.
		color: "#000000", // Optional. Default is black.
	},
};
```
Any font can be used with the `font` option by passing the fonts `TTF` files path. For example:

```js
const config = {
	// ....
	font: {
		Noto: {
			normal: path.join(__dirname, "fonts/noto/regular.ttf"),
			italics: path.join(__dirname, "fonts/noto/italic.ttf"),
			bold: path.join(__dirname, "fonts/noto/bold.ttf"),
			bolditalics: path.join(__dirname, "fonts/noto/bold-italic.ttf"),
		},
	},
	style: {
		font: "Noto",
		fontSize: 10, // Optional. Default is 10.
		lineHeight: 1.8, // Optional. Default is 1.8.
		color: "#000000", // Optional. Default is black.
	},
};
```
If you need additional information do check the [example](https://github.com/h1dd3nsn1p3r/pdf-invoice/blob/development/examples/example.ts). In the example, I have used "Noto" and the `TTF` files of Noto font are included in the `fonts` directory. If you have non-latin characters, then you can use any custom font that supports the characters.

## Types

This library is written in TypeScript. If you need to import the types, then you can import them from `global.d.ts` file. Refer to [Global types](https://github.com/h1dd3nsn1p3r/pdf-invoice/blob/stable/global.d.ts) file for more information.

Example:

```js
import type { CompanyInfo, CustomerInfo, InvoiceInfo, ItemInfo, QRInfo, InvoicePayLoad } from '@h1dd3nsn1p3r/pdf-invoice/global.d.ts';
```

## Changelog: 

Refer to [releases](https://github.com/h1dd3nsn1p3r/pdf-invoice/releases) section for more information.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
