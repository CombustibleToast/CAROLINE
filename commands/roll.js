const { SlashCommandBuilder, resolveColor, TextInputStyle } = require("discord.js");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll some dice!')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Put the amount and type of dice you want to roll here!')
                .setRequired(true)),

    //the funciton to be run
    async execute(interaction){
        await interaction.deferReply();
        const reply = await standardRoll(interaction.options.getString('query'));
        console.log(`Function returned ${reply}`);
        await interaction.followUp(reply);
    }
}

async function standardRoll(query){
    console.log(`query: ${query}`);
    //query is a string
    //whitespace removal
    query.replace(/\s/g,'').trim();
    
    //tokenize the string and keep the operators which act as the delimiters
    //https://medium.com/@shemar.gordon32/how-to-split-and-keep-the-delimiter-s-d433fb697c65 
    const tokens = query.split(/(?=[+\-*/%\(\)])|(?<=[+\-*/%\(\)])/g); //(, ), and - need to be escaped
    console.log(tokens);

    //compute the request
    const result = roll(tokens);
    
    //done with computation, compile the response
    return compileResponse(query, result.rolls, result.total);
}

function roll(tokens){
    //rolls storage for reply 
    const rollObjects = [];

    //create stacks
    const values = [];
    const operators = [];

    //read all of the tokens
    while(tokens.length > 0){
        //reading the first token in the array requires a shift
        const curToken = tokens.shift();
        console.log(`cur token ${curToken}`);

        //if the token is a value (const or dice term), push it onto the value stack
        if(/\d/g.test(curToken)){
            let curValue;
            //if the term is a dice value
            if(/d/.test(curToken))
                curValue = collapseDiceValue(curToken);
            //else the term is a number
            else
                curValue = {value: parseInt(curToken), term: curToken, rolled: false};
            values.push(curValue);
            if(curValue.rolled == true)
                rollObjects.push(curValue);
        }

        //if the token is a left parenthesis, just push it
        if(curToken == "(")
            operators.push(curToken);
        
        //if the token is a right parenthesis, resolve until top operator is a left parenthesis, then discard the top operator
        if(curToken == ")"){
            while(operators[operators.length-1] != "(")
                values.push(performOperation(operators.pop(), values.pop(), values.pop()));
            operators.pop();
        }
        
        //if the token is an operator...
        if(/[+\-*/%]/.test(curToken)){
            //...and while the op stack is not empty and the top item has a greater precedence, resolve
            while(operators.length > 0 && comparePrecedence(operators[operators.length-1], curToken))
                values.push(performOperation(operators.pop(), values.pop(), values.pop()));
            //then push the current operator
            operators.push(curToken);
        }
    }

    //then complete all of the remaining operations
    while(operators.length > 0)
        values.push(performOperation(operators.pop(), values.pop(), values.pop()));
    
    return {rolls: rollObjects, total: values.pop().value};
}

function compileResponse(query, objs, finalVal){
    let notifyStats = false;
    re = `**${finalVal}**\n${query}:\`\`\`diff\n`;
    for(const term of objs){
        re += `+ ${term.term.trim()}: `;
        for(const roll of term.rolls)
            re += `${roll} `
        re += "\n";
    }
    return re + "```";
}

function collapseDiceValue(term){
    if(!/\d*d\d+((dl|kh)\d+|)/.test(term))
        throw `Invalid dice term ${term}`;
    
    //parse the term into values
    const dice = /\d*d\d+/.exec(term)[0];
    const numDice = isNaN(parseInt(dice.substring(0, dice.indexOf("d")))) ? 1 : parseInt(dice.substring(0, dice.indexOf("d")));
    const dieType = parseInt(dice.substring(dice.indexOf("d")+1));
    let keep = /(k|d)(h|l)\d+/.exec(term);
    keep = keep == null ? undefined : keep[0];
    const keepType = keep == undefined ? undefined : /(k|d)(h|l)/.exec(keep)[0];
    const numKeep = keep == undefined ? undefined : parseInt(/\d+/.exec(keep)[0]);
    console.log(`parsed ${numDice}d${dieType} ${keepType}${numKeep}`);

    //roll and store results
    const rolls = [];
    for(let i = 0; i < numDice; i++)
        rolls.push(Math.ceil(Math.random() * dieType));
    
    //find out which rols to keep
    let keptRolls = structuredClone(rolls);
    keptRolls.sort((a,b) => {
        return b-a;
    });
    console.log(`sorted rolls: ${keptRolls}`);
    if(keep != undefined){
        switch(keepType){
            case "": break;
            case "kh": keptRolls = keptRolls.slice(0, numKeep); break; //collect the topmost elements 
            case "kl": keptRolls = keptRolls.slice(numDice - numKeep); break; //collect the bottom most numdice-numkeep elements
            case "dh": keptRolls = keptRolls.slice(numKeep); break; //collect the bottommost elements
            case "dl": keptRolls = keptRolls.slice(0, numDice - numKeep); break; //collect the topmost numdice-numkeep elements
            default : throw `Error processing dice keeping with term ${term}`;
        }
    }
    
    //return object containing the data
    return {
        value : keptRolls.reduce((sum, a) => sum + a, 0),
        rolls : rolls,
        keptRolls : keptRolls,
        term : term,
        rolled : true
    }
}

function performOperation(op, a, b){
    //op is a string of the operation to be performed
    //a and b are numbers to be operated upon in the order b op a
    //they're reversed because of the way they're popped from the stack lol idk

    console.log(`performing operation ${a.value} ${op} ${b.value}`);
    let result;
    switch(op){
        case "+": result = {value: b.value + a.value, rolled: false}; break;
        case "-": result = {value: b.value - a.value, rolled: false}; break;
        case "*": result = {value: b.value * a.value, rolled: false}; break;
        case "/": result = {value: b.value / a.value, rolled: false}; break;
        case "%": result = {value: b.value % a.value, rolled: false}; break;
        default: throw `Invalid operator ${op}`;
    }
    console.log(`result of operation: ${result.value}`);
    return result;
}

function comparePrecedence(op1, op2){
    //returns true if op1 has a higher precedence than op2, false if equal
    const opMap = new Map();
    opMap.set("+", 1);
    opMap.set("-", 1);
    opMap.set("*", 2);
    opMap.set("/", 2);
    opMap.set("%", 2);
    return opMap.get(op1) > opMap.get(op2);
}