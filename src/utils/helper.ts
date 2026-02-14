import type { ItemInfo, Fee } from "../../global";

interface Helpers {
	calcItemTotal(item: ItemInfo): number | string;
	calcItemTotalDiscount(item: ItemInfo[]): number | string;
	calcTax(items: ItemInfo[]): number | string;
	calcSubTotal(items: ItemInfo[]): number | string;
	calcFinalTotal(
		items: ItemInfo[],
		discount?: number,
		fees?: Fee[],
	): number | string;
	formatCurrency(
		amount: number | string,
		args?: Record<string, string>,
	): string;
}

const helper: Helpers = {
	/**
	 * Item total price calculation.
	 *
	 * Displayed in the items table (not the invoice sub/grand total).
	 *
	 * @param {ItemInfo} item.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcItemTotal: function (item: ItemInfo): number | string {
		const subtotal = item.quantity * item.price;
		let discountAmount = 0;
		let taxAmount = 0;

		if (item.discount) {
			discountAmount = subtotal * (item.discount / 100);
		}
		const discountedSubtotal = subtotal - discountAmount;

		if (item.tax) {
			taxAmount = discountedSubtotal * (item.tax / 100);
		}

		return discountedSubtotal + taxAmount;
	},

	/**
	 * Calculate subtotal.
	 *
	 * @param {ItemInfo[]} items.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcSubTotal: function (items: ItemInfo[]): number | string {
		if (!items || !items.length) {
			return 0;
		}

		let total = 0;

		items.forEach((item) => {
			total += Number(this.calcItemTotal(item));
		});

		return total.toFixed(2);
	},

	/**
	 * Item total discount calculation.
	 *
	 * Note: This method is not used currently in the invoice.
	 *
	 * @param {ItemInfo} item.
	 * @returns {number} total.
	 * @since 1.0.11
	 */
	calcItemTotalDiscount: function (item: ItemInfo[]): string {
		if (!item || !item.length) {
			return "0.00";
		}

		let total = 0;

		item.forEach((i) => {
			const price = i.price || 0;
			const quantity = i.quantity || 1;
			const discount = i.discount || 0;
			total += (price * quantity * discount) / 100;
		});

		return total.toFixed(2);
	},

	/**
	 * Calculate tax.
	 *
	 * @param {ItemInfo[]} items.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcTax: function (items: ItemInfo[]): number | string {
		if (!items || !items.length) {
			return 0;
		}

		let total = 0;

		items.forEach((item) => {
			const price = item.price;
			const quantity = item.quantity;
			const tax = item.tax || 0;
			total += (price * quantity * tax) / 100;
		});

		return total.toFixed(2);
	},

	/**
	 * Calculate total final price.
	 *
	 * @param {ItemInfo[]} items.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcFinalTotal: function (
		items: ItemInfo[],
		discount?: number,
		fees?: Fee[],
	): number | string {
		if (!items || !items.length) {
			return 0;
		}

		let subTotal = Number(this.calcSubTotal(items));

		let parsedFee = 0;

		if (fees) {
			fees.forEach((f) => {
				if (f.operation === "+") {
					parsedFee += f.amount;
				} else {
					parsedFee -= f.amount;
				}
			});
		}

		if (!discount || isNaN(Number(discount))) {
			return (subTotal + parsedFee).toFixed(2);
		}

		subTotal = subTotal + parsedFee;

		return subTotal - Number(discount) < 0
			? "0.00"
			: (subTotal - Number(discount)).toFixed(2);
	},

	/**
	 * Format currency in international format.
	 *
	 * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
	 *
	 * @param {number | string} amount.
	 * @param {Record<string, string>} args.
	 * @returns {string} string.
	 * @since 1.0.10
	 */
	formatCurrency: function (
		amount: number | string,
		args: Record<string, string> = { locale: "en-US", currency: "USD" },
	): string {
		amount = Number(amount);

		if (!amount || isNaN(amount)) {
			return new Intl.NumberFormat(args.locale, {
				style: "currency",
				currency: args.currency,
			}).format(0);
		}

		amount = amount.toFixed(2);

		return new Intl.NumberFormat(args.locale, {
			style: "currency",
			currency: args.currency,
		}).format(Number(amount));
	},
};

module.exports = helper;
