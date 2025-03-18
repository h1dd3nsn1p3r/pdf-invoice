import type { ItemInfo } from "../../global";

interface Helpers {
	calcItemTotal(item: ItemInfo): number | string;
	calcTax(items: ItemInfo[]): number | string;
	calcSubTotal(items: ItemInfo[]): number | string;
	calcFinalTotal(items: ItemInfo[]): number | string;
	formatCurrency(
		amount: number | string,
		args?: Record<string, string>
	): string;
}

const helper: Helpers = {
	/**
	 * Item total price calculation.
	 *
	 * @param {Object} item.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcItemTotal: function (item: ItemInfo): string {
		const price = item.price || 0;
		const quantity = item.quantity || 1;
		return (price * quantity).toFixed(2);
	},

	/**
	 * Calculate subtotal.
	 *
	 * @param {Object} items.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcSubTotal: function (items: ItemInfo[]): number | string {
		if (items.length === 0) {
			return 0;
		}

		let total = 0;

		items.forEach((item) => {
			total += Number(this.calcItemTotal(item));
		});

		return total.toFixed(2);
	},

	/**
	 * Calculate tax.
	 *
	 * @param {Object} items.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcTax: function (items: ItemInfo[]): number | string {
		if (items.length === 0) {
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
	 * @param {Object} items.
	 * @returns {number} total.
	 * @since 1.0.0
	 */
	calcFinalTotal: function (items: ItemInfo[]): number | string {
		if (items.length === 0) {
			return 0;
		}

		const subTotal = Number(this.calcSubTotal(items));
		const tax = Number(this.calcTax(items));

		return (subTotal + tax).toFixed(2);
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
		args: Record<string, string> = { locale: "en-US", currency: "USD" }
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
