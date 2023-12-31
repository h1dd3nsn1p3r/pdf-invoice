const fs = require('fs');
const path = require('path');
const { PDFInvoice } = require('../build/index.js');

const payload = {
    company: {
        name: "Festrols Corp.",
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
    path: path.join(__dirname, '/invoice.pdf'),
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
};

const invoice = new PDFInvoice(payload);
invoice
    .create()
    .then((r) => {
        console.log(r);
    })
    .catch((e) => {
        console.log(e);
    });