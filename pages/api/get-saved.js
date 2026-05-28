import cook from "@/middleware/mogod";
import Oject from "@/models/Oject"

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    await cook();

    const saves = await Oject.find({}).sort({ createdAt: -1 });

    return res.status(200).json(saves);
}
