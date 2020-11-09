const db = require('./index');
/*const Hero = require('../types/hero');
const Item = require('../types/item');
const ItemBuild = require('../types/itembuild');*/

class DbCommand{
    CloseAll(){ db.closeAll(); }

    /////////////////////////////////// HEROES //////////////////////////////////////////////////

    GetHeroes(result, error, limit, offset){
        let text = `SELECT heroes_id,hero as "     hero     ",damage,stats_str,stats_agile,stats_int 
                    FROM heroes LIMIT $1 OFFSET $2`;
        db.query(text, [limit,offset])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }

    GetHero(result, error, heroId){
        let text = `SELECT * FROM heroes WHERE heroes_id = $1`
        db.query(text, [heroId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }

    InsertHero(result,error,hero){
        let keyValues = '';
        let values = '';
        for(let i = 0; i < hero.length; i++){
            keyValues += `${hero[i][0]}`;
            values += `$${i+1}`
            if(i+1 < hero.length) {
                keyValues += `, `;
                values += `, `
            }
        }

        let convertedHero = [];
        hero.forEach( h => convertedHero.push(h[1]))

        let text = `INSERT INTO heroes(${keyValues}) VALUES (${values}) RETURNING *`;
        db.query(text, convertedHero)
            .then((res)=>{result(res.rows)})
            .catch((err) => {error(err.stack)});
    }

    UpdateHero(result,error,hero){
        let values = '';
        for(let i = 1; i < hero.length; i++){
            values += `${hero[i][0]} = $${i+1}`;
            if(i+1 < hero.length) values += `, `;
        }
        let convertedHero = [hero[0]];
        for(let i = 1; i < hero.length; i++){
            convertedHero[i] = hero[i][1];
        }
        let text = `UPDATE heroes SET ${values} WHERE heroes_id = $1 RETURNING *`;
        db.query(text,convertedHero)
            .then((res)=>{result(res.rows)})
            .catch((err) => {error(err.stack)});
    }
    
    DeleteHero(result,error,heroId){
        let text = `DELETE FROM heroes WHERE heroes_id = $1 RETURNING *`;
        db.query(text,[heroId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)})
    }

    /////////////////////////////////////// ITEMS ///////////////////////////////////////////////////////
    GetItems(result, error, limit, offset){
        let text = `SELECT items_id,item as "     item     ",price,damage,stats_str,stats_agile,stats_int
                    FROM items LIMIT $1 OFFSET $2`;
        db.query(text, [limit,offset])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }

    GetItem(result, error, heroId){
        let text = `SELECT * FROM items WHERE items_id = $1`
        db.query(text, [heroId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }
    
    InsertItem(result,error,item){
        let keyValues = '';
        let values = '';
        for(let i = 0; i < item.length; i++){
            keyValues += `${item[i][0]}`;
            values += `$${i+1}`
            if(i+1 < item.length) {
                keyValues += `, `;
                values += `, `
            }
        }

        let convertedItem = [];
        item.forEach( h => convertedItem.push(h[1]))

        let text = `INSERT INTO items(${keyValues}) VALUES (${values}) RETURNING *`;
        db.query(text, convertedItem)
            .then((res)=>{result(res.rows)})
            .catch((err) => {error(err.stack)});
    }

    UpdateItem(result,error,item){
        let values = '';
        for(let i = 1; i < item.length; i++){
            values += `${item[i][0]} = $${i+1}`;
            if(i+1 < item.length) values += `, `;
        }
        let convertedItem = [item[0]];
        for(let i = 1; i < item.length; i++){
            convertedItem[i] = item[i][1];
        }
        let text = `UPDATE items SET ${values} WHERE items_id = $1 RETURNING *`;
        db.query(text,convertedItem)
            .then((res)=>{result(res.rows)})
            .catch((err) => {error(err.stack)})
    }
    
    DeleteItem(result,error,itemId){
        let text = `DELETE FROM items WHERE item_id = $1`;
        db.query(text,[itemId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)})
    }

    ////////////////////////////////////// ITEMBUILDS /////////////////////////////////////////////////////
    GetItemBuilds(result, error, limit, offset){
        let text = `SELECT * FROM itembuilds LIMIT $1 OFFSET $2`;
        db.query(text, [limit,offset])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }
    
    GetItemBuild(result,error,itemBuildId){
        let text = `SELECT itembuilds_id, hero_id, hero, winrate, patch 
                    FROM itembuilds
                    INNER JOIN heroes
                    ON hero_id = heroes_id
                    WHERE itembuilds_id = $1;`
        db.query(text, [itemBuildId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }

    InsertItemBuild(result,error,itemBuild){
        let hasItems = 0;
        for(var j = 0; j < itemBuild.length; j++){
            if(itemBuild[j][0] == 'items') 
            {
                hasItems = 1;
                continue;
            }
        }
        
        let keyValues = '';
        let values = '';
        let convertedItemBuild = [];
        for(let i = 0; i < itemBuild.length - hasItems; i++){  
            if(j != i){
                keyValues += `${itemBuild[i][0]}`;
                convertedItemBuild.push(itemBuild[i][1]);
            }
            values += `$${i+1}`;
            if(i+1 + hasItems < itemBuild.length) {
                keyValues += `, `;
                values += `, `;
            }
        }
        
        let items = [];
        for(let i = 0; i < itemBuild.length; i++){
            if(itemBuild[i][0] == 'items'){
                items = itemBuild[i][1].split(',');
            }
        }

        let text = `INSERT INTO itembuilds(${keyValues}) VALUES (${values}) RETURNING *`;
        db.query(text, convertedItemBuild)
            .then((res)=>{
                result(res.rows);
                items.forEach(itemId => {
                    this.InsertItemInBuild(undefined,error,itemId, res.rows[0]['itembuilds_id']);
                });
            })
            .catch((err) => {error(err.stack)});
    }

    UpdateItemBuild(result,error,itembuild){
        let values = '';
        for(let i = 1; i < itembuild.length; i++){
            values += `${itembuild[i][0]} = $${i+1}`;
            if(i+1 < itembuild.length) values += `, `;
        }
        let convertedItemBuild = [itembuild[0]];
        for(let i = 1; i < itembuild.length; i++){
            convertedItemBuild[i] = itembuild[i][1];
        }
        let text = `UPDATE itembuilds SET ${values} WHERE itembuilds_id = $1 RETURNING *`;
        db.query(text,convertedItemBuild)
            .then((res)=>{result(res.rows)})
            .catch((err) => {error(err.stack)});
    }

    DeleteItemBuild(result,error,itemBuildId){
        let text = `DELETE FROM itembuilds WHERE itembuilds_id = $1`;
        db.query(text,[itemBuildId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)});
    }

    //////////////////////////////////// ITEMBUILD_LINKS /////////////////////////////////////////
    GetItemsInBuild(result,error,itemBuildId){
        let text = `SELECT item_id, item as "    item    ", amount 
                    FROM itembuild_links
                    INNER JOIN items
                    ON item_id = items_id
                    WHERE itembuild_id = $1`;
        db.query(text, [itemBuildId])
        .then( res => {result(res.rows)})
        .catch( err => {error(err.stack)});
    }
    
    InsertItemInBuild(result,error,itemId,itemBuildId){
        let text = `call addItemToItemBuild($1,$2)`;
        db.query(text, [itemBuildId,itemId])
            .then(res => { 
                if(result != undefined) result();
            })
            .catch(err => {error(err.stack)});
    }

    RemoveItemFromBuild(result,error,itemId,itemBuildId){
        let text = `call removeItemFromItemBuild($1,$2)`;
        db.query(text, [itemBuildId,itemId])
            .then(res => { 
                if(result != undefined) result();
            })
            .catch(err => {error(err.stack)});
    }

    GenerateItemBuilds(result,error,amount){
        let text = `call add_random_itembuilds($1)`;
        db.query(text,[amount])
            .then(res => { 
                result();
            })
            .catch(err => {error(err.stack)});
    }

    /////////////////////////////// queries //////////////////////////////////

    query1(result,error,values){
        let text = `SELECT hero as "     hero     ", item as "     item     ", winrate, patch as " patch  " FROM itembuilds
                    INNER JOIN heroes  
                    ON hero_id = heroes_id
                    INNER JOIN items
                    ON items_id = $2
                    WHERE itembuilds.winrate > $4
                        and hero_id = $1
                        and EXISTS (
                            select 1 from itembuild_links where 
                            item_id = $2
                            and
                            amount = $3
                        )
                    ORDER BY winrate DESC;`
        db.query(text,values)
        .then(res => { 
            result(res.rows);
        })
        .catch(err => {error(err.stack)});
    }

    query2(result,error,values){
        let text = `SELECT items_id,item as "     item     ",price,damage,stats_str,stats_agile,stats_int,itembuild_id, amount
                    FROM items
                    JOIN itembuild_links
                    ON items_id = item_id
                        AND amount = $5
                    WHERE price BETWEEN $1 AND $2 
                        AND damage BETWEEN $3 AND $4
                    ORDER BY price DESC;`
        db.query(text,values)
        .then(res => {result(res.rows);})
        .catch(err => {error(err.stack)});
    }

    query3(result,error,values){
        let text = `SELECT itembuilds_id, hero as "    hero    ", winrate FROM itembuilds
        JOIN heroes
        ON heroes_id = hero_id
        WHERE hero_id = $1
        AND patch = $2
        AND winrate > $3
        ORDER BY winrate DESC;`
        db.query(text,values)
        .then(res => {result(res.rows);})
        .catch(err => {error(err.stack)});
    }

    
}

module.exports = DbCommand;
