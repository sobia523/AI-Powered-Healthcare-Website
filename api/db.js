import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MOCK_DB_PATH = path.join(__dirname, 'mock_db.json');

// Initial default data to seed the database
const initialData = {
  users: [],
  doctors: [
    { id: 'doc1', name: 'Dr. Maya Chen', role: 'Cardiology', qualification: 'MD, FACC', experience: '12 years', rating: 4.9, notes: 'Specialist in preventive heart care and diagnostic cardiovascular therapies.' },
    { id: 'doc2', name: 'Dr. Imran Patel', role: 'Pediatrics', qualification: 'MD, FAAP', experience: '8 years', rating: 4.8, notes: 'Compassionate pediatric care, immunizations, and developmental screenings.' },
    { id: 'doc3', name: 'Dr. Sara Gomez', role: 'Nutrition', qualification: 'MS, RD', experience: '6 years', rating: 4.7, notes: 'Personalized medical nutrition therapy, metabolic wellness, and meal planning.' },
    { id: 'doc4', name: 'Dr. Robert Carter', role: 'Dermatology', qualification: 'MD, FAAD', experience: '15 years', rating: 4.9, notes: 'Expert in clinical dermatology, skin cancer screenings, and advanced acne treatments.' },
    { id: 'doc5', name: 'Dr. Elena Rostova', role: 'Neurology', qualification: 'MD, PhD', experience: '14 years', rating: 4.9, notes: 'Specialized in migraine management, cognitive disorders, and neuro-diagnostics.' }
  ],
  medicines: [
    { id: 'med1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 4.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: 'Effective relief from mild to moderate pain, including headache, toothache, and muscle ache. Also helps reduce fever.', dosage: 'Take 1-2 tablets every 4 to 6 hours as needed. Do not exceed 8 tablets in 24 hours.', reviews: [{ user: 'Alex M.', rating: 5, comment: 'Quick relief for my headaches.' }, { user: 'Jane D.', rating: 4, comment: 'Reliable basic painkiller.' }] },
    { id: 'med2', name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 14.50, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: 'Broad-spectrum antibiotic used to treat bacterial infections such as pneumonia, tonsillitis, and urinary tract infections. Prescription required.', dosage: 'Take 1 capsule 3 times daily, or as directed by your physician. Complete the full course.', reviews: [{ user: 'David K.', rating: 5, comment: 'Cleared my ear infection in a few days.' }] },
    { id: 'med3', name: 'Cetirizine 10mg', category: 'Allergy & Cold', price: 8.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: '24-hour non-drowsy relief from allergy symptoms such as sneezing, runny nose, itchy watery eyes, and itchy throat.', dosage: 'Adults: Take one 10mg tablet daily. Do not exceed one tablet in 24 hours.', reviews: [{ user: 'Lisa P.', rating: 4, comment: 'Helps with my seasonal allergies. Mostly non-drowsy.' }] },
    { id: 'med4', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 6.25, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: 'Anti-inflammatory pain reliever for reducing joint swelling, muscular aches, backaches, and dental pain.', dosage: 'Take 1 tablet with food every 4 to 6 hours. Do not exceed 3 tablets in 24 hours.', reviews: [{ user: 'Mark S.', rating: 5, comment: 'Excellent for joint and back pain.' }] },
    { id: 'med5', name: 'Atorvastatin 10mg', category: 'Heart Health', price: 19.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: 'Prescription medication used alongside diet to lower blood cholesterol levels and reduce risk of cardiovascular disease.', dosage: 'Take 1 tablet daily in the evening, or as directed by a doctor.', reviews: [{ user: 'Sarah L.', rating: 4, comment: 'Effectively lowered my LDL cholesterol.' }] },
    { id: 'med6', name: 'Multivitamin Formula', category: 'Vitamins & Supps', price: 12.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', description: 'Comprehensive daily multivitamin and mineral supplement to support immune system, energy levels, and general wellbeing.', dosage: 'Take 1 tablet daily with water, preferably during a meal.', reviews: [{ user: 'Tom B.', rating: 5, comment: 'Great daily vitamin. Feel more energetic.' }] }
  ],
  labTests: [
    { id: 'lab1', name: 'Complete Blood Count (CBC)', category: 'General Screening', price: 29.99, description: 'Measures red blood cells, white blood cells, platelets, hemoglobin, and hematocrit. Essential for checking overall health and detecting anemia or infection.', duration: '1 day' },
    { id: 'lab2', name: 'Lipid Panel', category: 'Heart Health', price: 39.99, description: 'Measures total cholesterol, LDL (bad cholesterol), HDL (good cholesterol), and triglycerides to evaluate your cardiovascular health and risk.', duration: '1 day' },
    { id: 'lab3', name: 'HbA1c Blood Test', category: 'Diabetes', price: 34.99, description: 'Measures your average blood sugar levels over the past 3 months. Used to screen for prediabetes and monitor diabetes control.', duration: '1 day' },
    { id: 'lab4', name: 'Thyroid Panel (TSH, Free T3, Free T4)', category: 'Hormone Screening', price: 49.99, description: 'Evaluates thyroid gland function. Helps diagnose hyperthyroidism, hypothyroidism, and other thyroid-related conditions.', duration: '2 days' },
    { id: 'lab5', name: 'Vitamin D (25-Hydroxy)', category: 'Vitamins & Minerals', price: 44.99, description: 'Assesses vitamin D levels to support bone health, immune function, and overall metabolic state.', duration: '1 day' }
  ],
  appointments: [],
  labBookings: [],
  contactMessages: [],
  blogPosts: [
    { id: 1, title: '5 Everyday Habits That Support Heart Health', excerpt: 'Small, consistent choices can reduce risk and improve long-term wellness.', category: 'Tips', readTime: '4 min read', date: 'May 4, 2026', content: 'From morning walks to better sleep, simple daily actions can make a meaningful impact on heart health.' },
    { id: 2, title: 'Understanding Seasonal Allergies and Relief Options', excerpt: 'Learn how to recognize allergy symptoms and when to seek medical guidance.', category: 'Disease Info', readTime: '5 min read', date: 'May 2, 2026', content: 'Seasonal allergies can affect energy, sleep quality, and focus. Awareness is the first step to managing them.' },
    { id: 3, title: 'Why Hydration Matters More Than You Think', excerpt: 'Proper hydration supports immunity, skin, focus, and digestion', category: 'Tips', readTime: '3 min read', date: 'Apr 28, 2026', content: 'Hydration plays a quiet but powerful role in your body. A steady routine can improve how you feel throughout the day.' },
    { id: 4, title: 'What to Expect from a Routine Diabetes Screening', excerpt: 'Screenings can help detect early changes and guide healthier choices.', category: 'Disease Info', readTime: '6 min read', date: 'Apr 22, 2026', content: 'Routine screenings are fast, informative, and can support early intervention when concerns are found.' },
    { id: 5, title: 'Mindfulness Techniques for Stress Recovery', excerpt: 'Simple techniques can calm the mind and support healthy recovery habits.', category: 'Wellness', readTime: '4 min read', date: 'Apr 16, 2026', content: 'Mindfulness helps many patients reset after busy days and improve their emotional well-being.' },
    { id: 6, title: 'How Nutrition Shapes Recovery After Illness', excerpt: 'A balanced plate can support both energy and healing progress.', category: 'Wellness', readTime: '5 min read', date: 'Apr 10, 2026', content: 'Nutrition is a vital partner in the recovery journey, especially during or after illness.' }
  ]
};

class MockDatabase {
  constructor() {
    this.data = { ...initialData };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(MOCK_DB_PATH)) {
        const fileContent = fs.readFileSync(MOCK_DB_PATH, 'utf8');
        this.data = JSON.parse(fileContent);
        // Ensure default arrays exist
        for (const key of Object.keys(initialData)) {
          if (!this.data[key]) {
            this.data[key] = [...initialData[key]];
          }
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.warn('Failed to load mock DB, using initial data:', e);
      this.data = { ...initialData };
    }
  }

  save() {
    try {
      fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save mock DB:', e);
    }
  }

  getCollection(name) {
    const dbInstance = this;
    return {
      find: async (query = {}) => {
        let results = dbInstance.data[name] || [];
        return results.filter(item => {
          return Object.keys(query).every(key => {
            if (query[key] instanceof RegExp) {
              return query[key].test(item[key]);
            }
            return item[key] === query[key];
          });
        });
      },
      findOne: async (query = {}) => {
        let results = dbInstance.data[name] || [];
        return results.find(item => {
          return Object.keys(query).every(key => {
            if (query[key] instanceof RegExp) {
              return query[key].test(item[key]);
            }
            return item[key] === query[key];
          });
        }) || null;
      },
      findById: async (id) => {
        let results = dbInstance.data[name] || [];
        return results.find(item => item.id === id || item._id === id) || null;
      },
      create: async (doc) => {
        const newDoc = {
          _id: Math.random().toString(36).substring(2, 9),
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          ...doc
        };
        if (!dbInstance.data[name]) dbInstance.data[name] = [];
        dbInstance.data[name].push(newDoc);
        dbInstance.save();
        return newDoc;
      },
      findByIdAndUpdate: async (id, update) => {
        let results = dbInstance.data[name] || [];
        const index = results.findIndex(item => item.id === id || item._id === id);
        if (index === -1) return null;
        results[index] = { ...results[index], ...update, updatedAt: new Date().toISOString() };
        dbInstance.save();
        return results[index];
      },
      updateOne: async (query, update) => {
        let results = dbInstance.data[name] || [];
        const index = results.findIndex(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
        if (index === -1) return { nModified: 0 };
        results[index] = { ...results[index], ...update, updatedAt: new Date().toISOString() };
        dbInstance.save();
        return { nModified: 1 };
      }
    };
  }
}

export const mockDb = new MockDatabase();

export let isUsingMongoDB = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI env variable set. Falling back to local file-based Database.');
    isUsingMongoDB = false;
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('MongoDB database connected successfully!');
    isUsingMongoDB = true;
    await seedMongooseDB();
  } catch (err) {
    console.error('MongoDB connection failed. Falling back to local file-based Database. Error:', err.message);
    isUsingMongoDB = false;
  }
}

// Actual Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'patient' }
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  qualification: { type: String },
  experience: { type: String },
  rating: { type: Number },
  notes: { type: String }
}, { timestamps: true });

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  dosage: { type: String },
  reviews: { type: Array, default: [] }
}, { timestamps: true });

const labBookingSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  date: { type: String, required: true },
  price: { type: Number },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true }
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String },
  readTime: { type: String },
  date: { type: String },
  content: { type: String }
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const DoctorModel = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export const AppointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export const MedicineModel = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);
export const LabBookingModel = mongoose.models.LabBooking || mongoose.model('LabBooking', labBookingSchema);
export const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export const BlogPostModel = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

// Mongoose seeder
async function seedMongooseDB() {
  try {
    const docCount = await DoctorModel.countDocuments();
    if (docCount === 0) {
      await DoctorModel.insertMany(initialData.doctors.map(({ id, ...rest }) => rest));
      console.log('Seeded doctors collection.');
    }
    const medCount = await MedicineModel.countDocuments();
    if (medCount === 0) {
      await MedicineModel.insertMany(initialData.medicines.map(({ id, ...rest }) => rest));
      console.log('Seeded medicines collection.');
    }
    const blogCount = await BlogPostModel.countDocuments();
    if (blogCount === 0) {
      await BlogPostModel.insertMany(initialData.blogPosts.map(({ id, ...rest }) => rest));
      console.log('Seeded blog posts collection.');
    }
  } catch (err) {
    console.error('Error seeding Mongoose database:', err.message);
  }
}

// Unified Getter
export function db(collectionName) {
  if (isUsingMongoDB) {
    switch (collectionName) {
      case 'users': return UserModel;
      case 'doctors': return DoctorModel;
      case 'appointments': return AppointmentModel;
      case 'medicines': return MedicineModel;
      case 'labBookings': return LabBookingModel;
      case 'contactMessages': return ContactMessageModel;
      case 'blogPosts': return BlogPostModel;
      default: throw new Error(`Collection ${collectionName} does not exist.`);
    }
  } else {
    return mockDb.getCollection(collectionName);
  }
}
