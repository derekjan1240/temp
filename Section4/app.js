const yargs = require('yargs');

// Customize version
yargs.version('1.0.1');

// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title:{
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body:{
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv)=> {
        console.log('Adding a new note!');
        console.log(`Title: ${argv.title}, Body: ${argv.body}`);
    }
});

// Create remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a new note',
    handler: ()=> {
        console.log('Remove a note!');
    }
});

// Create list command
yargs.command({
    command: 'list',
    describe: 'List a new note',
    handler: ()=> {
        console.log('List all note!');
    }
});

// Create read command
yargs.command({
    command: 'read',
    describe: 'Read a new note',
    handler: ()=> {
        console.log('Read a note!');
    }
});

yargs.parse();