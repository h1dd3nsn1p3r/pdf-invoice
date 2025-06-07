/* --------------------------------------------------------------------------
	Invoice payload types.
  -------------------------------------------------------------------------- */
export interface CompanyInfo {
	logo?: string;
	name?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	taxId?: string;
	bank?: string;
}

export interface CustomerInfo {
	name: string;
	company?: string;
	address?: string;
	phone?: string;
	email?: string;
	taxId?: string;
}

export interface InvoiceInfo {
	label?: string;
	number: string | number;
	date: string;
	dueDate?: string;
	status: string;
	path: string;
	currency?: string;
	locale?: string;
}

export interface ItemInfo {
	name: string;
	quantity: number;
	price: number;
	tax?: number;
	discount?: number;
}

export interface QRInfo {
	data: string;
	width?: number | string;
}

export type Notes = string;

export interface InvoicePayLoad {
	company: CompanyInfo;
	customer: CustomerInfo;
	invoice: InvoiceInfo;
	items: ItemInfo[];
	qr: QRInfo;
	note: Notes;
}

/* --------------------------------------------------------------------------
	Invoice configuration types.
  -------------------------------------------------------------------------- */
export interface ConfigMeta {
	title?: string;
	author?: string;
	subject?: string;
	keywords?: string;
}

export interface ConfigBaseStyle {
	font?: string;
	fontSize?: number;
	lineHeight?: number;
	color?: string;
	bold?: boolean;
}

export interface ConfigFont {
	[key: string]: {
		normal: string;
		bold: string;
		italics: string;
		bolditalics: string;
	};
}

export interface Configuration {
	font: ConfigFont;
	meta: ConfigMeta;
	style: ConfigBaseStyle;
	string: {
		invoice?: string;
		refNumber?: string;
		date?: string;
		dueDate?: string;
		status?: string;
		billTo?: string;
		item?: string;
		quantity?: string;
		price?: string;
		discount?: string;
		tax?: string;
		total?: string;
		subTotal?: string;
		totalTax?: string;
		totalDiscount?: string;
	};
}
