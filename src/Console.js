const inquirer = require('inquirer');
const taskStore = require('./taskStoreNode');

async function initialize() {
    console.log('popup initialize all offline data...');
    taskStore.setName("efishery_tasks");
    await taskStore.initialize();
    console.log('popup done');
}

initialize().then(function() {
    showTasks();
});

// Show All Task
function showTasks() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'tasks',
                message: 'Select task',
                choices: [...taskStore.data.map(function(item, index) { 
                    const { _id, text, done} = item
                    return `${index + 1}. ${taskStore.checkIsUploaded(item) ? "(on )" : "(off)"} | ` + JSON.stringify({ _id, text, done }) 
                }), new inquirer.Separator()]
            }
        ]).then(answers => {
            console.log(getResult(answers.tasks));
            process.exit();
        });
}

function getResult(result) {
    const [_, obj] = result.split("|");
    return JSON.parse(obj);
}