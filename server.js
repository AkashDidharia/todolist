//DEPENDENCY IMPORTS
const express  = require('express')
const {MongoClient} = require('mongodb')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const serverApp = express();
const bodyParser = require("body-parser");
require("dotenv").config();


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

    
// Register user API
serverApp.post("/register", async (req, res) => {
    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
    //   const oldUser  = await todolistDB.collection('users').find({ email })
    //   console.log(oldUser);
  
    //   if (oldUser.length != 0) {
    //     return res.status(409).send("User Already Exist. Please Login");
    //   }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await todolistDB.collection('users').insertOne({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
 
      // return new user
      res.status(200).json({token});
    } catch (err) {
      console.log('there is some issue');
    }

  });


});


serverApp.listen(8000, ()=>{
    console.log('listening 8000')
});

module.exports = serverApp;