class Villager {

    constructor(name, profession) {
        this.name = name;
        this.profession = profession;

        this.holding = 0;
    }

    toString() {
        return `${this.name} (${this.profession} - ${this.holding} ${this.profession.getResource})`;
    }

    getResource() {
        if (this.holding < this.profession.hold) {
            this.holding++;
            return this.holding;
        } else {
            return this.holding;
        }
    }
}

const angelo = new Villager("Angelo", Profession.Farmer);
console.log(angelo);
angelo.getResource();
console.log(angelo);