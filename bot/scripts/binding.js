"use strict"

const Command = require("../script");

const schemas = require("../../db");

const binding = new Command({
    
    name: "Script Bindings",
    description: "Quick and Dirty Commands\n-bind <name> <action> <args> // \nname: anything, action: text | file | embed, args: some text | file url | --embedProperty embedValue",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099656270184459/bind.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "bind;unbind;unbind-all",

    featured: false,

    preload: false,

    cb: function(client, message, guild, user, script, match) {

        // action: text, file, embed
        
        // text:
        // bind text_binding text this is a text binding

        // file:
        // bind file_binding file https://cdn.discordapp.com/attachments/209040403918356481/487658989069402112/pjiicjez.png

        // embed:
        // bind embed_binding embed --description this is an embed binding

        const args = message.content.split(" ");

        const bind = args.shift();
        const name = args.shift();
        const action = args.shift();

        if (match === "unbind-all") {

            const args = message.content.split(" ");

            if ((message.member.permissions.bitfield & 0b1000) !== 0b1000) {
                return message.reply("You need to be a server admin to run this command for security reasons.")
            }
            if (args[1] == null) {
                return message.reply("🚨 This command is dangerous! 🚨\n\nIf you are **certain** that you want to run this command, please enter the command again but with the name of the server.");
            }
            if (args.slice(1).reduce((a, e) => a += e + " ", "").trim() === message.guild.name) {
                schemas.ScriptSchema
                    .find({
                        _id: { $in: guild.scripts.map(e => e.object_id) },
                        created_with: "script_bindings"
                    })
                    .then(scripts => {
                        if (script.length === 0) {
                            return message.reply("no bound scripts found");
                        }

                        schemas.GuildSchema
                            .updateOne({
                                discord_id: guild.discord_id
                            }, {
                                $pull: { scripts: { object_id: { $in: scripts.map(e => e._id) } } }
                            })
                            .then(() => {
                                return message.reply("successfully unbound all bindings");
                            })
                            .catch(error => {
                                return message.reply("error unbinding scripts");
                            });
                    })
                    .catch(error => {
                        return message.reply("error unbinding scripts");
                    });
            } else {
                message.reply("ye mate you got the name of your own server wrong teehee");
            }
        }

        // bind name action args
        if (match === "bind") {

            if (name === undefined) {

                return message.reply("name was not set");
            }

            if (action === undefined) {

                return message.reply("action was not set");
            }

            if (args[0] === undefined) {

                return message.reply("args were not set");
            }

            const dataArgs = [];

            if (action === "text") {

                dataArgs.push({
                    field: "text",
                    value: args.join(" ")
                });                
            }

            if (action === "file") {

                dataArgs.push({
                    field: "url",
                    value: args[0]
                }); 
            }

            if (action ===  "embed") {

                // author
                // color
                // description
                // footer
                // image
                // thumbnail
                // timestamp
                // title
                // url

                // --description adfsd sdfgn df --author sdf sdf ff

                let embedArgs = args.join(" ").split("--");
                embedArgs.shift();
                embedArgs = embedArgs.map(s => s.trim())

                if (embedArgs.length % 2 !== 0) {

                    return message.reply("incorrect args were set");
                }

                for (let arg of embedArgs) {

                    const fieldArgs = arg.split(" ");

                    const field = fieldArgs.shift();
                    const value = fieldArgs.join(" ");

                    dataArgs.push({
                        field,
                        value
                    });
                }
            }

            if (dataArgs.length === 0) {

                return message.reply("incorrect action was set");
            }

            const script = new schemas.ScriptSchema({

                author_id: message.author.id,

                name,
                description: "Auto-generated by the Feinwaru Binder™",
                thumbnail: "https://cdn.discordapp.com/attachments/379432139856412682/512772131835084802/81KPFcRQKkL.png",
                marketplace_enabled: false,

                type: "json",
                match_type: "command",
                match: name,

                code: null,
                data: {
                    action,
                    args: dataArgs
                },

                local: false,
                featured: false,
                verified: false,
                likes: 0,
                guild_count: 1,
                use_count: 0,

                created_with: "script_bindings"
            });

            script
                .save()
                .then(script => {

                    // get guild again to avoid conflicts
                    schemas.GuildSchema
                        .findOne({
                            discord_id: message.guild.id
                        })
                        .then(guild => {

                            const guildScript = new schemas.GuildScriptSchema({
                                object_id: script._id
                            });
        
                            guild.scripts.push(guildScript);
        
                            guild
                                .save()
                                .then(() => {

                                    message.reply(`successfully bound '${name}'`);
                                })
                                .catch(error => {
        
                                    message.reply(`error adding script to guild: ${error}`);
                                });
                        })
                        .catch(error => {

                            message.reply(`error finding guild: ${error}`);
                        });
                })
                .catch(error => {

                    message.reply(`error saving script: ${error}`);
                });
        }

        // unbind name
        if (match === "unbind") {
            if (name == null) {
                return message.reply("script name is not set");
            }

            schemas.ScriptSchema
                .find({
                    _id: { $in: guild.scripts.map(e => e.object_id) }
                })
                .then(scripts => {
                    if (script.length === 0) {
                        return message.reply(`script '${name}' not found`);
                    }
                    if (scripts.length > 1) {
                        scripts = scripts.filter(e => (((e.author_id === message.author.id) || ((message.member.permissions.bitfield & 0b1000) === 0b1000)) && (e.local === false) && (name === e.name)));
                    }
                    if (scripts.length === 0) {
                        return message.reply(`script '${name}' does not belong to you`);
                    }
                    if (scripts.length > 1) {
                        return message.reply(`error: more than one script selected, this is probably a bug and should be reported to the devs`);
                    }

                    schemas.GuildSchema
                        .updateOne({
                            discord_id: guild.discord_id
                        }, {
                            $pull: { scripts: { object_id: scripts[0]._id } }
                        })
                        .then(() => {
                            message.reply(`binding '${name}' successfully removed`);
                        })
                        .catch(error => {
                            return message.reply(`error unbinding the script: ${error}`);
                        });
                })
                .catch(error => {
                    return message.reply(`error unbinding the script: ${error}`);
                });
        }
    }
});

module.exports = binding;
