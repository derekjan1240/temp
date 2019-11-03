const calculateTip = (total, tipPercent=0.25) =>{
    const tip = total * tipPercent;
    return total + tip;
}

const add = (a, b) =>{
    return new Promise((resolove, reject)=>{
        setTimeout(()=>{
            if(a<0||b<0){
                return reject('Numbers must be non-negative!');
            }
            resolove(a+b);
        }, 2000)
    });
}

module.exports = {
    calculateTip,
    add
}