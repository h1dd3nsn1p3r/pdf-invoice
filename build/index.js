"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PDFInvoice: () => PDFInvoice
});
module.exports = __toCommonJS(src_exports);

// src/class/invoice.ts
var import_fs = __toESM(require("fs"));
var import_pdfkit = __toESM(require("pdfkit"));
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
    this.doc = new import_pdfkit.default({ size: "A4", margin: 40 });
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
        headerRadius: 3
      }
    };
    this.doc.fillColor(table.options.headerColor);
    this.doc.roundedRect(
      table.options.x,
      table.options.y,
      table.options.width,
      25,
      table.options.headerRadius
    ).fill(table.options.headerBackground);
    this.doc.font("Helvetica").fontSize(10).fillColor(table.options.headerColor);
    let startX = table.options.x;
    table.headers.forEach((label, index) => {
      this.doc.text(label, startX + 10, table.options.y + 9);
      startX += table.options.columnWidths[index];
    });
    let rowY = table.options.y + 40;
    let totalCost = 0;
    this.doc.font("Helvetica");
    this.doc.fillColor("#333333");
    this.items.forEach((item) => {
      const { name, quantity, price } = item;
      const total = quantity * price;
      totalCost += total;
      let startX2 = table.options.x;
      [name, quantity, price, total].forEach(
        (label, index) => {
          this.doc.text(label, startX2 + 10, rowY, {
            width: table.options.columnWidths[index]
          });
          startX2 += table.options.columnWidths[index];
        }
      );
      rowY += 25;
    });
    this.renderLine(rowY);
    rowY += 20;
    const sectionPosition = this.maxWidth - 115;
    const tax = 0;
    const discount = 0;
    const data = {
      Subtotal: "$" + totalCost,
      Tax: "$" + (tax ? tax : "0"),
      Discount: "$" + (discount ? discount : "0"),
      Total: "$" + totalCost
    };
    Object.keys(data).forEach((key, index) => {
      this.doc.fillColor("#333333");
      this.doc.fontSize(10);
      this.doc.text(key + ": " + data[key], sectionPosition, rowY, {
        align: "left",
        width: 200,
        lineGap: 2
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
    this.renderItems();
    this.doc.end();
    const stream = this.doc.pipe(import_fs.default.createWriteStream(this.path));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PDFInvoice
});
//# sourceMappingURL=index.js.map