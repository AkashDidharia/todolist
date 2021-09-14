const addButton = document.querySelector('#add-button')
const updateButton = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')

addButton.addEventListener('click', () => {
    //hit the add end point
    console.log('add event Trriggered');
    const newtaskPayload ={
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            taskTitle : document.querySelector('#add-taskTitle').value,
            taskDesc : document.querySelector('#add-taskDesc').value,
            completed : false
        })
    }
    fetch('/addTask',newtaskPayload)
    .then(res=>{
        if(res.ok) return res
    })
    .then(response => {
        window.location.reload();
    })
})

updateButton.addEventListener('click', () => {
    //hit the add end point
    console.log('update event Trriggered');
    const payload ={
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            taskTitle : document.querySelector('#update-taskTitle').value,
            newtaskTitle : document.querySelector('#update-newtaskTitle').value,
            newtaskDesc : document.querySelector('#update-newtaskDesc').value,
        })
    }
    fetch('/updateTask',payload)
    .then(res=>{
        if(res.ok) return res
    })
    .then(response => {
        window.location.reload();
    })
})

deleteButton.addEventListener("click", () => {
    //hit the delete end point    
    console.log('delete event Trriggered');
    const deletetaskPayload ={
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            taskTitle : document.querySelector('#delete-taskTitle').value,
        })
    }
    fetch('/deleteTask',deletetaskPayload)
    .then(res=>{
        if(res.ok) return res.json()
    })
    .then(response => {
        if(response === 'delete op failed')
        console.log('delete op failed');

    })
    .catch(error => console.error(error));
});