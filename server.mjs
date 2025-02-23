import express from "express"

// Creating an instance of express application
const myserverapp = express();//using Express.

// Middleware for parsing JSON data in POST requests
myserverapp.use(express.json()); // Middleware for parsing data in POST requests.

const PORT = 6900;

//Start server with PORT no.6900.
myserverapp.listen(PORT, () => {
    console.log(`MyServer listening on PORT:${PORT}`);
});

// In-memory data store using ARRAY
let users = [
    {
        id: "1",
        firstName: "Anshika",
        lastName: "Agarwal",
        hobby: "Teaching"
    },
    {
        id: "2",
        firstName: "John",
        lastName: "Man",
        hobby: "Spamming name in WorldWEB"
    },
    {
        id: "3",
        firstName: "Sourabh",
        lastName: "Saroj",
        hobby: "Reading"
    }

]

// Middleware to log request details
myserverapp.use((req, res, next) => {
    console.log(req.method);
    next();
},
    // Middleware to Status Code details
    (req, res, next) => {
        const codestatusJson = res.json;
        res.json = function (body) {
            console.log(`Status: ${res.statusCode}`);
            return codestatusJson.call(this, body);
        }
        next();
    }
);

// Validation middleware
const validateUser = (req, res, next) => {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: "Missing Required Fields" });
    }
    next();
};

//Fetch The list of all Users by method GET/users
myserverapp.get('/users', (req, res, next) => {
    if (users.length === 0) { // Check if the users array is empty
        console.log(`Route PATH Not Match`);
        return res.status(404).json({ error: "No users found" });
    }
    res.json(users); // Return the list of users if not empty
    next();
});


//Fetch details of a specific user by ID using method GET/users/id
myserverapp.get('/users/:id', (req, res, next) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ error: "User Not Found" });
    }
    next();
})

//Add a new user by POST /user
myserverapp.post('/user', validateUser, (req, res, next) => {
    const newUser = {
        id: (users.length + 1).toString(),
        ...req.body                 //getting same formaing data using spread oprater.
    };
    users.push(newUser);            //storing in IN-Memory Data Store created name using'Users'.
    res.status(201).json(newUser);
    next();
});

//Update details of an existing user by using PUT /user/:id.
myserverapp.put('/user/:id', (req, res, next) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        res.json(users[index]);
    } else {
        res.status(404).json({ error: "User not found" });
    }
    next();
});

//Delete a user by ID by DELETE /user/:id
myserverapp.delete('/user/:id', (req, res, next) => {
    const userid = users.find(u => u.id == req.params.id);
    if (!userid) {
        return res.status(404).json({ error: "User not found" });
    };
    const filterusers = users.filter((user) => user.id != req.params.id)
    res.json(filterusers);
    next();
});