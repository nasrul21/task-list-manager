const inquirer = require('inquirer');
const taskStore = require('./taskStoreNode');

var tasks = [];

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
        tasks = taskStore.data.map(function(item, index) { 
            const { _id, text, done} = item
            return `${index + 1}. ${taskStore.checkIsUploaded(item) ? "(on )" : "(off)"} | ` + JSON.stringify({ _id, text, done }) 
        });
        inquirer.prompt([
            {
                type: 'list',
                name: 'tasks',
                message: 'Select task',
                choices: [...tasks, new inquirer.Separator()]
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
            },
            {
                type: 'input',
                name: 'edit',
                message: function(a) { return `edit tasks '${getResult(a.tasks).text}':`; },
                when: function(a) { 
                    return a.action == ACTION.EDIT;
                },
                validate: function(input) {
                    return input.trim() !== "";
                }
            }
        ]).then(answers => {
            const task = getResult(answers.tasks);
            switch (answers.action) {
                case ACTION.DONE: {
                    console.log("ACTION: DONE");
                    return updateTaskDone(task).then(showLastMenu);
                }
                case ACTION.EDIT: {
                    console.log("ACTION: EDIT");
                    return editTask(task, answers.edit).then(showLastMenu);
                }
                case ACTION.DELETE: {
                    console.log("ACTION: DELETE");
                    return deleteTask(task._id).then(showLastMenu);
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

// edit task name
async function editTask(task, newText) {
    await taskStore.editItem(task._id, {
        ...task,
        text: newText,
    });
    console.log(`SUCCESS: Tasks '${newText}' updated!`);
}

// delete task
async function deleteTask(id) {
    await taskStore.deleteItem(id);
    console.log(`SUCCESS: Tasks with id '${id}' deleted!`);
}

function showLastMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'lastmenu',
            message: 'Action Completed',
            choices: ['Upload', 'Exit']
        },
    ]).then(answer => {
        if(answer.lastmenu == "Upload") {
            return uploadTask();
        } else {
            return process.exit();
        }
    });
}

async function uploadTask() {
    console.log('uploading...');
    try {
    await taskStore.upload();
        console.log('upload done');
        process.exit();
    } catch (err) {
        console.log('upload failed');
    }
}