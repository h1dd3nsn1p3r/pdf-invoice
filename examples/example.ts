const path = require("path");
const { PDFInvoice } = require("../dist/index");

const payload = {
	company: {
		name: "Festrol Corp Ltd.",
		address: "1711 W. El Segundo Blvd, Hawthorne, \n Canada - 90250",
		phone: "Tel: (+11) 245 543 903",
		email: "Mail: hello@festrol.io",
		website: "Web: https://www.festrolcorp.io",
	},
	customer: {
		name: "John Doe",
		address: "1234 Main Street, New York, \n NY 10001",
		phone: "Tel: (555) 555-5555",
		email: "Mail: joe@example.com",
	},
	invoice: {
		number: 1721,
		date: "25/12/2023",
		dueDate: "25/12/2023",
		status: "Paid!",
		currency: "£",
	},
	items: [
		{
			name: "Cloud VPS Server - Starter Plan",
			quantity: 1,
			price: 400,
			tax: 0,
		},
		{
			name: "Domain Registration - example.com",
			quantity: 1,
			price: 20,
			tax: 0,
		},
		{
			name: "Maintenance Charge - Yearly",
			quantity: 1,
			price: 300,
			tax: 0,
		},
	],
	qr: {
		src: "https://www.festrolcorp.io",
		width: 50,
	},
	note: {
		text: "Note: This is a system generated invoice. If you have any questions concerning this invoice, contact us at sales@festrolcorp.io. Thank you for your business!",
		italic: true,
	},
};

const invoice = new PDFInvoice(payload);
invoice.create();
