import cook from "@/middleware/mogod";
import Ivoice from "@/models/Ivoice"

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    await cook();

    let id = req.query.id;

    const invoices = id ? await Ivoice.findById(id) : await Ivoice.find({}).sort({ createdAt: -1 });

    return res.status(200).json(invoices);
}
