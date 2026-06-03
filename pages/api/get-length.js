import cook from '@/middleware/mogod';
import Ivoice from '@/models/Ivoice';

export default async function handler(req, res) {
  try {
    await cook();
    const count = await Ivoice.collection.estimatedDocumentCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
