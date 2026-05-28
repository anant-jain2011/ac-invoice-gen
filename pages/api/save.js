import cook from '@/middleware/mogod';
const Oject = require('@/models/Oject');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await cook();
        const { text, type } = req.body;

        if (!text) {
            console.log(text, type);
            
            return res.status(400).json({ error: 'text is required' });
        }

        const oject = await Oject.create({ text, type });

        return res.status(200).json({ success: true, id: oject._id });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
