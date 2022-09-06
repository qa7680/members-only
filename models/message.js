const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        time: { type: Date, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: "User" , required: true}
    }
);

MessageSchema
.virtual('date_formatted')
.get(function () {
  return DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);