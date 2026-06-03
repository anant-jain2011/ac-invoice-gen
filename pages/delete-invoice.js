import cook from '@/middleware/mogod';
import Ivoice from '@/models/Ivoice';

export default async function handler(req, res) {
  // 1. Enforce correct HTTP Method for data destruction
  if (req.method !== 'DELETE') {
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed. Use DELETE.` 
    });
  }

  // 2. Extract the document ID from the query parameters
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing target identifier ('id') parameter." 
    });
  }

  try {
    // Connect to the database instance if not already cached
    await cook();

    console.log(`🗑️ Processing structural deletion for Invoice Document ID: ${id}`);

    // 3. Delete directly by Mongoose primary key
    const deletedInvoice = await Ivoice.findByIdAndDelete(id);

    // 4. Handle edge-case where record was already missing or cleared out
    if (!deletedInvoice) {
      console.warn(`⚠️ Deletion target not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        message: "Invoice not found. It may have already been deleted." 
      });
    }

    console.log(`✅ Successfully scrubbed invoice profile: ${id}`);

    return res.status(200).json({ 
      success: true, 
      message: "Invoice and all associated data purged successfully." 
    });

  } catch (error) {
    console.error("❌ Next.js Deletion Route crashed:", error);
    
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error occurred while processing document deletion.",
      error: error.message 
    });
  }
}