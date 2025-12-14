const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "tp20052001@gmail.com",
                pass: "zshsyxaovwzbgdzj",
            },
        });
    }

    sendInvoiceEmail(customerEmail, invoiceData) {
        const mailOptions = {
            from: "tp20052001@gmail.com",
            to: customerEmail,
            subject: 'Your Invoice from ACME Corp',
            html: `
                <h1>Invoice Details</h1>
                <p>Dear Customer,</p>
                <p>Thank you for your purchase. Please find your invoice details below:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Price ₹</th>
                            <th>Tax ₹</th>
                            <th>Amount ₹</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData.items.map(item => `
                            <tr>
                                <td>${item.itemName}</td>
                                <td>${item.quantity}</td>
                                <td>${item.sell_price.toFixed(2)}</td>
                                <td>${(item.sell_price * item.quantity * 0.18).toFixed(2)}</td>
                                <td>${(item.sell_price * item.quantity + item.sell_price * item.quantity * 0.18).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p>Total Amount: ₹${invoiceData.totalAmount.toFixed(2)}</p>
                <p>Discount: ₹${invoiceData.discount.toFixed(2)}</p>
                <p>Tax: ₹${invoiceData.totalTax.toFixed(2)}</p>
                <p>Grand Total: ₹${(invoiceData.totalAmount + invoiceData.totalTax - invoiceData.discount).toFixed(2)}</p>
            `,
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = EmailService;