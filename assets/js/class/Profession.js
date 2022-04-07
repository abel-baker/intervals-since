class Profession {

    constructor(config) {
        this.name = config.class;
        this.type = config.type;
        this.resource = config.resource;
        this.hold = config.hold;
        this.to_market = config.to_market;
        this.daily_food = config.daily_food;
    }

    static Farmer = new Profession(professionData.farmer);
}

console.log(Profession.Farmer);