export interface Company {
	name: string;
	logo?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
}

export interface Customer {
	name: string;
	address?: string;
	phone?: string;
	email?: string;
}

export interface Invoice {
	number: string | number;
	date: string;
	dueDate?: string;
	status: string;
}

export interface Items {
	name: string;
	quantity: number;
	price: number;
	tax?: number;
}

export interface InvoicePayLoad {
	company: Company;
	customer: Customer;
	invoice: Invoice;
	items: any;
	path: string;
}

export interface Configurations {
	labels: {
		invoice: string;
		item: string;
		price: string;
		quantity: string;
		tax: string;
		total: string;
		subtotal: string;
		due: string;
		to: string;
		from: string;
	};
	style: {
		primaryColor: string;
		secondaryColor: string;
		borderColor: string;
		logoWidth: number;
		logoFontSize: number;
	};
}

export interface SimplePDFInvoice {
	renderHeader(): void;
	renderCustomer(): void;
	renderLine(y: number): void;
	renderFooter(): void;
	create(): Promise<string>;
}
