import Oject from '@/models/Oject';

export default async function handler(req, res) {
    const { changes } = req.body;

    // 1. Quick sanity check on the incoming data
    if (!changes || !Array.isArray(changes)) {
        return res.status(400).json({
            success: false,
            message: "Payload missing or malformed. Expected a 'changes' array."
        });
    }

    // Nothing to do? Save server resources and exit early
    if (changes.length === 0) {
        return res.status(200).json({ success: true, message: "No pending changes to sync." });
    }

    try {
        console.log(`🎬 Starting sync for ${changes.length} database operations...`);

        // 2. Loop through the squashed, unique changes sequentially
        for (const change of changes) {
            const { _id, action, newText, newTType, type } = change;

            // Double check that we have a valid ID before touching the DB
            if (!_id) {
                console.warn(`⚠️ Skipped a ${action} action because it was missing a valid document _id.`);
                continue;
            }

            switch (action) {
                case 'delete':
                    console.log(`🗑️ Deleting document ID: ${_id} from category: ${type}`);
                    // Native Mongoose method targeting the precise document primary key
                    await Oject.findByIdAndDelete(_id);
                    break;

                case 'update':
                    console.log(`✏️ Updating document ID: ${_id} to new text: "${newText}"`);
                    // Target by ID and update only the text field
                    await Oject.findByIdAndUpdate(
                        _id,
                        { $set: { text: newText, tType: newTType } },
                        { runValidators: true } // Keeps data safe against schema rules
                    );
                    break;

                default:
                    console.warn(`❓ Unknown or unsupported action type ignored: "${action}"`);
            }
        }

        console.log("✅ All changes synchronized cleanly.");

        return res.status(200).json({
            success: true,
            message: `Successfully processed ${changes.length} operations.`
        });

    } catch (error) {
        // If a database query fails, log the full error stack on the server for debugging
        console.error("❌ Critical error during database sync:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong on the server while updating the database.",
            error: error.message
        });
    }
};