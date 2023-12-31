import fs from "fs";
import pdfkit from "pdfkit";
import type {
	Company,
	Customer,
	Invoice,
	InvoicePayLoad,
	SimplePDFInvoice,
} from "../../types/index.js";

/**
 * Main class that creates a PDF invoice.
 *
 * @since 1.0.0
 */
export class PDFInvoice implements SimplePDFInvoice {
	payload: InvoicePayLoad;
	company: Company;
	invoice: Invoice;
	customer: Customer;
	items: any;
	path: string;
	date: string;
	//config: Configurations;
	doc: PDFKit.PDFDocument;
	maxWidth: number;
	maxHeight: number;
	constructor(payload: InvoicePayLoad) {
		this.payload = payload;
		this.company = this.payload.company; // Company information
		this.invoice = this.payload.invoice; // Invoice information
		this.customer = this.payload.customer; // Customer information
		this.items = this.payload.items; // Items information
		this.path = this.payload.path; // Invoice path where to save.
		this.date = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "numeric",
			day: "numeric",
		});

		// Configurations
		//this.config = config;

		// Create a document
		this.doc = new pdfkit({ size: "A4", margin: 40 });

		// Height & width
		this.maxWidth =
			this.doc.page.width -
			(this.doc.page.margins.left + this.doc.page.margins.right);
		this.maxHeight =
			this.doc.page.height -
			(this.doc.page.margins.top + this.doc.page.margins.bottom);
	}

	/**
	 * Render company information.
	 *
	 * @returns {void}
	 * @since 1.0.0
	 */
	renderHeader(): void {
		if (!this.company || typeof this.company !== "object") {
			throw new Error(
				"Company information must be an object. Check doc."
			);
		}

		const { name, logo, address, phone, email, website } = this.company;

		if (!name) {
			throw new Error("Company name is required.");
		}

		const commonStyles = {
			width: 180,
			lineGap: 1,
			lineBreak: true,
		};

		/**
		 * Left side of the invoice.
		 */

		// Company name
		this.doc
			.fontSize(20)
			.font("Helvetica-Bold")
			.fillColor("#000000")
			.text(name, 40, 40, { ...commonStyles, align: "left" })
			.moveDown();

		// Address & contact information.
		if (address) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(address, 40, 70, { ...commonStyles, align: "left" })
				.moveDown(0.5);
		}

		// Phone
		if (phone) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(phone, { ...commonStyles, align: "left" })
				.moveDown(0.5);
		}

		// Email
		if (email) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(email, { ...commonStyles, align: "left" })
				.moveDown(0.5);
		}

		// Website
		if (website) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(website, { ...commonStyles, align: "left" })
				.moveDown(0.5);
		}

		/**
		 * Right side of the invoice.
		 */
		const { number, date, dueDate, status } = this.invoice;

		this.doc
			.fontSize(20)
			.font("Helvetica")
			.fillColor("#000000")
			.text("I N V O I C E", 430, 40, {
				...commonStyles,
				align: "left",
				width: 150,
			})
			.moveDown(1);

		// Invoice number
		this.doc
			.fontSize(10)
			.font("Helvetica-Bold")
			.fillColor("#333333")
			.text(`Ref: #${this.invoice.number || 1}`, 430, 70, {
				...commonStyles,
				align: "left",
				width: 150,
			})
			.moveDown(0.5);

		this.doc
			.fontSize(10)
			.font("Helvetica")
			.fillColor("#333333")
			.text(`Date: ${this.invoice.date || this.date}`, {
				...commonStyles,
				align: "left",
				width: 150,
			})
			.moveDown(0.5);

		this.doc
			.fontSize(10)
			.font("Helvetica")
			.fillColor("#333333")
			.text(`Due Date: ${this.invoice.dueDate || this.date}`, {
				...commonStyles,
				align: "left",
				width: 150,
			})
			.moveDown(0.5);

		if (status) {
			this.doc
				.fontSize(10)
				.font("Helvetica-Bold")
				.fillColor("#333333")
				.text(`Status: ${this.invoice.status}`, {
					...commonStyles,
					align: "left",
					width: 150,
				})
				.moveDown(0.5);
		}
	}

	/**
	 * Render customer information.
	 *
	 * @returns {void}
	 * @since 1.0.0
	 */
	renderCustomer(): void {
		if (!this.customer || typeof this.customer !== "object") {
			throw new Error(
				"Customer information must be an object. Check doc."
			);
		}

		const { name, address, phone, email } = this.customer;

		if (!name) {
			throw new Error("Customer name is required.");
		}

		const commonStyle = {
			width: 180,
			lineGap: 1,
			lineBreak: true,
		};

		this.doc
			.fontSize(14)
			.font("Helvetica-Bold")
			.fillColor("#000000")
			.text("Bill To: ", 40, 180)
			.moveDown(0.5);

		// Customer name
		this.doc
			.fontSize(10)
			.font("Helvetica-Bold")
			.fillColor("#333333")
			.text(name, { ...commonStyle, align: "left" })
			.moveDown(0.5);

		// Address
		if (address) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(address, { ...commonStyle, align: "left" })
				.moveDown(0.5);
		}

		// Phone
		if (phone) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(phone, { ...commonStyle, align: "left" })
				.moveDown(0.5);
		}

		// Email
		if (email) {
			this.doc
				.fontSize(10)
				.font("Helvetica")
				.fillColor("#333333")
				.text(email, { ...commonStyle, align: "left" })
				.moveDown(0.5);
		}
	}

	/**
	 * Render items.
	 *
	 * @returns {void}
	 * @since 1.0.0
	 */
	renderItems(): void {
		if (!this.items || !Array.isArray(this.items)) {
			throw new Error("Items must be an array. Check doc.");
		}

		const tableHeaders = ["Item", "Qty", "Price", "Total"];

		const table = {
			headers: tableHeaders,
			options: {
				x: 40,
				y: 300,
				width: this.maxWidth,
				columnWidths: [200, 100, 100, 115],
				headerBackground: "#000000",
				headerColor: "#FFFFFF",
				headerRadius: 3,
			},
		};

		/**
		 * Render the table header row.
		 */
		this.doc.fillColor(table.options.headerColor);
		this.doc
			.roundedRect(
				table.options.x,
				table.options.y,
				table.options.width,
				25,
				table.options.headerRadius
			)
			.fill(table.options.headerBackground);

		this.doc
			.font("Helvetica")
			.fontSize(10)
			.fillColor(table.options.headerColor);

		let startX = table.options.x;

		table.headers.forEach((label, index) => {
			// Adjust text position within the header cell
			this.doc.text(label, startX + 10, table.options.y + 9);
			startX += table.options.columnWidths[index];
		});

		let rowY = table.options.y + 40;

		let totalCost = 0;

		/**
		 * Render the table items.
		 */
		this.doc.font("Helvetica");
		this.doc.fillColor("#333333");

		this.items.forEach((item) => {
			const { name, quantity, price } = item;
			const total = quantity * price;

			totalCost += total;

			let startX = table.options.x;

			[name, quantity, price, total].forEach(
				(label: string, index: number) => {
					this.doc.text(label, startX + 10, rowY, {
						width: table.options.columnWidths[index],
					});
					startX += table.options.columnWidths[index];
				}
			);

			// Adjust items height as needed.
			rowY += 25;
		});

		/**
		 * Render line.
		 */
		this.renderLine(rowY);

		/**
		 * Render subtotal, tax and total cost.
		 */
		rowY += 20;

		const sectionPosition = this.maxWidth - 115;

		const tax = 0;
		const discount = 0;

		const data: any = {
			Subtotal: "$" + totalCost,
			Tax: "$" + (tax ? tax : "0"),
			Discount: "$" + (discount ? discount : "0"),
			Total: "$" + totalCost,
		};

		Object.keys(data).forEach((key, index) => {
			this.doc.fillColor("#333333");
			this.doc.fontSize(10);
			this.doc.text(key + ": " + data[key], sectionPosition, rowY, {
				align: "left",
				width: 200,
				lineGap: 2,
			});

			rowY += 25;
		});
	}

	/**
	 * Render <hr> line.
	 *
	 * @returns {void}
	 * @since 1.0.0
	 */
	renderLine(y: number): void {
		this.doc.lineWidth(1 / 72);
		this.doc.strokeColor("#DDDDDD");

		// Define the starting point of the line (x, y) and its ending point
		const startX = this.doc.page.margins.left; // Starting from the left margin
		const endX = this.doc.page.width - this.doc.page.margins.right; // Ending at the right margin

		this.doc.moveTo(startX, y).lineTo(endX, y).stroke();
	}

	/**
	 * Render footer.
	 *
	 * @returns {void}
	 * @since 1.0.0
	 */
	renderFooter(): void {}

	/**
	 * Write invoice itself.
	 *
	 * @returns {Promise<boolean>} boolean.
	 * @since 1.0.0
	 */
	async create(): Promise<string> {
		this.renderHeader();
		this.renderCustomer();
		this.renderItems();

		/**
		 * Start writing the invoice.
		 */
		this.doc.end();

		/**
		 * Create a stream to write the invoice.
		 */
		const stream = this.doc.pipe(fs.createWriteStream(this.path));

		/**
		 * Return a promise.
		 */
		return new Promise((resolve, reject) => {
			stream.on("finish", () => {
				resolve(this.path);
			});
			stream.on("error", (error) => {
				reject(error);
			});
		});
	}
}
