import cook from '@/middleware/mogod';
const Oject = require('@/models/Oject');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await cook();

        // 1. Check if the body contains an array of items (Bulk Mode)
        if (req.body.items && Array.isArray(req.body.items)) {
            const { items } = req.body;

            // Optional Validation: Filter out any items missing 'text'
            const validItems = items.filter(item => item.text);

            if (validItems.length === 0) {
                return res.status(400).json({ error: 'No valid items with text provided' });
            }

            try {
                // 2. Insert all objects into MongoDB in exactly ONE query
                // { ordered: false } tells Mongo to keep saving other items even if one fails a validation/duplicate check
                const createdOjects = await Oject.insertMany(validItems, { ordered: false });

                return res.status(200).json({
                    success: true,
                    count: createdOjects.length
                });
            } catch (error) {
                console.error("Bulk insert failed:", error);
                return res.status(500).json({ error: 'Bulk save database error' });
            }
        }

        // 3. Fallback: Keep your original single-item logic so old code doesn't break
        const { text, type } = req.body;

        if (!text) {
            console.log(text, type);
            return res.status(400).json({ error: 'text is required' });
        }

        try {
            const oject = await Oject.create({ text, type });
            return res.status(200).json({ success: true, id: oject._id });
        } catch (error) {
            return res.status(500).json({ error: 'Database error' });
        }

    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
