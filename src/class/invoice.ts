const fs = require("fs");
const path = require("path");
const invoiceMaker = require("pdfmake");
const helper = require("@/utils/helper");
const defaultConfig = require("@/utils/config");

import type {
	CompanyInfo,
	CustomerInfo,
	InvoiceInfo,
	ItemInfo,
	QRInfo,
	Notes,
	InvoicePayLoad,
	Configuration,
} from "../../global";

export class PDFInvoice {
	payload: InvoicePayLoad;
	company: CompanyInfo;
	invoice: InvoiceInfo;
	customer: CustomerInfo;
	items: ItemInfo[];
	locale: string;
	currency: string;
	path: string;
	qr: QRInfo;
	note: Notes;
	date: string;
	orderDiscount?: number;
	config: Configuration;
	constructor(payload: InvoicePayLoad, config: Configuration = defaultConfig) {
		this.payload = payload;

		/**
		 * Content section.
		 */
		this.company = payload.company;
		this.customer = payload.customer;
		this.invoice = payload.invoice;
		this.items = payload.items;
		this.qr = payload.qr;
		this.note = payload.note;

		/**
		 * Currency.
		 */
		this.locale = this.invoice?.locale || "en-US";
		this.currency = this.invoice?.currency?.toUpperCase() || "USD";

		/**
		 * Invoice path.
		 */
		this.path = path.resolve(this.invoice.path) || "./invoice.pdf";

		/**
		 * Invoice date.
		 */
		this.date = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});

		/**
		 * Configuration.
		 */
		this.config = config;
		this.orderDiscount = payload.invoice.orderDiscount;
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
			info: this.docMeta(),
			content: this.content(),
			defaultStyle: this.docStyle(),
			styles: this.docTypo(),
		};

		return new Promise((resolve, reject) => {
			const doc = printer.createPdfKitDocument(docDefinition);
			const stream = fs.createWriteStream(this.path);

			doc.pipe(stream);

			doc.on("end", () => resolve(this.path));

			doc.on("error", (err: any) => reject(err));

			doc.end();
		});
	}

	/**
	 * Collection of available fonts.
	 *
	 * @returns {Record<string, Record<string, string>>} font.
	 * @since 1.0.0
	 */
	fonts(): Record<string, Record<string, string>> {
		const font = {
			Helvetica: {
				normal: "Helvetica",
				bold: "Helvetica-Bold",
				italics: "Helvetica-Oblique",
				bolditalics: "Helvetica-BoldOblique",
			},
			Times: {
				normal: "Times-Roman",
				bold: "Times-Bold",
				italics: "Times-Italic",
				bolditalics: "Times-BoldItalic",
			},
			Courier: {
				normal: "Courier",
				bold: "Courier-Bold",
				italics: "Courier-Oblique",
				bolditalics: "Courier-BoldOblique",
			},
		};

		const additionalFonts = this.config?.font || null;

		if (additionalFonts && Object.keys(additionalFonts).length > 0) {
			Object.assign(font, additionalFonts);
		}

		return font;
	}

	/**
	 * Doc meta.
	 *
	 * @returns {Record<string, string | undefined>}
	 * @since 1.0.0
	 */
	docMeta(): Record<string, string | undefined> {
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
	 * @returns {Record<string, any>}
	 * @since 1.0.0
	 */
	docStyle(): Record<string, any> {
		let defaults = {
			font: "Helvetica",
			fontSize: this.config?.style?.fontSize || 10,
			lineHeight: 1.8,
			bold: false,
			color: "#000000",
			columnGap: 30,
		};

		const style = this.config.style || null;

		if (style && Object.keys(style).length > 0) {
			defaults = { ...defaults, ...style };
		}

		return defaults;
	}

	/**
	 * Invoice typography styles.
	 *
	 * @returns {Object} defaults.
	 * @since 1.0.0
	 */
	docTypo(): Record<string, Record<string, unknown>> {
		return {
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
				fontSize: this.config?.style?.fontSize || 10,
				bold: false,
			},
			textBold: {
				fontSize: this.config?.style?.fontSize || 10,
				bold: true,
			},
		};
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

		if (this.company.bank) {
			sectionCompany.columns[0].stack.push({
				text: this.company.bank,
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
				text: this.config.string.invoice || "I N V O I C E",
				style: "h1",
			});
		}

		const refLabel = this.config.string.refNumber || "Ref no:";

		sectionCompany.columns[1].stack.push({
			text: refLabel + ": #" + (this.invoice.number || 1),
			style: "textBold",
		});

		const dateLabel = this.config.string.date;

		sectionCompany.columns[1].stack.push({
			text: dateLabel + ": " + (this.invoice.date || this.date),
			style: "text",
		});

		const dueDateLabel = this.config.string.dueDate;

		sectionCompany.columns[1].stack.push({
			text: dueDateLabel + ": " + (this.invoice.dueDate || this.date),
			style: "text",
		});

		const statusLabel = this.config.string.status;

		sectionCompany.columns[1].stack.push({
			text: statusLabel + ": " + (this.invoice.status || "Pending!"),
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
					stack: [
						{
							text: this.config.string.billTo,
							style: "h2",
						},
					] as any,
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
			lineHeight: 1.5,
			table: {
				widths: [200, 30, "*", 50, 50, "*"],
				headerRows: 1,
				lineHeight: 1.5,
				body: [
					[
						`\n ${this.config.string.item}`,
						`\n ${this.config.string.quantity}`,
						`\n ${this.config.string.price}`,
						`\n ${this.config.string.tax}`,
						`\n ${this.config.string.discount}`,
						`\n ${this.config.string.total}`,
					],
				] as any,
			},
		};

		const currOptions = {
			locale: this.locale,
			currency: this.currency,
		};

		if (this.items.length > 0) {
			this.items.forEach((item) => {
				sectionItems.table.body.push([
					`\n ${item.name}`,
					`\n ${item.quantity}`,
					`\n ${helper.formatCurrency(item.price, currOptions)}`,
					`\n ${item.tax && item.tax > 0 ? item.tax + "%" : "-"}`,
					`\n ${
						item.discount && item.discount > 0
							? helper.formatCurrency(item.discount, currOptions)
							: "-"
					}`,
					`\n ${helper.formatCurrency(
						helper.calcItemTotal(item),
						currOptions
					)}`,
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
					style: "normal",
					table: {
						widths: [80, "*"],
						headerRows: 1,
						lineHeight: 1.5,
						body: [
							[
								`\n ${this.config.string.subTotal}`,
								`\n ${helper.formatCurrency(
									helper.calcSubTotal(this.items),
									currOptions
								)}`,
							],
							[
								`\n ${this.config.string.totalTax}`,
								`\n ${helper.formatCurrency(
									helper.calcTax(this.items),
									currOptions
								)}`,
							],

							...(this.orderDiscount && this.orderDiscount > 0
								? [
										[
											`\n ${this.config.string.totalDiscount}`,
											`\n ${helper.formatCurrency(
												this.orderDiscount,
												currOptions
											)}`,
										],
								  ]
								: []),

							...(this.invoice.fee && this.invoice.fee > 0 ? [[
								`\n ${this.config.string.fee}`,
								`\n ${helper.formatCurrency(
									this.invoice.fee,
									currOptions
								)}`,
							]]: []),

							[
								{
									text: `\n ${
										this.config.string.grandTotal || this.config.string.total
									}`,
									fillColor: "#DDDDDD",
									color: "#000000",
									bold: true,
								},
								{
									text: `\n ${helper.formatCurrency(
										helper.calcFinalTotal(this.items, this.orderDiscount, this.invoice.fee),
										currOptions
									)}`,
									fillColor: "#DDDDDD",
									color: "#000000",
									bold: true,
								},
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
