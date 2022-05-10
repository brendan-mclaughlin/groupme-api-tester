const { exec } = require("child_process");
const fs = require('fs');
require('dotenv').config();


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
var obj = JSON.parse(fs.readFileSync('dollarBeeruserIds.json', 'utf8'));
//console.log(obj[1]);
const RemoveAll = async() => {
    for (var i = 1; i < obj.length; i++) {

        await sleep(1000);
        if (obj[i] === 715063575) {
            console.log('Saved myself');
            continue;
        }

        var command = "node cli.js -a " + process.env.TOKEN + " --member_id " + obj[i] + " --group_id 76609677 Members.remove"
            //var command2 = "echo hello"

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                // return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                // return;
            }
            console.log(`stdout: ${stdout}`);
        });
        console.log('Removed: ', obj[i]);
    }

}
RemoveAll();