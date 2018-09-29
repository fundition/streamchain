const { Client, BlockchainMode } = require('dsteem');
const express = require('express')
const app = express()
const port = process.env.PORT || 4000

var player = require('./operations/player_handler')
var battle = require('./operations/battle_handler')
var shop = require('./operations/shop_handler')
var helpers = require('./operations/helpers')

var client = new Client('https://api.steemit.com')

app.listen(port, () => console.log(`Listening on ${port}`));

transferForShop = function (transaction) {
    player.checkForPlayer(transaction.from, function (exist) {
        if (exist) {
            shop.StartTransaction(transaction, function (error) {
                if (error)
                    console.log(error)
            })
        }
        else {
            player.createNewPlayer(transaction, function (error) {
                if (error) {
                    console.log("couldnt create charachter")
                }
                else {
                    shop.StartTransaction(transaction, function (error) {
                        if (error)
                            console.log(error)
                    })
                }
            })
        }
    })
}



var stream = client.blockchain.getBlockStream({ mode: BlockchainMode.Latest })
stream.on("data", function (block) {
    try {
        var object = JSON.stringify(block.transactions)
        object.replace("\\", "")
        object = JSON.parse(object)
        for (i = 0; i < object.length; i++) {
            var transaction;
            if (object[i].operations[0][0] === "transfer" && object[i].operations[0][1].to === "ongame") {
                transferForShop(object[i].operations[0][1])
            }
            if (object[i].operations[0][0] === "custom_json" && object[i].operations[0][1].id === "ongame-fight") {
                try {
                    var fight = JSON.parse(object[i].operations[0][1].json)
                    battle.checkForABattle(fight.user_id, function (error) {
                        if (error) {
                            console.log(error)
                        }
                    })

                } catch (error) {
                    console.log(error)
                }
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



