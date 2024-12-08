// 1. 

function getFirstWord(a: string): number {
	return (a.split(/ +/)[0] ?? "").length;
}

// 2. 

type User = {
	name:string,
	surname:string;
}

function getUserNamings(a: User) {
  return { 
		fullname: a.name + " " + a.surname, 
		initials: a.name[0] + "." + a.surname[0] 
	};
}

// 3. 

type ProdObject = {
    name?: string;
}

type InputObjectA = {
    products?: ProdObject[] 
}


// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining>
function getAllProductNames(a: InputObjectA) {
  return a?.products?.map(prod => prod?.name) || [];
}

// 4.1
type InputObjectA2 = {
    name: () => string,
    cuteness?: number,
    coolness?: number;
}


// easy way is using 'as' keyword
// hard way is ?...
function hey1(a: InputObjectA2) : string{
    return "hey! i'm " + a.name();
}
hey1({name: () => "roman", cuteness: 100})
hey1({name: () => "vasyl", coolness: 100})

// 4.1
type InputObjectA3 = {
    name: () => string,
    cuteness?: number,
    coolness?: number;
}


// easy way is using 'as' keyword
// hard way is ?...
function hey2(a: InputObjectA3) : string{
    return "hey! i'm " + a.name();
}
hey2({name: () => "roman", cuteness: 100})
hey2({name: () => "vasyl", coolness: 100})


class AbstractPet{
    constructor(protected n:string){};

    public name():string{
        return this.n;
    }
}


class Cat extends AbstractPet{
    constructor(override n: string, someValue: boolean){
        super(n);  
          
    }
}

class Dog extends AbstractPet{
    constructor(override n: string, someValue: number){
        super(n);  
    }
}


function hey3(abstractPet: AbstractPet) :string {
    return "hey! i'm " + abstractPet.name();
}
let a = new Cat("snizhok", true)
let b = new Dog("sirko", 333)

hey3(a)
hey3(b)

type Pet = {
    name: ()=> string,
    type: string,
    cuteness?: number,
    coolness?: number;
}

// // 4.3

function hey(a: Pet) {
    return "hey! i'm " + a.name()
		 + (a.type === "cat" ? ("cuteness: "+a.cuteness) : ("coolness: "+a.coolness))
}
hey({name: () => "snizhok", type: "cat", cuteness: 100})
hey({name: () => "sirko", type: "dog", coolness: 100})


type Rec = any[] | Record<string, any>;


// 5.

// google for Record type
function stringEntries(a: Rec): string[]{
   return Array.isArray(a) ? a : Object.keys(a)
}



// // 6.
// // ....can be hard, don't worry and SKIP if you do not know how to do it

async function world(a: number): Promise<string> {
    return "*".repeat(a)
}
const hello = async (): Promise<string> => {
   return await world(10)
}
hello().then(r => console.log(r)).catch(e => console.log("fail"))