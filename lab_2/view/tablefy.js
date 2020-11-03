module.exports = {
    tablefy(object){
        if(object == null) return null;
        const keys = Object.keys(object[0]);
        let table = [];
        let keyString = new String();

        for (key of keys){
            keyString += `|  ${key}  |`;
        }
        table.push(keyString);

        for(item of object){
            valueString = new String();
            for(key of keys){
                if(item[key].length > key.length){
                    valueString += `| ${item[key].toString().substring(0,key.length )}.. |`;
                }
                else valueString += `|  ${item[key].toString().padEnd(key.length + 1, ' ')} |`;
            }
            table.push(valueString);
        }

        let borderLine = ''.padEnd(keyString.length,'-');
        for(string of table){
            console.log(string);
            console.log(borderLine);
        }
    },
    tablefyOne(object){
        if(object[0] == undefined || object[0] == null) {
            console.log("No rows to tablefy");
            return;
        }

        object = object[0];
        const keys = Object.keys(object);
        
        let valueString = new String();
        for (key of keys){
            if(object[key].toString().length <= 3) object[key] = `  ${object[key].toString()}  `;
            valueString += `|  ${object[key].toString()}  |`;
        }
    
        let keyString = new String();
        for(key of keys){
            obj = object[key].toString();
            if(obj.padEnd(obj.length + 2, ' ').length == key.length){
                keyString += `| ${key.substring(0,obj.length + 2)} |`;
            }
            else if(obj.padEnd(obj.length + 1, ' ').length == key.length){
                keyString += `| ${key.substring(0,obj.length + 1)}  |`;
            }
            else if(obj.length < key.length){
                keyString += `| ${key.substring(0,obj.length)}.. |`;
            }
            else keyString += `|  ${key.padEnd(obj.length + 1,' ')} |`;
        }
        
        let borderLine = ''.padEnd(keyString.length,'-');
        console.log(keyString);
        console.log(borderLine);
        console.log(valueString);
    }
}
