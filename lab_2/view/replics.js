module.exports = {
    print(string){
        console.log(string);
    },
    printDBErr(string){
        console.log(`OOPS.. Got this one from the database: ${string.split('\n')[0]}`);
    },
    printSuccesfullDeletion(string){
        if(string[0] != undefined) console.log('Deleted Succesfuly');
        else console.log('Seems like the id was not found');
    }
}