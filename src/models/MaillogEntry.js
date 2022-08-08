import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const MaillogEntrySchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    mail_id: {
        type: Number,
        required: true
    },
    antal_open: {
        type: Number,
        required: false
    }
}, {
    timestamps: true,
});
MaillogEntrySchema.plugin(mongoosePaginate);

const MaillogEntry = mongoose.model(
    'MaillogEntry',
    MaillogEntrySchema,
    'mail_logs'
);

module.exports = MaillogEntry;