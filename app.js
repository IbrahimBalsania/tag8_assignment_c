const fs = require("fs");
const sleep = (ms) => require("child_process").execSync(`"${process.argv[0]}" -e setTimeout(function(){},${ms})`);
var config = fs.readFileSync("./config/config.txt");
config = config.toString();
config = JSON.parse(config);

function getStolenItems()
{
    var itemListOrg = config.items;
    var itemList = [];
    if(config.total_inventory_available <= 0 || config.total_inventory_available == undefined || config.total_inventory_available == "undefined" || config.total_inventory_available == null || config.total_inventory_available == "null"){
        return console.log("Total inventory available should be more than zero");
    }
    if(config.time_to_hack <= 0 || config.time_to_hack == undefined || config.time_to_hack == "undefined" || config.time_to_hack == null || config.time_to_hack == "null"){
        return console.log("Time to available to hack should be more than zero");
    }
    console.log("Items before filtering : "+JSON.stringify(itemListOrg));
    for(var i=0 ; i<config.total_inventory_available ; i++)
    {
        if(itemListOrg[i][0] > 0 && itemListOrg[i][1] > 0){
            itemList[itemList.length] = itemListOrg[i]
        }
    }
    if(itemList.length <= 0){
        return console.log("No items can be stolen");
    }
    console.log("Items after filtering : "+JSON.stringify(itemList));
    var total_items_stolen = hackFlipmart(config.time_to_hack,itemList)
    console.log("Total Items Stolen : "+JSON.stringify(total_items_stolen))
    var totalAmount = 0;
    for(var i=0 ; i<total_items_stolen.length ; i++)
    {
        totalAmount += total_items_stolen[i][3];
    }
    return console.log("Total amount worth items stolen : "+totalAmount);
}
function hackFlipmart(time_to_hack,itemListArr)
{
    // input item array [["seconds","cost"]]
    // processing item array [["seconds","cost","total_item_stolen","total_amount","next_available_time"]]
    // output item array [["seconds","cost","total_item_stolen","total_amount"]]
    
    console.log(`Time available for hacking ${time_to_hack} seconds...`)
    for(var i=1 ; i<=time_to_hack ; i++)
    {
        sleep(1)
        if(i == 1)
        {
            // on second 1 all items are available
            for(var k=0 ; k<itemListArr.length ; k++)
            {
                itemListArr[k][2] = 1;
                itemListArr[k][3] = itemListArr[k][1];
                itemListArr[k][4] = itemListArr[k][0]+1;
            }
        }
        else
        {
            for(j=0 ; j<itemListArr.length ; j++)
            {
                if(itemListArr[j][4] == i){
                    itemListArr[j][2] += 1;
                    itemListArr[j][3] += itemListArr[j][1];
                    itemListArr[j][4] += itemListArr[j][0];
                }
            }
        }
        console.log(`Hacking in process ${i} : ${JSON.stringify(itemListArr)}`);
    }
    var outputArr = [];
    for(var i=0 ; i<itemListArr.length ; i++)
    {
        var tmp = []
        tmp[tmp.length] = itemListArr[i][0];
        tmp[tmp.length] = itemListArr[i][1];
        tmp[tmp.length] = itemListArr[i][2];
        tmp[tmp.length] = itemListArr[i][3];

        outputArr[outputArr.length] = tmp;
    }
    return outputArr;
}
getStolenItems();