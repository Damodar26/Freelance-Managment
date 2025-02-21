const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
