const greeting: string = 'Hello world';

const number: number[] = [1, 2, 3, 4, 5, 6];

const sayHello = function(name: string){
    return `Hello ${name} !`;
}

const add = function(a:number, b:number) { 
    return a+b
}

export {add, sayHello};