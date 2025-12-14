const nodemailer = require('nodemailer');

const sendInvoiceEmail = async (req, res) => {
    const { customerEmail, invoiceData } = req.body;

    // Configure nodemailer to send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tp20052001@gmail.com',
            pass: 'zshsyxaovwzbgdzj' // Use an app-specific password
        }
    });

    var totalAmount = 0;
    var Quantity = 0;
    var totalPrice = 0;
    var TotalTax=0;
    invoiceData.items.map((item)=>{
        totalAmount += (item.totalAmount + (item.totalAmount*0.18));
        Quantity += item.quantity;
        totalPrice += item.sell_price;
        TotalTax += (item.totalAmount*0.18);
    })

    // Prepare HTML content for the email
    const invoiceItemsHtml = invoiceData.items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.barcode}</td>
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.sell_price.toFixed(2)}</td>
            <td>${(item.totalAmount*0.18).toFixed(2)}</td>
            <td>${(item.totalAmount + (item.totalAmount*0.18)).toFixed(2)}</td>
        </tr>
    `).join('');

    const htmlContent = `
        <html>
            <head>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>Invoice from ACME Corp</h2>
                <p>Dear Customer,</p>
                <p>Please find attached your invoice from ACME Corp.</p>
                <h3>Invoice Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Barcode Item</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price ₹</th>
                            <th>Tax ₹</th>
                            <th>Total Amount ₹</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${invoiceItemsHtml}
                    </tbody>
                    </table>
                    <h4>Total Products:${Quantity}</h4>
                    <h4>Total Price ₹:${totalPrice}</h4>
                    <h4>Tax ₹:${TotalTax}</h4>
                    <h4>Total Amount ₹:${totalAmount}</h4>
            </body>
        </html>
    `;

    const mailOptions = {
        from: 'tp20052001@gmail.com',
        to: customerEmail,
        subject: 'Invoice from ACME Corp',
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
};

// Function to calculate tax
const calculateTax = (amount) => {
    return amount * 0.18; // Example tax rate
};

module.exports = {
    sendInvoiceEmail
};