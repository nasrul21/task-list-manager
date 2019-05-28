const inquirer = require('inquirer');
const taskStore = require('./taskStoreNode');

// action key
const ACTION = {
    DONE: "is done",
    EDIT: "edit",
    DELETE: "delete"
}

async function initialize() {
    console.log('popup initialize all offline data...');
    taskStore.setName("efishery_tasks");
    await taskStore.initialize();
    console.log('popup done');
}

initialize().then(function() {
    showTasks();
});

// parse selected tasks
function getResult(result) {
    const [_, obj] = result.split("|");
    return JSON.parse(obj);
}

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
            },
            {
                type: 'list',
                name: 'action',
                message: function(a) { return `Action for tasks '${getResult(a.tasks).text}'`; },
                choices: function(a) { 
                    // if tasks already done, disable 'is done menu'
                    const isDone = getResult(a.tasks).done;
                    return Object.values(ACTION).filter(function(item) { return isDone ? item != ACTION.DONE : item })
                },
            }
        ]).then(answers => {
            const task = getResult(answers.tasks);
            switch (answers.action) {
                case ACTION.DONE: {
                    console.log("DONE");
                    return updateTaskDone(task);
                }
                default:
                    console.log("DEFAULT");
                break;
            }
            process.exit();
        });
}

// task done action
async function updateTaskDone(task) {
    await taskStore.editItem(task._id, {
        ...task,
        done: !task.done
    });
    console.log(`SUCCESS: Tasks '${task.text}' done!`);
}