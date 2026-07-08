import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import { connectDB, db } from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize DB connection
connectDB();

// Register Routes
app.use('/api/auth', authRoutes);

// Blog routes
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await db('blogPosts').find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctors routes
app.get('/api/doctors', async (req, res) => {
  try {
    const doctorsList = await db('doctors').find();
    res.json(doctorsList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await db('doctors').findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Appointments routes
app.post('/api/appointments', async (req, res) => {
  try {
    const { doctorId, doctorName, patientName, patientEmail, patientPhone, date, timeSlot, notes } = req.body;
    if (!doctorId || !doctorName || !patientName || !patientEmail || !patientPhone || !date || !timeSlot) {
      return res.status(400).json({ error: 'All booking fields are required.' });
    }

    const appointment = await db('appointments').create({
      doctorId,
      doctorName,
      patientName,
      patientEmail,
      patientPhone,
      date,
      timeSlot,
      notes,
      status: 'Confirmed'
    });

    res.status(201).json({ message: 'Appointment booked successfully!', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/patient/:email', async (req, res) => {
  try {
    const appointments = await db('appointments').find({ patientEmail: req.params.email });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Medicine routes
app.get('/api/medicines', async (req, res) => {
  try {
    const medicinesList = await db('medicines').find();
    res.json(medicinesList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/medicines/:id', async (req, res) => {
  try {
    const medicine = await db('medicines').findById(req.params.id);
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Laboratory routes
app.get('/api/lab-tests', async (req, res) => {
  try {
    const tests = await db('labTests').find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lab-bookings', async (req, res) => {
  try {
    const { testName, patientName, patientEmail, patientPhone, date, price } = req.body;
    if (!testName || !patientName || !patientEmail || !patientPhone || !date) {
      return res.status(400).json({ error: 'All booking fields are required.' });
    }

    const booking = await db('labBookings').create({
      testName,
      patientName,
      patientEmail,
      patientPhone,
      date,
      price,
      status: 'Confirmed'
    });

    res.status(201).json({ message: 'Lab test booked successfully!', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newMessage = await db('contactMessages').create({
      name,
      email,
      phone,
      message,
      date: new Date().toISOString()
    });

    res.status(201).json({ message: 'Message sent successfully!', contact: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start local server if run directly (not loaded as Vercel function)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express Server running locally on http://localhost:${PORT}`);
  });
}

export default app;
