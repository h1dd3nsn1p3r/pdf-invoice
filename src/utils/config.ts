/**
 * Holds the default configuration.
 *
 * @returns {Object} config.
 * @since 1.0.7
 */
const defaultConfig = {
	string: {
		invoice: "I N V O I C E",
		refNumber: "Ref no",
		date: "Date",
		dueDate: "Due Date",
		status: "Status",
		billTo: "Bill To",
		item: "Item",
		quantity: "Qty",
		price: "Price",
		tax: "Tax",
		total: "Total",
		subTotal: "Subtotal",
		totalTax: "Total Tax",
	},
	font: {
		helvetica: {
			normal: "Helvetica",
			bold: "Helvetica-Bold",
			italics: "Helvetica-Oblique",
			bolditalics: "Helvetica-BoldOblique",
		},
	},
};

module.exports = defaultConfig;
