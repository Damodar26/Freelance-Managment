import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createInvoice,
  /*getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,*/
  verifyPayment,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", verifyJWT, createInvoice);
router.post("/verify-payment", verifyJWT, verifyPayment);
/*router.get("/", verifyJWT, getInvoices);
router.get("/:invoiceId", verifyJWT, getInvoiceById);
router.patch("/:invoiceId", verifyJWT, updateInvoice);
router.delete("/:invoiceId", verifyJWT, deleteInvoice);
*/
export default router;
