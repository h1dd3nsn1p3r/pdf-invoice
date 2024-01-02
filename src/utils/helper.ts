import type { ItemInfo } from "../../global";

interface Helpers {
	calcItemTotal(item: ItemInfo): number | string;
	calcTax(items: ItemInfo[]): number | string;
	calcSubTotal(items: ItemInfo[]): number | string;
	calcFinalTotal(items: ItemInfo[]): number | string;
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
};

module.exports = helper;
