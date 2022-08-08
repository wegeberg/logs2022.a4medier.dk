import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const MaillogEntryKommunenSchema = new Schema({
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
MaillogEntryKommunenSchema.plugin(mongoosePaginate);

const MaillogEntryKommunen = mongoose.model(
    'MaillogEntryKommunen',
    MaillogEntryKommunenSchema,
    'mail_logs_kommunen'
);

module.exports = MaillogEntryKommunen;