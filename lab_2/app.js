const dbCommand = require('./db/db_commands')

const view = require('./view/replics');
const tablefy = require('./view/tablefy');

db = new dbCommand();
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
                case 'hero':
                    db.GetHero(tablefy.tablefyOne,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0)
                break;
                case 'item':
                    db.GetItem(tablefy.tablefyOne,view.printDBErr,
                        !isNaN(splittedInput[2]) ? splittedInput[2]: 0)
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
                    default: console.log(`Entity ${splittedInput[1]} not found`);
                }
            }
            break;
        case 'exit':
            db.CloseAll();
            process.exit(0);
        default: console.log(`command not found: ${inputString}`);
    }
}
