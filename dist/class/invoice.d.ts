interface CompanyInfo {
    name: string;
    logo?: {
        src: string;
        width?: number;
    };
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
}
interface CustomerInfo {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}
interface InvoiceInfo {
    label?: string;
    number: string | number;
    date: string;
    dueDate?: string;
    status: string;
    currency?: string;
}
interface ItemInfo {
    name: string;
    quantity: number;
    price: number;
    tax?: number;
}
interface QRInfo {
    src: string;
    width?: number;
}
interface Notes {
    text: string;
    italic?: boolean;
}
interface InvoicePayLoad {
    company: CompanyInfo;
    customer: CustomerInfo;
    invoice: InvoiceInfo;
    items: ItemInfo[];
    qr: QRInfo;
    note: Notes;
}
interface SimplePDFInvoice {
    create(): void;
    fonts(): void;
    meta(): void;
    render(): void;
}
declare class PDFInvoice implements SimplePDFInvoice {
    payload: InvoicePayLoad;
    company: CompanyInfo;
    invoice: InvoiceInfo;
    customer: CustomerInfo;
    items: ItemInfo[];
    qr: QRInfo;
    note: Notes;
    date: string;
    constructor(payload: InvoicePayLoad);
    /**
     * Create a PDF invoice.
     *
     * @returns {void}
     * @since 1.0.0
     */
    create(): void;
    /**
     * Render company information.
     *
     * @returns {Object} font.
     * @since 1.0.0
     */
    fonts(): {
        Helvetica: {
            normal: string;
            bold: string;
            italics: string;
            bolditalics: string;
        };
    };
    /**
     * Render doc meta.
     *
     * @returns {Object} meta.
     * @since 1.0.0
     */
    meta(): {
        title: string;
        author: string;
        subject: string;
        keywords: string;
    };
    /**
     * Return the invoice layout.
     *
     * @returns {Object} layout.
     * @since 1.0.0
     */
    render(): ({
        columns: {
            width: string;
            stack: any;
            style: string;
        }[];
    } | {
        columns: {
            width: number;
            margin: number[];
            stack: any;
            style: string;
        }[];
    } | {
        margin: number[];
        lineHeight: number;
        table: {
            widths: (string | number)[];
            headerRows: number;
            lineHeight: number;
            body: any;
        };
    } | {
        margin: number[];
        columns: ({
            width: string;
            stack: string[];
            style: string;
            lineHeight?: undefined;
            table?: undefined;
        } | {
            width: number;
            lineHeight: number;
            style: string;
            table: {
                widths: (string | number)[];
                headerRows: number;
                lineHeight: number;
                body: string[][];
            };
            stack?: undefined;
        })[];
    } | {
        margin: number[];
        qr: string;
        fit: string | number;
    } | {
        margin: number[];
        text: string;
        italics: true;
    })[];
}

export { PDFInvoice };
