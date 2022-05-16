
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('mydata.db', (err) => {
    if(err) {
        console.log('error creating database', err);
    }
    else{
        console.log('created database');
    }
})

// console.log(db.run(`CREATE TABLE Users(
//     id INT PRIMARY KEY,
//     email VARCHAR(255) NOT NULL
//     )`) );

console.log(db.run(`
    INSERT INTO Users(email)    
    VALUES(
        'abc'
    )
`));
console.log(db.run(`
    INSERT INTO Users(email)    
    VALUES(
        'dbc'
    )
`));

db.all('SELECT * FROM Users', (err, res) => {
    if(err){
        console.log(err);
    }
    else{
        console.log(res);
    }
})


// ref:
// db.run
// db.get -> gets single row from the query
// db.all -> gets all the results of the query