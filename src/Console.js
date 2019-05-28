const pouchdb = require('pouchdb');
const inquirer = require('inquirer');

const db = new pouchdb("http://admin:iniadmin@13.250.43.79:5984/efishery_tasks");
var tasks = [];

// Show All Task
db.allDocs({include_docs: true}).then(function(result) {
    tasks = result.rows.reduce(function(res, item) {
        if(item.doc.deletedAt == null) {
            res.push(item.doc);
        }
        return res;
    }, []);
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'tasks',
            message: 'Select task',
            choices: tasks.map(function(item) { 
                const { _id, text, done} = item
                return JSON.stringify({ _id, text, done }) 
            })
        }
    ]).then(answers => {
        console.log(answers.tasks);
    });
    
}, function(error) {
    console.log(error);
});