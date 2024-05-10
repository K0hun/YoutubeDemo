const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Youtube'
});

connection.query(
    'SELECT * FROM `users`; ',
    function(err, results, fields){
        console.log(results);
        console.log(fields);
    }
);