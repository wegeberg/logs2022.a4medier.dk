import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseLong from 'mongoose-long';
mongooseLong(mongoose)
const {Types: {Long} } = mongoose;

const ArtikellogEntrySchema = new Schema({
    artikel_id: {
        type: Number,
        required: true
    },
    userAgent: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    site_id: {
        type: Number,
        required: false,
        default: 0
    },
    email:{
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        default: null
    },
    ip:{
        type: Long,
        required: false,
        default: 0,
        set: n => Math.round(n)
    },
    mail_id: {
        type: Number,
        required: false,
        default: 0
    },
    id_token: {
        type: String,
        required: false,
        default: null
    },
    eniro: {
        type: Boolean,
        required: false,
        default: false
    },
    // antal_open: {
    //     type: Number,
    //     required: false
    // }
}, {
    timestamps: true,
});
ArtikellogEntrySchema.plugin(mongoosePaginate);

const ArtikellogEntry = mongoose.model(
    'ArtikellogEntry',
    ArtikellogEntrySchema,
    'artikel_logs'
);

module.exports = ArtikellogEntry;