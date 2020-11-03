class Hero{
    constructor(id,hero,damage,stats_str,stats_agile,stats_int){
        this.id = id;
        this.hero = hero;
        this.damage = damage;
        this.stats_str = stats_str;
        this.stats_agile = stats_agile;
        this.stats_int = stats_int;
    }

    ToArray(){
        return [this.hero,this.damage,this.stats_str,this.stats_agile,this.stats_int,this.id];
    }
}
module.exports = Hero;