#!/usr/bin/env node

var API = require('../../index').Stateless;
var ImageService = require('../../index').ImageService;
const fs = require('fs');

var program = require('commander');

program
    .version('1.0.0')
    .option('-a, --authtoken <token>', 'Set the auth token to use')
    .option('-g, --group_id <id>', 'The group_id to use')
    .option('-r, --results_id <id>', 'The results_id to use')
    .option('-g, --member_id <id>', 'The member_id to use')
    .option('-m, --message_id <id>', 'The message_id to use')
    .option('-b, --bot_id <id>', 'The message_id to use')
    .option('-n, --name <string>', 'The bot name to use')
    .option('-t, --text <string>', 'The text to use for a bot message. Be sure to quote it!')
    .option('-o, --opts <JSON>', 'supply a json object as options. Be sure to wrap it in double-quotes!')
    .option('-i, --image <PATH>', 'an image to upload to the ImageService. Use with ImageService.post')
    .option('-c, --continuation_token <string>', 'continuation token used to get the next page of polls');

var justPrintEverythingCallback = function(err, ret) {
    if (!err) {
        //74533008
        // var json = JSON.stringify(ret, null, " ");
        console.log(ret);
        // fs.writeFile('myjsonfile.json', json, 'utf8', function(err) {
        //     if (err) throw err;
        //     console.log('complete');
        // });
        //console.log(ret.members);
        //console.log(JSON.stringify(ret.members[0].user_id, null, " "))
        //var members = JSON.stringify(ret.members, null, " ");

        var ids = [];
        for (var i = 0; i < ret.members.length; i++) {
            var userId = ret.members[i].id;
            ids[i] = userId;

        }
        const jsonContent = JSON.stringify(ids, null, " ");
        fs.writeFile("dollarBeeruserIds.json", jsonContent, 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
        // // // console.log(x);
        var obj = JSON.parse(fs.readFileSync('dollarBeeruserIds.json', 'utf8'));
        console.log(obj[1]);
        console.log(obj.length);
        // console.log(jsonContent.length);

        console.log("hello");
    } else {
        console.log("ERROR!", err)
    }
}

var requireArgs = function(argsArr) {
    var notGood = false;
    for (var i in argsArr) {
        if (!program[argsArr[i]]) {
            console.log("No " + argsArr[i] + " specified.")
            notGood = true;
        }
    }
    if (notGood) {
        console.log("For more info, please run ./cli.js --help")
        process.exit(1);
    }
}

/************************************************************************
 * Groups
 ***********************************************************************/

program
    .command('Groups.index')
    .description("List the authenticated user's active groups.")
    .action(function(env) {
        API.Groups.index(program.authtoken, justPrintEverythingCallback);
    });


program
    .command('Groups.former')
    .description("List they groups you have left but can rejoin.")
    .action(function(env) {
        API.Groups.former(program.authtoken, justPrintEverythingCallback);
    });

program
    .command('Groups.show')
    .description("List a specific group.")
    .action(function(env) {
        requireArgs(["group_id"]);
        // var idArr = JSON.parse(fs.readFileSync('dollarBeeruserIds.json', 'utf8'));

        API.Groups.show(program.authtoken, program.group_id, justPrintEverythingCallback);
    });

program
    .command('Groups.create')
    .description("Create a new group.")
    .action(function(env) {
        requireArgs(["opts"]);
        API.Groups.create(program.authtoken, JSON.parse(program.opts), justPrintEverythingCallback);
    });

program
    .command('Groups.update')
    .description("Update a group after creation.")
    .action(function(env) {
        requireArgs(["opts", "group_id"]);
        API.Groups.update(program.authtoken, program.group_id, JSON.parse(program.opts), justPrintEverythingCallback);
    });

program
    .command('Groups.destroy')
    .description("Disband a group. This action is only available to the group creator.")
    .action(function(env) {
        requireArgs(["group_id"]);
        API.Groups.destroy(program.authtoken, program.group_id, justPrintEverythingCallback);
    });

/************************************************************************
 * Members
 ***********************************************************************/

program
    .command('Members.add')
    .description("Add members to a group.")
    .action(function(env) {
        requireArgs(["opts", "group_id"]);
        API.Members.add(program.authtoken, program.group_id, JSON.parse(program.opts), justPrintEverythingCallback);
    });
program
    .command('Members.remove')
    .description("remove members to a group.")
    .action(function(env) {
        requireArgs(["member_id", "group_id"]);
        //var x = 768500879;
        //console.log(program.member_id);
        API.Members.remove(program.authtoken, program.group_id, program.member_id, justPrintEverythingCallback);
    });
program
    .command('Members.results')
    .description("Get the membership results from an add call.")
    .action(function(env) {
        requireArgs(["results_id", "group_id"]);
        API.Members.results(program.authtoken, program.group_id, program.results_id, justPrintEverythingCallback);
    });

/************************************************************************
 * Messages
 ***********************************************************************/

program
    .command('Messages.index')
    .description("Messages for a group. Return 20, can request before_id or after_id.")
    .action(function(env) {
        requireArgs(["group_id"]);
        var opts = {};
        if (program.opts)
            opts = JSON.parse(program.opts);
        API.Messages.index(program.authtoken, program.group_id, opts, justPrintEverythingCallback);
    });

program
    .command('Messages.create')
    .description("Send a message to a group.")
    .action(function(env) {
        requireArgs(["opts", "group_id"]);
        API.Messages.create(program.authtoken, program.group_id, JSON.parse(program.opts), justPrintEverythingCallback);
    });

/************************************************************************
 * Chats
 ***********************************************************************/

program
    .command('Chats.index')
    .description("Index of DM chats a user has.")
    .action(function(env) {
        var opts = {};
        if (program.opts)
            opts = JSON.parse(program.opts);
        API.Chats.index(program.authtoken, program.group_id, opts, justPrintEverythingCallback);
    });

/************************************************************************
 * Direct Messages
 ***********************************************************************/

program
    .command('DirectMessages.index')
    .description("Fetch direct messages between two users. Return 20, can request before_id or after_id.")
    .action(function(env) {
        requireArgs(["opts"]);
        var opts = {};
        if (program.opts)
            opts = JSON.parse(program.opts);
        API.DirectMessages.index(program.authtoken, opts, justPrintEverythingCallback);
    });

program
    .command('DirectMessages.create')
    .description("Send a message to another user.")
    .action(function(env) {
        requireArgs(["opts"]);
        API.DirectMessages.create(program.authtoken, JSON.parse(program.opts), justPrintEverythingCallback);
    });

/************************************************************************
 * Likes
 ***********************************************************************/

program
    .command('Likes.create')
    .description("Like a message.")
    .action(function(env) {
        requireArgs(["message_id", "group_id"]);
        API.Likes.create(program.authtoken, program.group_id, program.message_id, justPrintEverythingCallback);
    });
program
    .command('Likes.destroy')
    .description("Unlike a liked message.")
    .action(function(env) {
        requireArgs(["message_id", "group_id"]);
        API.Likes.destroy(program.authtoken, program.group_id, program.message_id, justPrintEverythingCallback);
    });

/************************************************************************
 * Bots
 ***********************************************************************/

program
    .command('Bots.create')
    .description("Create a bot.")
    .action(function(env) {
        requireArgs(["name", "group_id"]);
        var opts = {};
        if (program.opts)
            opts = JSON.parse(program.opts);
        API.Bots.create(program.authtoken, program.name, program.group_id, opts, justPrintEverythingCallback);
    });

program
    .command('Bots.post')
    .description("Post a message as a bot")
    .action(function(env) {
        requireArgs(["bot_id", "text"]);
        var opts = {};
        if (program.opts)
            opts = JSON.parse(program.opts);
        API.Bots.post(program.authtoken, program.bot_id, program.text, opts, justPrintEverythingCallback);
    });

program
    .command('Bots.index')
    .description("List bots you have created")
    .action(function(env) {
        API.Bots.index(program.authtoken, justPrintEverythingCallback);
    });

program
    .command('Bots.destroy')
    .description("Remove a bot that you have created")
    .action(function(env) {
        requireArgs(["bot_id"]);
        API.Bots.destroy(program.authtoken, program.bot_id, justPrintEverythingCallback);
    });

/************************************************************************
 * Users
 ***********************************************************************/

program
    .command('Users.me')
    .description("Get details about the authenticated user.")
    .action(function(env) {
        API.Users.me(program.authtoken, justPrintEverythingCallback);
    });

/************************************************************************
 * ImageService
 ***********************************************************************/

program
    .command('ImageService.post')
    .description("Upload an image to GroupMe's ImageService")
    .action(function(env) {
        requireArgs(["image"]);
        ImageService.post(program.image, justPrintEverythingCallback);
    });

/************************************************************************
 * Polls
 ***********************************************************************/

program
    .command('Polls.index')
    .description('List polls in group.')
    .action(function(env) {
        requireArgs(["group_id"]);
        API.Polls.index(program.authtoken, program.group_id, program.continuation_token, justPrintEverythingCallback);
    });

program
    .command('Polls.create')
    .description('Create a poll. Requires -o {"subject":"Poll Title", "options":["Option 1", "Option 2"]}')
    .action(function(env) {
        requireArgs(["opts", "group_id"]);
        API.Polls.create(program.authtoken, program.group_id, JSON.parse(program.opts), justPrintEverythingCallback);
    });

program.parse(process.argv);

requireArgs(["authtoken"]);