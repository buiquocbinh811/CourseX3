import express from 'express';
import { v4 as uuidv4 } from 'uuid';

let students = [
  {
    id: '1',
    name: 'Alice Smith',
    gpa: 3.85,
    dob: '2004-03-15', // YYYY-MM-DD format
    address: '123 Maple Street, Springfield, IL 62704',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    gpa: 3.21,
    dob: '2003-07-22',
    address: '456 Oak Avenue, Shelbyville, IL 62565',
  },
  {
    id: '3',
    name: 'Charlie Williams',
    gpa: 2.95,
    dob: '2004-11-01',
    address: '789 Pine Lane, Capital City, IL 62701',
  },
  {
    id: '4',
    name: 'Diana Brown',
    gpa: 4.0,
    dob: '2003-01-30',
    address: '101 Cherry Blvd, Ogdenville, IL 60512',
  },
  {
    id: '5',
    name: 'Ethan Jones',
    gpa: 3.55,
    dob: '2004-05-18',
    address: '222 Elm Drive, North Haverbrook, IL 61350',
  },
  {
    id: '6',
    name: 'Fiona Garcia',
    gpa: 3.7,
    dob: '2002-09-05',
    address: '333 Birch Court, Brockway, IL 61810',
  },
  {
    id: '7',
    name: 'George Miller',
    gpa: 2.5,
    dob: '2003-12-12',
    address: '444 Cedar Way, Springfield Heights, IL 62711',
  },
  {
    id: '8',
    name: 'Hannah Davis',
    gpa: 3.92,
    dob: '2004-08-25',
    address: '555 Willow Pass, Guidopolis, IL 60606',
  },
  {
    id: '9',
    name: 'Ian Rodriguez',
    gpa: 3.1,
    dob: '2002-06-10',
    address: '666 Aspen Trail, Waverly Hills, IL 62690',
  },
  {
    id: '10',
    name: 'Julia Martinez',
    gpa: 3.65,
    dob: '2003-04-02',
    address: '777 Redwood Place, Cypress Creek, IL 60010',
  },
];

const app = express();
const PORT = 8080;

// Middleware to passe JSON request body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to our Server');
});

/**
 * API Get all students
 */
app.get('/students?', (req, res) => {
  const data = students;

  res.json({
    data,
    pagination: {
      totalItems: data.length,
    },
  });
});

/**
 * Get one student
 */
app.get('/students/:id', (req, res) => {
  const { id } = req.params;

  const existingStudent = students.find((student) => student.id === id);

  if (existingStudent) {
    res.json(existingStudent);
  } else {
    res.status(404).json({
      message: 'Student not found',
    });
  }
});

// CREATE: new student
app.post('/students/', (req, res) => {
  const { name, gpa, dob, address } = req.body;

  // 1.  Validation
  if (!name || !gpa || !dob || !address) {
    return res.status(400).json({
      message: 'Missing required fields: name, dob, gpa, address',
    });
  }

  // 2. Logic create new student
  const newStudent = {
    name,
    gpa,
    dob,
    address,
    id: uuidv4(),
  };

  students.push(newStudent);

  res.status(201).json({
    message: 'Student is created successfully',
  });
});

// UPDATE a existing student
app.put('/students/:id', (req, res) => {
  const { name, gpa, dob, address } = req.body;
  const { id: studentId } = req.params;

  // 1.  Validation
  if (!name || !gpa || !dob || !address) {
    return res.status(400).json({
      message: 'Missing required fields: name, dob, gpa, address',
    });
  }

  const existingStudentIndex = students.findIndex(
    (student) => student.id === studentId
  );

  if (existingStudentIndex !== -1) {
    const updatedStudent = {
      id: students[existingStudentIndex].id,
      name,
      gpa,
      dob,
      address,
    };

    students[existingStudentIndex] = updatedStudent;
    res.json(updatedStudent);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Remove a student
app.delete('/students/:id', (req, res) => {
  const { id: studentId } = req.params;

  const existingStudentIndex = students.findIndex(
    (student) => student.id === studentId
  );

  if (existingStudentIndex !== -1) {
    students = students.filter((student) => student.id !== studentId);
    res.json({
      data: students,
      pagination: students.length,
    });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

/*
    RESTFul API

    API: Application Programming Interface

    Rest: Representational State Transfer

    => RESTFul API: base on HTTP 

    BaseURL: http://localhost:8080/
    Method, Endpoints
        + Get (Read)
            * endpoint: http://localhost:8080/students

        + Post (Create)
            * endpoint: http://localhost:8080/students
            * body: data transfer to server
 
        + Put (Update)
            * endpoint: http://localhost:8080/students/[id] => params: id
            * body: data transfer to server

        + Delete (Delete)
            * endpoint: http://localhost:8080/students/[id]

    => CRUD students
*/
