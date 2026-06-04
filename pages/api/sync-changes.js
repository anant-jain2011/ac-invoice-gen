import express from 'express';
import mongoose from 'mongoose';
import InvoiceModel from '../models/Invoice.js'; // Adjust path based on environment settings

const router = express.Router();

router.post('/api/sync-changes', async (req, res) => {
  const { changes } = req.body;

  if (!changes || !Array.isArray(changes)) {
    return res.status(400).json({ success: false, message: "Invalid payload format. Expected changes array." });
  }

  if (changes.length === 0) {
    return res.status(200).json({ success: true, message: "No operational delta changes to process." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const change of changes) {
      const { action, _id, type, text, newText, newTType } = change;

      switch (action) {
        case 'create': {
          // MongoDB implicitly defines the secure unique _id identifier on save
          const newDoc = new InvoiceModel({
            type: type, // This handles the grouping category name
            text: text,
            tType: change.tType || ""
          });
          await newDoc.save({ session });
          break;
        }

        case 'update':
          if (!_id) {
            throw new Error("Missing target document parameter identifier context rule.");
          }
          await InvoiceModel.findByIdAndUpdate(
            _id, 
            { $set: { text: newText, tType: newTType || "" } },
            { session }
          );
          break;

        case 'delete':
          if (!_id) {
            break; // If a newly created element was discarded locally prior to synchronization, bypass query execution
          }
          await InvoiceModel.findByIdAndDelete(_id, { session });
          break;

        default:
          console.warn(`Unrecognized change payload operation skipped: ${action}`);
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Database tracking log records updated successfully."
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Database reconciliation routine error:", error);
    return res.status(500).json({
      success: false,
      message: `Database synchronization transaction failed: ${error.message}`
    });
  }
});

export default router;