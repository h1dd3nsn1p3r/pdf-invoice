interface Company {
	name: string;
	logo?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
}

interface Customer {
	name: string;
	address?: string;
	phone?: string;
	email?: string;
}

interface Invoice {
	number: string | number;
	date: string;
	dueDate?: string;
	status: string;
}

interface InvoicePayLoad {
	company: Company;
	customer: Customer;
	invoice: Invoice;
	items: any;
	path: string;
}

interface SimplePDFInvoice {
	renderHeader(): void;
	renderCustomer(): void;
	renderLine(y: number): void;
	renderFooter(): void;
	create(): Promise<string>;
}

/**
 * Main class that creates a PDF invoice.
 *
 * @since 1.0.0
 */
declare class PDFInvoice implements SimplePDFInvoice {
    payload: InvoicePayLoad;
    company: Company;
    invoice: Invoice;
    customer: Customer;
    items: any;
    path: string;
    date: string;
    doc: PDFKit.PDFDocument;
    maxWidth: number;
    maxHeight: number;
    constructor(payload: InvoicePayLoad);
    /**
     * Render company information.
     *
     * @returns {void}
     * @since 1.0.0
     */
    renderHeader(): void;
    /**
     * Render customer information.
     *
     * @returns {void}
     * @since 1.0.0
     */
    renderCustomer(): void;
    /**
     * Render items.
     *
     * @returns {void}
     * @since 1.0.0
     */
    renderItems(): void;
    /**
     * Render <hr> line.
     *
     * @returns {void}
     * @since 1.0.0
     */
    renderLine(y: number): void;
    /**
     * Render footer.
     *
     * @returns {void}
     * @since 1.0.0
     */
    renderFooter(): void;
    /**
     * Write invoice itself.
     *
     * @returns {Promise<boolean>} boolean.
     * @since 1.0.0
     */
    create(): Promise<string>;
}

export { PDFInvoice };
