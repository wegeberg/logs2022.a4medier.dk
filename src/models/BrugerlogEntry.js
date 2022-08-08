import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseLong from 'mongoose-long';
mongooseLong(mongoose)
const {Types: {Long} } = mongoose;

const BrugerlogEntrySchema = new Schema({
    id_token:{
        type: String,
        required: false,
        trim: true,
        default: null
    },
    userAgent: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    path:{
        type: String,
        required: false,
        trim: true,
        default: null
    },
    query:{
        type: Object,
        required: false,
        trim: true,
        default: null
    },
    email:{
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        default: null
    },
    site_id: {
        type: Number,
        required: false,
        default: 0
    },
    ip:{
        type: Long,
        required: false,
        default: 0,
        set: n => Math.round(n)
    },
}, {
    timestamps: true,
});
BrugerlogEntrySchema.plugin(mongoosePaginate);

const BrugerlogEntry = mongoose.model(
    'BrugerlogEntry',
    BrugerlogEntrySchema,
    'bruger_logs'
);

module.exports = BrugerlogEntry;