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
    
    DeleteItem(itemId){
        let text = `DELETE FROM items WHERE item_id = $1`;
        db.query(text,[itemId])
            .then((res)=>{result(res.rows)},(err)=>{error(err.stack)})
    }

    ////////////////////////////////////// ITEMBUILDS /////////////////////////////////////////////////////
    async InsertItemBuild(itemBuild){
        let keyValues = '';
        let values = '';
        for(let i = 0; i < itemBuild.length; i++){
            keyValues += `${itemBuild[i][0]}`;
            values += `$${i+1}`
            if(i+1 < itemBuild.length) {
                keyValues += `, `;
                values += `, `
            }
        }

        let convertedItemBulid = [];
        itemBuild.forEach( h => convertedItemBuild.push(h[1]))

        let text = `INSERT INTO itembuilds(${keyValues}) VALUES (${values}) RETURNING *`;
        db.query(text, convertedItemBuild)
            .then((res)=>{
                result(res.rows);
                itemBuild.pop().forEach(itemId => {
                    this.InsertItemBulidInBuild(itemId, res.rows[0][itembuilds]);
                });
            })
            .catch((err) => {error(err.stack)});
    }

    ////////////////////////////////////// ITEMBUILD_LINKS ////////////////////////////////////////////////
    
    async InsertItemInBuild(itemId, itemBuildId){
        let text = `INSERT INTO itembuild_links(itembuild_id, item_id) VALUES ($1,$2) RETURNING *`;
        
    }

}

module.exports = DbCommand;
