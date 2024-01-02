const fs = require("fs");
const pdfmake = require("pdfmake");

interface CompanyInfo {
	name: string;
	logo?: {
		src: string;
		width?: number;
	};
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
}

interface CustomerInfo {
	name: string;
	address?: string;
	phone?: string;
	email?: string;
}

interface InvoiceInfo {
	label?: string;
	number: string | number;
	date: string;
	dueDate?: string;
	status: string;
	currency?: string;
}

interface ItemInfo {
	name: string;
	quantity: number;
	price: number;
	tax?: number;
}

interface QRInfo {
	src: string;
	width?: number;
}

interface Notes {
	text: string;
	italic?: boolean;
}

interface InvoicePayLoad {
	company: CompanyInfo;
	customer: CustomerInfo;
	invoice: InvoiceInfo;
	items: ItemInfo[];
	qr: QRInfo;
	note: Notes;
}

interface SimplePDFInvoice {
	create(): void;
	fonts(): void;
	meta(): void;
	render(): void;
}

export class PDFInvoice implements SimplePDFInvoice {
	payload: InvoicePayLoad;
	company: CompanyInfo;
	invoice: InvoiceInfo;
	customer: CustomerInfo;
	items: ItemInfo[];
	qr: QRInfo;
	note: Notes;
	date: string;
	constructor(payload: InvoicePayLoad) {
		this.payload = payload;

		// Invoice sections.
		this.company = payload.company;
		this.customer = payload.customer;
		this.invoice = payload.invoice;
		this.items = payload.items;
		this.qr = payload.qr;
		this.note = payload.note;

		// Invoice information.
		this.date = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});
	}

	/**
	 * Create a PDF invoice.
	 *
	 * @returns {void}
	 * @since 1.0.0
	 */
	create() {
		const printer = new pdfmake(this.fonts());

		const docDefinition = {
			pageSize: "A4",
			orientation: "portrait",
			pageMargins: [40, 40, 40, 40],
			info: this.meta(),
			content: this.render(),
			defaultStyle: {
				fontSize: 10,
				lineHeight: 1.8,
				bold: false,
				font: "Helvetica",
				color: "#222222",
				columnGap: 30,
			},
			styles: {
				h1: {
					fontSize: 18,
					bold: true,
				},
				h2: {
					fontSize: 16,
					bold: true,
				},
				h3: {
					fontSize: 14,
					bold: true,
				},
				text: {
					fontSize: 10,
					bold: false,
				},
				textBold: {
					fontSize: 10,
					bold: true,
				},
			},
		};

		const doc = printer.createPdfKitDocument(docDefinition);

		doc.pipe(fs.createWriteStream("./invoice.pdf"));

		const onSuccess = () => {
			return "invoice.pdf";
		};

		//doc.on("finish", function () {
		//	return true;
		//});

		doc.end();
	}

	/**
	 * Render company information.
	 *
	 * @returns {Object} font.
	 * @since 1.0.0
	 */
	fonts() {
		const fonts = {
			Helvetica: {
				normal: "Helvetica",
				bold: "Helvetica-Bold",
				italics: "Helvetica-Oblique",
				bolditalics: "Helvetica-BoldOblique",
			},
		};

		return fonts;
	}

	/**
	 * Render doc meta.
	 *
	 * @returns {Object} meta.
	 * @since 1.0.0
	 */
	meta() {
		const meta = {
			title: "Invoice - #" + this.invoice.number,
			author: this.company.name,
			subject: "Invoice - " + this.customer.name,
			keywords: "invoice",
		};

		return meta;
	}

	/**
	 * Return the invoice layout.
	 *
	 * @returns {Object} layout.
	 * @since 1.0.0
	 */
	render() {
		const sections = [];

		/**
		 * Left: Company section.
		 * Right: Invoice section.
		 *
		 * @since 1.0.0
		 */
		const sectionCompany = {
			columns: [
				{
					width: "70%",
					stack: [] as any,
					style: "text",
				},
				{
					width: "30%",
					stack: [] as any,
					style: "text",
				},
			],
		};

		//if (this.company.logo) {
		//	// Check if file exists.
		//	if (fs.existsSync(this.company.logo.src)) {
		//		sectionCompany.columns[0].stack.unshift({
		//			image: this.company.logo.src,
		//			width: this.company.logo.width || 90,
		//			alignment: "left",
		//			margin: [0, 0, 0, 20],
		//		});
		//	}
		//}

		if (this.company.name) {
			sectionCompany.columns[0].stack.unshift({
				text: this.company.name,
				style: this.company.logo ? "h2" : "h1",
			});
		}

		if (this.company.address) {
			sectionCompany.columns[0].stack.push({
				text: this.company.address,
				style: "text",
			});
		}

		if (this.company.phone) {
			sectionCompany.columns[0].stack.push({
				text: this.company.phone,
				style: "text",
			});
		}

		if (this.company.email) {
			sectionCompany.columns[0].stack.push({
				text: this.company.email,
				style: "text",
			});
		}

		if (this.company.website) {
			sectionCompany.columns[0].stack.push({
				text: this.company.website,
				style: "text",
			});
		}

		// Invoice information.
		if (this.invoice.label) {
			sectionCompany.columns[1].stack.unshift({
				text: this.invoice.label,
				style: "h1",
			});
		} else {
			sectionCompany.columns[1].stack.unshift({
				text: "I N V O I C E",
				style: "h1",
			});
		}

		if (this.invoice.number) {
			sectionCompany.columns[1].stack.push({
				text: `Ref no: #${this.invoice.number || 1}`,
				style: "textBold",
			});
		}

		if (this.invoice.date) {
			sectionCompany.columns[1].stack.push({
				text: `Date: ${this.invoice.date || this.date}`,
				style: "text",
			});
		}

		if (this.invoice.dueDate) {
			sectionCompany.columns[1].stack.push({
				text: `Due Date: ${this.invoice.dueDate || this.date}`,
				style: "text",
			});
		}

		if (this.invoice.status) {
			sectionCompany.columns[1].stack.push({
				text: `Status: ${this.invoice.status || "Due to pay!"}`,
				style: "textBold",
			});
		}

		sections.push(sectionCompany);

		/**
		 * Left: Bill to section.
		 *
		 * @since 1.0.0
		 */
		const sectionCustomer = {
			columns: [
				{
					width: 300,
					margin: [0, 30, 0, 0],
					stack: [{ text: "Bill To:", style: "h2" }] as any,
					style: "text",
				},
			],
		};

		if (this.customer.name) {
			sectionCustomer.columns[0].stack.push({
				text: this.customer.name,
				style: "textBold",
			});
		}

		if (this.customer.address) {
			sectionCustomer.columns[0].stack.push({
				text: this.customer.address,
				style: "text",
			});
		}

		if (this.customer.phone) {
			sectionCustomer.columns[0].stack.push({
				text: this.customer.phone,
				style: "text",
			});
		}

		if (this.customer.email) {
			sectionCustomer.columns[0].stack.push({
				text: this.customer.email,
				style: "text",
			});
		}

		sections.push(sectionCustomer);

		/**
		 * Full: Items section.
		 *
		 * @since 1.0.0
		 */
		const sectionItems = {
			margin: [0, 30, 0, 0],
			//layout: "lightHorizontalLines",
			lineHeight: 1.5,
			table: {
				widths: [200, 50, "*", 50, "*"],
				headerRows: 1,
				lineHeight: 1.5,
				body: [
					["\n Item", "\n Qty", "\n Price", "\n TAX", "\n Total"],
				] as any,
			},
		};

		if (this.items.length > 0) {
			this.items.forEach((item) => {
				sectionItems.table.body.push([
					`\n ${item.name}`,
					`\n ${item.quantity}`,
					`\n ${this.invoice.currency || "$"}${item.price}`,
					`\n ${item.tax || 0}%`,
					`\n ${this.invoice.currency || "$"}${
						item.quantity * item.price
					}`,
				]);
			});
		}

		sections.push(sectionItems);

		/**
		 * Right: Total section.
		 *
		 * @since 1.0.0
		 */
		const sectionTotal = {
			margin: [0, 20, 0, 0],
			columns: [
				{
					width: "*",
					stack: [" "],
					style: "text",
				},
				{
					width: 200,
					lineHeight: 1.5,
					style: "textBold",
					table: {
						widths: [100, "*"],
						headerRows: 1,
						lineHeight: 1.5,
						body: [
							["\n Sub total:", "\n £814"],
							["\n Total tax:", "\n £0"],
							["\n Total:", "\n £814"],
						],
					},
				},
			],
		};

		sections.push(sectionTotal);

		/**
		 * Left: QR section.
		 *
		 * @since 1.0.0
		 */
		if (this.payload.qr) {
			const sectionQR = {
				margin: [0, 100, 0, 0],
				qr: this.payload.qr.src,
				fit: this.payload.qr.width || "50",
			};

			sections.push(sectionQR);
		}

		/**
		 * Left: Notes section.
		 *
		 * @since 1.0.0
		 */
		if (this.payload.note) {
			const sectionNote = {
				margin: [0, this.payload.qr ? 20 : 100, 0, 0],
				text: this.payload.note.text,
				italics: this.payload.note.italic || true,
			};

			sections.push(sectionNote);
		}

		/**
		 * Return the invoice sections.
		 *
		 * @since 1.0.0
		 */
		return sections;
	}
}
