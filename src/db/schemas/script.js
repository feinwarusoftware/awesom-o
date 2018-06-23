"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScriptSchema = new Schema({

    //  _id: ObjectId,
    local: { type: Boolean, required: true },
    name: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: false },
    description: { type: String, default: "*(placeholder)*" },
    type: { type: String, required: true },
    permissions: { type: Number, required: true },
    code: { type: String, required: false }
});

module.exports = mongoose.model("Script", ScriptSchema);