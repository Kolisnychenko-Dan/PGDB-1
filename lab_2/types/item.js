class Item{
    constructor(id,item,damage,stats_str,stats_agile,stats_int){
        this.id = id;
        this.item = item;
        this.damage = damage;
        this.stats_str = stats_str;
        this.stats_agile = stats_agile;
        this.stats_int = stats_int;
    }

    ToArray(){
        return [this.item,this.damage,this.stats_str,this.stats_agile,this.stats_int,this.id];
    }
}
module.exports = Item;