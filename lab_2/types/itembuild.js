class ItemBuild{
    constructor(id,hero_id,patch,winrate,items_id){
        this.id = id;
        this.hero_id = hero_id;
        this.patch = patch;
        this.winrate = winrate;
        this.items_id = items_id;
    }

    ToArray(){
        return [this.id, this.hero_id, this.patch, this.winrate, this.items_id];
    }
}
module.exports = ItemBuild;