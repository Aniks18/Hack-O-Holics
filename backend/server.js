const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://eklavyabro:rtdiasndrf@ndrf.avscv.mongodb.net/agency?retryWrites=true&w=majority"; // Ensure 'agency' is lowercase

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define schemas for Employee and Grievance
const EmployeeSchema = new mongoose.Schema({
  agencyName: { type: String, required: true },
  agencyId: { type: String, required: true },
  pincode: { type: String, required: true },
  email: { type: String, required: true },
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  position: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
});

const GrievanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  disasterType: { type: String, required: true },
  assistanceRequired: { type: [String], required: true },
  description: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  urgencyLevel: { type: String, required: true }
});

const Employee = mongoose.model('Employee', EmployeeSchema, 'employee'); // Ensure 'employee' is singular
const Employees = mongoose.model('Employees', EmployeeSchema, 'employees'); // Collection 'employees'
const Grievance = mongoose.model('Grievance', GrievanceSchema, 'report'); // Grievance collection 'report'

// Register route
app.post('/register', async (req, res) => {
  const { agencyName, agencyId, pincode, email, employeeName, employeeId, position, phone, regPassword } = req.body;

  try {
    const existingEmployee = await Employee.findOne({ employeeName });
    if (existingEmployee) return res.status(400).json({ msg: 'Employee already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(regPassword, salt);

    const newEmployee = new Employee({
      agencyName,
      agencyId,
      pincode,
      email,
      employeeName,
      employeeId,
      position,
      phone,
      password: hashedPassword
    });

    const newEmployeeInEmployees = new Employees({
      agencyName,
      agencyId,
      pincode,
      email,
      employeeName,
      employeeId,
      position,
      phone,
      password: hashedPassword
    });

    await newEmployee.save();
    await newEmployeeInEmployees.save();
    res.json({ msg: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ msg: 'Registration failed', error: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ employeeName: username });
    if (!employee) return res.status(400).json({ msg: 'Employee does not exist' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({ msg: 'Login successful' });
  } catch (error) {
    res.status(500).json({ msg: 'Login failed', error: error.message });
  }
});

// Submit grievance route
app.post('/submit-grievance', async (req, res) => {
  const { name, contactNumber, address, pincode, disasterType, assistanceRequired, description, peopleCount, urgencyLevel } = req.body;

  try {
    const newGrievance = new Grievance({
      name,
      contactNumber,
      address,
      pincode,
      disasterType,
      assistanceRequired,
      description,
      peopleCount,
      urgencyLevel
    });

    await newGrievance.save();
    res.json({ msg: 'Grievance reported successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Grievance submission failed', error: error.message });
  }
});

// Listen on port 5000
app.listen(5002, () => {
  console.log('Server started on port 5002');
});