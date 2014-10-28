var ToDos = {

    settings: {
        allTasks: '#task_list',
        currentTasks: '#current',
        completedTasks: '#completed',
        addForm: '#add_task',
        addTaskInput: 'input[name="task_text"]',
        deleteBtn: 'delete',
    },

    init: function(data){
        s = this.settings;
        this.taskData = data;

        $(s.addTaskInput).focus();
        this.bindUIActions();
        this.update();
    },

    bindUIActions: function(){
        // Add task form
        $(s.addForm).submit(this.addTask);

        // Task functions
        $(s.allTasks)
            .on('click', '.task-text', ToDos.editTask)
            .on('click', '.delete', ToDos.deleteTask);
        $(s.currentTasks)
            .on('click', '.check', ToDos.completeTask);
        $(s.completedTasks)
            .on('click', '.check', ToDos.unCompleteTask);
    },

    generateElement: function(task){
        var destinations = {
                'current': s.currentTasks,
                'complete': s.completedTasks,
            }, destination = destinations[task.status]

        wrapper = $('<div />', {
            "class": "task",
            "id": task.id
        }).appendTo($(destination));

        checkbox = $('<div />', {
            'class': 'check',
        }).appendTo(wrapper);

        deleteIcon = $('<div />', {
            'class': s.deleteBtn,
        }).appendTo(wrapper);

        text = $('<div />', {
            'class': 'task-text',
            "html": task.text
        }).appendTo(wrapper);

    },

    update: function(){
        $(s.currentTasks).empty();
        $(s.completedTasks).empty();

        $.each(ToDos.taskData, function(index, taskObj){
            ToDos.generateElement(taskObj);
        });
    },

    addTask: function(event){
        event.preventDefault();

        var inputs = $(s.addForm + ' :input'),
            task = new Object(),
            id = new Date().getTime();

        task.id = id;
        task.text = inputs[0].value;
        task.status = 'current';

        ToDos.generateElement(task);
        $(s.addForm)[0].reset();  // Reset task input field

        ToDos.taskData[id] = task;
        ToDos.save();
    },

    completeTask: function(){
        var id = $(this).parent().attr('id'),
            task = ToDos.taskData[id];

        task.status = 'complete';
        ToDos.save();
        ToDos.update();
    },

    unCompleteTask: function(){
        var id = $(this).parent().attr('id'),
            task = ToDos.taskData[id];

        task.status = 'current';
        ToDos.save();
        ToDos.update();
    },

    deleteTask: function(){
        var id = $(this).parent().attr('id');   
        delete ToDos.taskData[id];
        ToDos.save();
        ToDos.update();
    },

    editTask: function(){
        var id = $(this).parent().attr('id'),
            text = $(this).html(),
            parent = $(this).parent(),
            editInput = $('<input />', {
                type: 'text',
                name: 'new-text',
                value: text
            });
        parent.append(editInput);
        editInput.focus();
        $(this).remove();

        parent.keypress(function(e){
            if (e.which == 13){  // Listen for enter
                ToDos.taskData[id].text = editInput.val();
                ToDos.save();
                ToDos.update();
            }
        })

    },

    save: function(){
        localStorage.setItem('taskData', JSON.stringify(ToDos.taskData))
    },

}

$(document).ready(function(){
    var data = JSON.parse(localStorage.getItem('taskData')) || {}
    ToDos.init(data);
});
