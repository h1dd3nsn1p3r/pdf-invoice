export interface CompanyInfo {
	logo?: string;
	name?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	taxId?: string;
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
}

export interface ItemInfo {
	name: string;
	quantity: number;
	price: number;
	tax?: number;
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

export interface SimplePDFInvoice {
	create(): Promise<string>;
	fonts(): any;
	meta(): any;
	content(): any;
	defaultStyle(): any;
	styles(): any;
}

export interface Configuration {
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
		tax?: string;
		total?: string;
		subTotal?: string;
		totalTax?: string;
	};
	font: [
		helvetica?: {
			normal?: string;
			bold?: string;
			italics?: string;
			bolditalics?: string;
		},
		noto?: {
			normal?: string;
			bold?: string;
			italics?: string;
			bolditalics?: string;
		}
	];
}
