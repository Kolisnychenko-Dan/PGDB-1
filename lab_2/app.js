const dbCommand = require('./db/db_commands')

const view = require('./view/replics');
const tablefy = require('./view/tablefy');

const db = new dbCommand();
func();

function func(){
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout});

    readline.question("> ",dataObject => {
        onInput(dataObject);
        readline.close();
        func();
    });
}

async function onInput(dataObject)
{
    const inputString = dataObject.toString().trim();
    
    const splittedInput = inputString.split('/');
    switch (splittedInput[0]){
        case 'get':
            switch (splittedInput[1]){
                case 'heroes':
                    db.GetHeroes(tablefy.tablefy,view.print,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 10,
                        !isNaN(splittedInput[3]) ? splittedInput[3]: 0);
                break;
                case 'items':
                    db.GetItems(tablefy.tablefy,view.print,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 10,
                        !isNaN(splittedInput[3]) ? splittedInput[3]: 0);
                break;
                case 'itembuilds':
                    db.GetItemBuilds(tablefy.tablefy,view.print,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 10,
                        !isNaN(splittedInput[3]) ? splittedInput[3]: 0);
                break;
                case 'hero':
                    db.GetHero(tablefy.tablefyOne,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0);
                break;
                case 'item':
                    db.GetItem(tablefy.tablefyOne,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0);
                break;
                case 'itembuild':
                    db.GetItemBuild(tablefy.tablefyOne,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0);
                break;
                case 'itemsinbuild':
                    db.GetItemsInBuild(tablefy.tablefy,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0);
                break;
                default: console.log(`Entity ${splittedInput[1]} not found`);
            }
            break;
        case 'delete':
            switch (splittedInput[1]){
                case 'hero':
                    db.DeleteHero(view.printSuccesfullDeletion,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0)
                break;
                case 'item':
                    db.DeleteItem(view.printSuccesfullDeletion,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0)
                break;
                case 'itemBuild':
                    db.DeleteItemBuild(view.printSuccesfullDeletion,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0)
                break;
                default: console.log(`Entity ${splittedInput[1]} not found`);
            }
            break;
        case 'update':
            {
                let id = Number.parseInt(splittedInput[2]);
                let values = [];
                
                if(id != NaN){
                    values[0] = splittedInput[2]; // values[0] is id
                    for(let i = 1; splittedInput[i+2] != undefined; i++){
                        value = splittedInput[i+2].split('=');
                        values[i] = [value[0].trim(),value[1].trim()];
                    }
                }
                else console.log("Invalid input");
                
                switch (splittedInput[1]){
                    case 'hero':
                        db.UpdateHero(tablefy.tablefyOne,view.printDBErr,values);
                    break;
                    case 'item':
                        db.UpdateItem(tablefy.tablefyOne,view.printDBErr,values);
                    break;
                    case 'itembuild':
                        db.UpdateItemBuild(tablefy.tablefyOne,view.printDBErr,values);
                    break;
                    default: console.log(`Entity ${splittedInput[1]} not found`);
                }
            }
            break;
        case 'insert':
            {
                let values = [];
                 
                for(let i = 0; splittedInput[i+2] != undefined; i++){
                    value = splittedInput[i+2].split('=');
                    values[i] = [value[0].trim(),value[1].trim()];
                }
                
                switch (splittedInput[1]){
                    case 'hero':
                        db.InsertHero(tablefy.tablefyOne,view.printDBErr,values);
                    break;
                    case 'item':
                        db.InsertItem(tablefy.tablefyOne,view.printDBErr,values);
                    break;
                    case 'itembuild':
                        db.InsertItemBuild(tablefy.tablefyOne,view.printDBErr,values)
                    break;
                    default: console.log(`Entity ${splittedInput[1]} not found`);
                }
            }
            break;
        case 'add':
            {
                let values = [];
                for(let i = 0; splittedInput[i+1] != undefined; i++){
                    value = splittedInput[i+1].split('=');
                    values[i] = [value[0].trim(),value[1].trim()];
                }
                
                if(values[0][0] == 'itembuild' && values[1][0] == 'item'){
                    db.InsertItemInBuild(view.printSuccesfullyAdded,view.printDBErr,values[1][1],values[0][1]);
                }
                else if (values[1][0] == 'itembuild' && values[0][0] == 'item'){
                    db.InsertItemInBuild(view.printSuccesfullyAdded,view.printDBErr,values[0][1],values[1][1]);
                }
                else view.print("Params for add are: 'itembuild', 'item'");
            }
            break;
        case 'remove':
            {
                let values = [];
                for(let i = 0; splittedInput[i+1] != undefined; i++){
                    value = splittedInput[i+1].split('=');
                    values[i] = [value[0].trim(),value[1].trim()];
                }
                
                if(values[0][0] == 'itembuild' && values[1][0] == 'item'){
                    db.RemoveItemFromBuild(view.printSuccesfullyRemoved,view.printDBErr,values[1][1],values[0][1]);
                }
                else if (values[1][0] == 'itembuild' && values[0][0] == 'item'){
                    db.RemoveItemFromBuild(view.printSuccesfullyRemoved,view.printDBErr,values[0][1],values[1][1]);
                }
                else view.print("Params for remove are: 'itembuild', 'item'");
            }
            break;
        case 'generate':
            {
                db.GenerateItemBuilds(view.printSuccesfullGenerated,view.printDBErr,
                    !isNaN(splittedInput[1]) ? splittedInput[1]: 1000);
            }
            break;
        case 'query': 
            {
                switch (splittedInput[1]){
                    case '1': // hero_id/item_id/amount/winrate
                        db.query1(tablefy.tablefy, view.printDBErr, splittedInput.splice(2));
                        break;
                    case '2': // price,price/damage,damage/amount
                        db.query2(tablefy.tablefy, view.printDBErr, splittedInput.splice(2));
                        break;
                    case '3': // hero/patch/winrate
                        db.query3(tablefy.tablefy, view.printDBErr, splittedInput.splice(2))
                        break;
                    default: console.log(`Query ${splittedInput[1]} not found`);
                }
                
                
            }
            break;
        case 'exit':
             db.CloseAll();
            process.exit(0);
            break;
        default: console.log(`command not found: ${inputString}`);
    }
}