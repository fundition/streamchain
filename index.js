const { Client, BlockchainMode } = require('dsteem');
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
var client = new Client('https://api.steemit.com')
app.listen(port, () => console.log(`Listening on ${port}`));

var stream = client.blockchain.getBlockStream({mode: BlockchainMode.Latest})
stream.on("data", function (block) {
    try {
        var object = JSON.stringify(block.transactions)
        object.replace("\\", "")
        object = JSON.parse(object)
    } catch (error) {
        console.log(error)
    }
    for (i = 0; i < object.length; i++) {
            var json = object[i].operations[0][1]
                try {
                    json.json_metadata = JSON.parse(json.json_metadata)
                }
                catch (e) {
                }
            if (json.json_metadata.app.includes('fundition')) {
                console.log('its a fundition content from ' + json.author)
                //DO SOMETHING
                }
    })
.on('end', function () {
    // done
    console.log('END');
});



