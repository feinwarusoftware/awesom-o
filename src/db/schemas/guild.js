"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const permNodeSchema = new Schema({

    allow_list: { type: Boolean, default: false },
    list: [ String ]
}, {
    _id: false
});

const scriptPermSchema = new Schema({

    enabled: { type: String, default: false },
    members: permNodeSchema,
    channels: permNodeSchema,
    roles: permNodeSchema
}, {
    _id: false
});

const guildScriptSchema = new Schema({

    object_id: { type: Schema.Types.ObjectId, required: true },
    match_type_override: { type: String, default: null },
    match_override: { type: String, default: null },
    permissions: scriptPermSchema
}, {
    _id: false
});

const memberPermSchema = new Schema({

    member_id: { type: String, required: true },
    list: [ String ]
}, {
    _id: false
});

const GuildSchema = new Schema({

    // Id generated by mongo, this is here so I remember it exists.
    // _id: ObjectId,

    discord_id: { type: String, required: true, unique: true },
    prefix: { type: String, default: "-" },
    member_perms: [ memberPermSchema ],
    scripts: [ guildScriptSchema ],
});

module.exports.GuildSchema = mongoose.model("Guild", GuildSchema);
module.exports.GuildScriptSchema = mongoose.model("GuildScript", guildScriptSchema);
