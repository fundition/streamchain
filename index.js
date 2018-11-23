const { Client, BlockchainMode } = require('dsteem');
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var client = new Client('https://api.steemit.com')
app.listen(port, () => console.log(`Listening on ${port}`));

var stream = client.blockchain.getBlockStream({mode: BlockchainMode.Latest})
stream.on("data", function (block) {
    try {
        var object = JSON.stringify(block.transactions)
        object.replace("\\", "")
        object = JSON.parse(object)
        for (i = 0; i < object.length; i++) {
            var transaction;
            //CHECK IF IS A TRANSFER TO ONGAME
            if (object[i].operations[0][0] === "transfer" && object[i].operations[0][1].to === "ongame") {
                //DO SOMETHING
            }
            //CHECK IF IS A CUSTOM JSON + CUSTOMID
            if (object[i].operations[0][0] === "custom_json" && object[i].operations[0][1].id === "dw-char") {
               //DO SOMETHING
            }
        }
    } catch (error) {
        console.log(error)
    }
})
    .on('end', function () {
        // done
        console.log('END');
    });



