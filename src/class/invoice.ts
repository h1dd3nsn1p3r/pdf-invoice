const fs = require("fs");
const path = require("path");
const invoiceMaker = require("pdfmake");
const helper = require("../utils/helper");
import type {
	CompanyInfo,
	CustomerInfo,
	InvoiceInfo,
	ItemInfo,
	QRInfo,
	Notes,
	InvoicePayLoad,
	SimplePDFInvoice,
} from "../../global";

export class PDFInvoice implements SimplePDFInvoice {
	payload: InvoicePayLoad;
	company: CompanyInfo;
	invoice: InvoiceInfo;
	customer: CustomerInfo;
	items: ItemInfo[];
	currency: string;
	path: string;
	qr: QRInfo;
	note: Notes;
	date: string;
	constructor(payload: InvoicePayLoad) {
		this.payload = payload;

		// Invoice content section.
		this.company = payload.company;
		this.customer = payload.customer;
		this.invoice = payload.invoice;
		this.items = payload.items;
		this.qr = payload.qr;
		this.note = payload.note;

		// Invoice currency.
		this.currency = this.invoice.currency || "$";

		// Path.
		this.path = path.resolve(this.invoice.path) || "./invoice.pdf";

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
	async create(): Promise<string> {
		const printer = new invoiceMaker(this.fonts());

		const docDefinition = {
			pageSize: "A4",
			orientation: "portrait",
			pageMargins: [40, 40, 40, 40],
			info: this.meta(),
			content: this.content(),
			defaultStyle: this.defaultStyle(),
			styles: this.styles(),
		};

		return new Promise((resolve, reject) => {
			const doc = printer.createPdfKitDocument(docDefinition);

			doc.pipe(fs.createWriteStream(this.path));

			doc.end();

			doc.on("end", () => {
				resolve(this.path);
			});

			doc.on("error", (e: any) => {
				reject(e);
			});
		});
	}

	/**
	 * Fonts.
	 *
	 * @returns {Object} font.
	 * @since 1.0.0
	 */
	fonts(): any {
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
	 * Doc meta.
	 *
	 * @returns {Object} meta.
	 * @since 1.0.0
	 */
	meta(): any {
		const meta = {
			title: "Invoice - #" + this.invoice.number,
			author: this.company.name,
			subject: "Invoice - " + this.customer.name,
			keywords: "invoice",
		};

		return meta;
	}

	/**
	 * Default invoice styles.
	 *
	 * @returns {Object} defaults.
	 * @since 1.0.0
	 */
	defaultStyle(): any {
		const defaults = {
			fontSize: 10,
			lineHeight: 1.8,
			bold: false,
			font: "Helvetica",
			color: "#222222",
			columnGap: 30,
		};
		return defaults;
	}

	/**
	 * Invoice styles.
	 *
	 * @returns {Object} defaults.
	 * @since 1.0.0
	 */
	styles(): any {
		const styles = {
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
		};
		return styles;
	}

	/**
	 * Return the invoice layout.
	 *
	 * @returns {Object} layout.
	 * @since 1.0.0
	 */
	content(): any {
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

		if (this.company.logo) {
			if (!this.company.logo.startsWith("<svg")) {
				throw new Error("Only SVG logo are supported.");
			}

			sectionCompany.columns[0].stack.unshift({
				svg: this.company.logo,
				margin: [0, 0, 0, 20],
			});

			sectionCompany.columns[0].stack.push({
				text: this.company.name,
				style: "h3",
			});
		} else {
			sectionCompany.columns[0].stack.unshift({
				text: this.company.name,
				style: "h1",
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

		if (this.company.taxId) {
			sectionCompany.columns[0].stack.push({
				text: this.company.taxId,
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

		sectionCompany.columns[1].stack.push({
			text: `Ref no: #${this.invoice.number || 1}`,
			style: "textBold",
		});

		sectionCompany.columns[1].stack.push({
			text: `Date: ${this.invoice.date || this.date}`,
			style: "text",
		});

		sectionCompany.columns[1].stack.push({
			text: `Due Date: ${this.invoice.dueDate || this.date}`,
			style: "text",
		});

		sectionCompany.columns[1].stack.push({
			text: `Status: ${this.invoice.status || "Due to pay!"}`,
			style: "textBold",
		});

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

		if (this.customer.company) {
			sectionCustomer.columns[0].stack.push({
				text: this.customer.company,
				style: "text",
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

		if (this.customer.taxId) {
			sectionCustomer.columns[0].stack.push({
				text: this.customer.taxId,
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
				const totalPrice = helper.calcItemTotal(item);

				sectionItems.table.body.push([
					`\n ${item.name}`,
					`\n ${item.quantity}`,
					`\n ${this.currency}${item.price}`,
					`\n ${item.tax || 0}%`,
					`\n ${this.currency}${totalPrice}`,
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
						widths: [80, "*"],
						headerRows: 1,
						lineHeight: 1.5,
						body: [
							[
								"\n Subtotal",
								`\n ${this.currency}${helper.calcSubTotal(
									this.items
								)}`,
							],
							[
								"\n Total Tax",
								`\n ${this.currency}${helper.calcTax(
									this.items
								)}`,
							],
							[
								"\n Total",
								`\n ${this.currency}${helper.calcFinalTotal(
									this.items
								)}`,
							],
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
				margin: [0, 50, 0, 0],
				qr: this.payload.qr.data,
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
				margin: [0, this.payload.qr ? 20 : 50, 0, 0],
				text: this.payload.note,
				italics: true,
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
