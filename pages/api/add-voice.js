import cook from '@/middleware/mogod';
const Ivoice = require('@/models/Ivoice');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await cook();
        let { bill, voiceData, type, words, id, name } = req.body;

        if (!voiceData) {
            return res.status(400).json({ error: 'voiceData is required' });
        }

        if (id) {
            let iVoice = await Ivoice.findById(id);

            iVoice.name = name || iVoice.name;
            iVoice.bill = bill;
            iVoice.voiceData = voiceData;
            iVoice.type = type;
            iVoice.words = words;
            await iVoice.save();

            return res.status(200).json({ success: true, message: 'voiceData updated' });
        }

        const iVoice = await Ivoice.create({ bill, voiceData, type, words });

        return res.status(200).json({ success: true, id: iVoice._id });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
