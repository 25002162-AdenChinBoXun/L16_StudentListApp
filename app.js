const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RP738964$',
  database: 'c237_studentlistapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up view engine 
app.set('view engine', 'ejs');

// Enable static files 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 

// ------------------------------------------------
// ROUTE 1: Index Page (List all students)
// ------------------------------------------------
app.get('/', (req, res) => {
  // FIXED: Changed 'students' to 'student' to match your database
  const sql = 'SELECT * FROM student';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error Retrieving students');
    }
    res.render('index', { students: results });
  });
});

// ------------------------------------------------
// ROUTE 2: Individual Student Details Page
// ------------------------------------------------
app.get('/student/:id', (req, res) => {
  const studentId = req.params.id;
  // FIXED: Changed 'students' to 'student'
  const sql = 'SELECT * FROM student WHERE studentId = ?';
  
  connection.query(sql, [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error Retrieving student by ID');
    }
    
    if (results.length > 0) {
      // FIXED: Render 'students' to match your file name students.ejs
      res.render('students', { student: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

// ------------------------------------------------
// ROUTE 3: Add a New Student (Form & Submit)
// ------------------------------------------------
app.get('/addStudent', (req, res) => {
  // FIXED: Render 'addStudents' to match your file name addStudents.ejs
  res.render('addStudents');
});

app.post('/addStudent', (req, res) => {
  const { name, dob, contact, image } = req.body;
  // FIXED: Changed 'students' to 'student'
  const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';

  connection.query(sql, [name, dob, contact, image], (error, results) => {
    if (error) {
      console.error("Error adding student:", error);
      res.send('Error adding student');
    } else {
      res.redirect('/');
    }
  });
});
// ------------------------------------------------
// ROUTE 4: Edit Student Information
// ------------------------------------------------
app.get('/editStudent/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'SELECT * FROM student WHERE studentId = ?';
  
  connection.query(sql, [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error retrieving student by ID');
    }
    
    if (results.length > 0) {
      res.render('editStudents', { student: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

app.post('/editStudent/:id', (req, res) => {
  const studentId = req.params.id;
  const { name, dob, contact, image } = req.body;
  const sql = 'UPDATE student SET name = ?, dob = ?, contact = ?, image = ? WHERE studentId = ?';

  connection.query(sql, [name, dob, contact, image, studentId], (error, results) => {
    if (error) {
      console.error("Error updating student:", error);
      res.send('Error updating student');
    } else {
      res.redirect('/');
    }
  });
});

// ------------------------------------------------
// ROUTE 5: Delete Student
// ------------------------------------------------
app.get('/deleteStudent/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'DELETE FROM student WHERE studentId = ?';
  connection.query(sql, [studentId], (error, results) => {
    if (error) {
      console.error("Error deleting student:", error);
      res.send('Error deleting student');
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));