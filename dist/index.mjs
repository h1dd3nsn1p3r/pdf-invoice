// src/index.ts
import fs from "fs";
import pdfkit from "pdfkit";
var PDFInvoice = class {
  payload;
  company;
  invoice;
  customer;
  items;
  path;
  date;
  //config: Configurations;
  doc;
  maxWidth;
  maxHeight;
  constructor(payload) {
    this.payload = payload;
    this.company = this.payload.company;
    this.invoice = this.payload.invoice;
    this.customer = this.payload.customer;
    this.items = this.payload.items;
    this.path = this.payload.path;
    this.date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
    this.doc = new pdfkit({ size: "A4", margin: 40 });
    this.maxWidth = this.doc.page.width - (this.doc.page.margins.left + this.doc.page.margins.right);
    this.maxHeight = this.doc.page.height - (this.doc.page.margins.top + this.doc.page.margins.bottom);
  }
  /**
   * Render company information.
   *
   * @returns {void}
   * @since 1.0.0
   */
  renderHeader() {
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
      lineBreak: true
    };
    this.doc.fontSize(20).font("Helvetica-Bold").fillColor("#000000").text(name, 40, 40, { ...commonStyles, align: "left" }).moveDown();
    if (address) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(address, 40, 70, { ...commonStyles, align: "left" }).moveDown(0.5);
    }
    if (phone) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(phone, { ...commonStyles, align: "left" }).moveDown(0.5);
    }
    if (email) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(email, { ...commonStyles, align: "left" }).moveDown(0.5);
    }
    if (website) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(website, { ...commonStyles, align: "left" }).moveDown(0.5);
    }
    const { number, date, dueDate, status } = this.invoice;
    this.doc.fontSize(20).font("Helvetica").fillColor("#000000").text("I N V O I C E", 430, 40, {
      ...commonStyles,
      align: "left",
      width: 150
    }).moveDown(1);
    this.doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333").text(`Ref: #${this.invoice.number || 1}`, 430, 70, {
      ...commonStyles,
      align: "left",
      width: 150
    }).moveDown(0.5);
    this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(`Date: ${this.invoice.date || this.date}`, {
      ...commonStyles,
      align: "left",
      width: 150
    }).moveDown(0.5);
    this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(`Due Date: ${this.invoice.dueDate || this.date}`, {
      ...commonStyles,
      align: "left",
      width: 150
    }).moveDown(0.5);
    if (status) {
      this.doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333").text(`Status: ${this.invoice.status}`, {
        ...commonStyles,
        align: "left",
        width: 150
      }).moveDown(0.5);
    }
  }
  /**
   * Render customer information.
   *
   * @returns {void}
   * @since 1.0.0
   */
  renderCustomer() {
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
      lineBreak: true
    };
    this.doc.fontSize(14).font("Helvetica-Bold").fillColor("#000000").text("Bill To: ", 40, 180).moveDown(0.5);
    this.doc.fontSize(10).font("Helvetica-Bold").fillColor("#333333").text(name, { ...commonStyle, align: "left" }).moveDown(0.5);
    if (address) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(address, { ...commonStyle, align: "left" }).moveDown(0.5);
    }
    if (phone) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(phone, { ...commonStyle, align: "left" }).moveDown(0.5);
    }
    if (email) {
      this.doc.fontSize(10).font("Helvetica").fillColor("#333333").text(email, { ...commonStyle, align: "left" }).moveDown(0.5);
    }
  }
  /**
   * Render items.
   *
   * @returns {void}
   * @since 1.0.0
   */
  renderItems() {
  }
  /**
   * Render <hr> line.
   *
   * @returns {void}
   * @since 1.0.0
   */
  renderLine(y) {
    this.doc.lineWidth(1 / 72);
    this.doc.strokeColor("#DDDDDD");
    const startX = this.doc.page.margins.left;
    const endX = this.doc.page.width - this.doc.page.margins.right;
    this.doc.moveTo(startX, y).lineTo(endX, y).stroke();
  }
  /**
   * Render footer.
   *
   * @returns {void}
   * @since 1.0.0
   */
  renderFooter() {
  }
  /**
   * Write invoice itself.
   *
   * @returns {Promise<boolean>} boolean.
   * @since 1.0.0
   */
  async create() {
    this.renderHeader();
    this.renderCustomer();
    this.doc.end();
    const stream = this.doc.pipe(fs.createWriteStream(this.path));
    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        resolve(this.path);
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
  }
};
export {
  PDFInvoice
};
//# sourceMappingURL=index.mjs.map