const mongoose = require("mongoose");

const IvoiceSchema = new mongoose.Schema({
  bill: {
    gst: { type: String, trim: true },
    date: { type: String, trim: true },
    code: { type: String, trim: true },
    igst: { type: Boolean, default: false },
    t3: { type: Object },
  },
  type: { type: String, trim: true },
  words: { type: String, trim: true },
  voiceData: [{
    sr_no: { type: String, trim: true },
    cn_date: { type: String, trim: true },
    cn_no: { type: String, trim: true },
    from: { type: String, trim: true },
    destination: { type: String, trim: true },
    hsn_sac_code: { type: String, trim: true },
    transport: { type: String, trim: true },
    sender: { type: String, trim: true },
    receiver: { type: String, trim: true },
    no_of_pkg: { type: String, trim: true },
    freight_amount: { type: String, trim: true },
    total_amount: { type: String, trim: true },
    invoice_no: { type: String, trim: true },
    material_description: { type: String, trim: true },
    vehicle_no: { type: String, trim: true },
    weight: { type: String, trim: true },
    rate_per_kg: { type: String, trim: true },
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.models.Ivoice || mongoose.model("Ivoice", IvoiceSchema);
