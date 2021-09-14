//DEPENDENCY IMPORTS
const express  = require('express')
const {MongoClient} = require('mongodb')
const serverApp = express();
const bodyParser = require("body-parser");

//MIDDLE WARE CONFIGS
serverApp.use(bodyParser.json());
serverApp.use(bodyParser.urlencoded({ extended: false }));
serverApp.set('view enginer', 'ejs')
serverApp.use(express.static('public'))

//\\-----ROUTES------//\\

//MONGO CONNECT
const connectionString ='mongodb+srv://dbAdmin:dbPassword@cluster0.t5ziz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
MongoClient.connect(connectionString, (err,client) => {
    //ERROR HANDLING
    if(err){
        return console.error(err)
    }
    //RETRIEVE THE DB
    const todolistDB = client.db('todolist-database')
    const tasksCollection = todolistDB.collection('tasks');
    console.log('Got Collection');

        //GET
    serverApp.get('/', (req, res) => {
        todolistDB.collection('tasks').find({}).toArray()
        .then( tasks=>{res.render('index.ejs', {tasks : tasks})
         })
         .catch(err =>console.error(err));
    })

    serverApp.get('/completedTasks', (req, res) => {
        todolistDB.collection('tasks').find({}).toArray()
        .then( tasks=>{res.render('completedTasks.ejs', {tasks:tasks})
         })
         .catch(err =>console.error(err));
    })

    //CREATE user information
        serverApp.post('/addTask',(req,res) => {
            //apply promise on this
            debugger;
            tasksCollection.insertOne(req.body)
            .then(result => {res.redirect('/')})
            .catch(error => console.error(error));
          
        });

    //UPDATE
    serverApp.put('/updateTask', (req, res)=>{
        console.log('put called');
        tasksCollection.findOneAndUpdate(
        {
            taskTitle: req.body.taskTitle
        }, 
        {
            $set: {
                taskTitle: req.body.newtaskTitle,
                taskDesc: req.body.newtaskDesc
            }
        },
        {
            upsert : true
        }
        )
        .then(result => res.send("updated the info") )
        .catch(error=> console.error(error));
    });

    //DELETE
    serverApp.delete('/deleteTask', (req, res)=>{
        tasksCollection.findOneAndDelete(
        {
            taskTitle: req.body.taskTitle
        }
        )
        .then(result => {
            if(result.deletedCount === 0){
                return res.send('Delete operation failed')
            }
            else{
                return res.send('Task deleted')
            }
        })
        .catch(error=> console.error(error));
    })
});
serverApp.listen(8000, ()=>{
    debugger;
    console.log('listening 8000')
});