"use strict"

const Command = require("../script");

const wink = new Command({
    
    name: "wink",
    description: "wonk",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092313314885632/t11.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "wink",

    featured: false,

    preload: true,

    cb: function(client, message, guildDoc) {

        message.reply("wonk");
    }
});

module.exports = wink;