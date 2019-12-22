import { Schema } from "mongoose";

// Default discord avatar thumbnail urls.
// Will be used as default script thumbnails in the schema.
const thumbnails = [
  "https://cdn.discordapp.com/embed/avatars/0.png",
  "https://cdn.discordapp.com/embed/avatars/1.png",
  "https://cdn.discordapp.com/embed/avatars/2.png",
  "https://cdn.discordapp.com/embed/avatars/3.png",
  "https://cdn.discordapp.com/embed/avatars/4.png"
];

// Returns a random thumbnail url from the 'thumbnails' array.
const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Subschema for 'json' scripts.
const argsSchema = new Schema({
  // This will be 'text', 'url' or any embed property.
  field: { type: String, required: true },
  value: { type: String, required: true }
}, {
  _id: false
});

// Subschema for 'json' type scripts.
const dataSchema = new Schema({
  // This will be either 'text', 'file' or 'embed'
  action: { type: String, default: "" },
  args: [argsSchema]
}, {
  _id: false
});

// Main script schema.
const ScriptSchema = new Schema({

  // Id generated by mongo, this is here so I remember it exists.
  // _id: ObjectId,

  // The mongo id of the scripts owner.
  author_id: { type: String, required: true },

  // User set parameters. Note that 'thumbnail'
  // should be set to a url of an image.
  name: { type: String, required: true },
  description: { type: String, default: "" },
  help: { type: String, default: "" },
  thumbnail: { type: String, default: getRandomThumbnail },
  marketplace_enabled: { type: Boolean, default: false },

  // Either 'js' or 'json'. This will determine if the
  // 'code' or 'data' field will be used when executing the script.
  type: { type: String, default: "js" },
  // Either 'command', 'startswith', 'contains' or 'exactmatch'.
  // This will determine what the bot looks for in a
  // message when deciding whether the message entered is a command.
  // *command:*       Message starts with guild prefix
  // followed by 'match'. Not case sensitive.
  // *startswith:*    Message starts with 'match'. Not case sensitive.
  // *contains:*      Message contains 'match' at any point. Not case sensitive.
  // *exactmatch:*    Message is exactly the same as 'match'. *Case sensitive.*
  match_type: { type: String, default: "command" },
  // What the bot looks for in chat when deciding whether
  // or not to execute this command.
  match: { type: String, required: true },

  // Javascript code to execute. This will only be used if 'type' is set to js.
  code: { type: String, default: "" },
  // Json with instructions on how to execute the command.
  // This will only be used if 'type' is set to json.
  data: dataSchema,

  // Whether or not the script code is hard coded on our servers.
  // This will be false for user created scripts.
  local: { type: Boolean, default: false },
  // Whether or not the script is displayed on the top of our marketplace page.
  featured: { type: Boolean, default: false },
  // Local scripts only: whether or not the script gets added
  // to a newly added guild.
  preload: { type: Boolean, default: false },
  // Whether or not the script has been reviewed by and admin
  // and is guaranteed to work.
  verified: { type: Boolean, default: false },
  // The number of user who have liked this script.
  likes: { type: Number, default: 0 },
  // The number of guilds that are using this script.
  guild_count: { type: Number, default: 0 },
  // The amount of times this script has been executed.
  use_count: { type: Number, default: 0 },

  // What was used to create this script. Could be our online
  // monaco editor, basic script editor or other.
  created_with: { type: String, required: true },
  // Timestamp of script creation.
  created_at: { type: Date, default: Date.now },
  // Timestamp of script edit.
  updated_at: { type: Date, default: Date.now }
});

export default ScriptSchema;
