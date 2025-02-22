import cron from "node-cron";
import { Invoice } from "../models/Invoice.js";
import { sendEmail } from "../utils/sendEmail.js";

cron.schedule("0 9 * * *", async () => { // Runs every day at 9 AM
  const overdueInvoices = await Invoice.find({ status: "Pending", dueDate: { $lt: new Date() } });

  for (let invoice of overdueInvoices) {
    await sendEmail(invoice.clientEmail, "Payment Reminder", `Your invoice of ₹${invoice.amount} is overdue.`);
    invoice.status = "Overdue";
    await invoice.save();
  }
});
