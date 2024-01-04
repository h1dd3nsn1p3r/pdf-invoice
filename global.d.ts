export interface CompanyInfo {
	logo?: string;
	name: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
}

export interface CustomerInfo {
	name: string;
	address?: string;
	phone?: string;
	email?: string;
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
	width?: number;
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
