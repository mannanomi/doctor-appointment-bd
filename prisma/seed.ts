import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
] as const;

const HOSPITALS: { name: string; address: string; city: string; division: string }[] = [
  { name: "Square Hospitals Ltd.", address: "18/F, West Panthapath", city: "Dhaka", division: "Dhaka" },
  { name: "Evercare Hospital Dhaka", address: "Plot 81, Block E, Bashundhara R/A", city: "Dhaka", division: "Dhaka" },
  { name: "United Hospital Limited", address: "Plot 15, Road 71, Gulshan", city: "Dhaka", division: "Dhaka" },
  { name: "Dhaka Medical College Hospital", address: "Secretariat Road, Bakshibazar", city: "Dhaka", division: "Dhaka" },
  { name: "Bangabandhu Sheikh Mujib Medical University", address: "Shahbag", city: "Dhaka", division: "Dhaka" },
  { name: "Imperial Hospital Chattogram", address: "Chatteswari Road, Panchlaish", city: "Chattogram", division: "Chattogram" },
  { name: "Chattogram Medical College Hospital", address: "K.B. Fazlul Kader Road", city: "Chattogram", division: "Chattogram" },
  { name: "Khulna Medical College Hospital", address: "Boyra Main Road", city: "Khulna", division: "Khulna" },
  { name: "Rajshahi Medical College Hospital", address: "Laxmipur, Boalia", city: "Rajshahi", division: "Rajshahi" },
  { name: "Sylhet MAG Osmani Medical College Hospital", address: "Medical College Road", city: "Sylhet", division: "Sylhet" },
  { name: "Sher-E-Bangla Medical College Hospital", address: "Kalibari Road", city: "Barishal", division: "Barishal" },
  { name: "Rangpur Medical College Hospital", address: "Dhap, Jail Road", city: "Rangpur", division: "Rangpur" },
  { name: "Mymensingh Medical College Hospital", address: "Charpara", city: "Mymensingh", division: "Mymensingh" },
];

const SPECIALTIES = [
  "Cardiology",
  "Psychology",
  "Traumatology",
  "Pediatrics",
  "Anesthiology",
  "Opthalmology",
  "Dentistry",
  "General Diagnosis",
  "Neuro Surgent",
] as const;

type DoctorSeed = {
  name: string;
  specialty: (typeof SPECIALTIES)[number];
  hospital: string;
  experienceYears: number;
  education: string;
  certificate: string;
  symptoms: string;
  procedures: string;
  feeBdt: number;
  scheduleText: string;
};

const DOCTORS: DoctorSeed[] = [
  {
    name: "Dr. Rowshan Ara Begum",
    specialty: "Cardiology",
    hospital: "Square Hospitals Ltd.",
    experienceYears: 15,
    education: "MBBS, FCPS (Cardiology), Dhaka Medical College",
    certificate: "Fellow, Bangladesh College of Physicians & Surgeons",
    symptoms: "Chest Pain, Hypertension, Palpitations, Heart Failure",
    procedures: "Echocardiography, Angioplasty, Pacemaker Implantation, ECG",
    feeBdt: 1500,
    scheduleText: "Sunday - Thursday, 09:00 - 13:00, 17:00 - 20:00",
  },
  {
    name: "Dr. Mahmudul Hasan",
    specialty: "Cardiology",
    hospital: "Evercare Hospital Dhaka",
    experienceYears: 11,
    education: "MBBS, MD (Cardiology), BSMMU",
    certificate: "Certified Interventional Cardiologist",
    symptoms: "Arrhythmia, Coronary Artery Disease, High Cholesterol",
    procedures: "Stress Test, Coronary Angiogram, Holter Monitoring",
    feeBdt: 1800,
    scheduleText: "Saturday - Wednesday, 10:00 - 14:00",
  },
  {
    name: "Dr. Amanda Clara Rahman",
    specialty: "Psychology",
    hospital: "United Hospital Limited",
    experienceYears: 12,
    education: "PhD in Clinical Psychology, University of Dhaka",
    certificate: "Certified CBT Therapist, APA",
    symptoms: "Anxiety & Panic Attacks, Stress, Depression, Sleep Disorders",
    procedures: "Cognitive Behavioral Therapy (CBT), Family & Couples Therapy, Supportive Psychotherapy, Mindfulness-Based Stress Reduction (MBSR)",
    feeBdt: 1200,
    scheduleText: "Monday - Saturday, 10:00 - 12:00, 14:00 - 20:00",
  },
  {
    name: "Dr. Jason Shatsky Chowdhury",
    specialty: "Psychology",
    hospital: "Evercare Hospital Dhaka",
    experienceYears: 10,
    education: "MPhil in Clinical Psychology, BSMMU",
    certificate: "Registered Clinical Psychologist, Bangladesh Clinical Psychology Society",
    symptoms: "Trauma & PTSD, Grief, Relationship Issues, Burnout",
    procedures: "Trauma-Focused CBT, Group Therapy, Mindfulness Coaching",
    feeBdt: 1000,
    scheduleText: "Sunday - Thursday, 11:00 - 15:00",
  },
  {
    name: "Dr. Jessie Dux Islam",
    specialty: "Traumatology",
    hospital: "Chattogram Medical College Hospital",
    experienceYears: 7,
    education: "MBBS, MS (Orthopedics), Chattogram Medical College",
    certificate: "Trauma & Orthopedic Surgery Certification",
    symptoms: "Fractures, Sports Injuries, Joint Dislocation, Spinal Trauma",
    procedures: "Fracture Fixation, Arthroscopy, Trauma Reconstruction",
    feeBdt: 900,
    scheduleText: "Saturday - Thursday, 09:00 - 17:00",
  },
  {
    name: "Dr. Farhana Yasmin",
    specialty: "Pediatrics",
    hospital: "Square Hospitals Ltd.",
    experienceYears: 12,
    education: "MBBS, DCH, FCPS (Pediatrics), Dhaka Shishu Hospital",
    certificate: "Fellow, Bangladesh College of Physicians & Surgeons",
    symptoms: "Fever, Growth Concerns, Vaccination, Respiratory Infections",
    procedures: "Newborn Screening, Immunization, Nutritional Counseling",
    feeBdt: 1000,
    scheduleText: "Monday - Saturday, 10:00 - 12:00, 14:00 - 20:00",
  },
  {
    name: "Dr. Kamal Uddin Ahmed",
    specialty: "Pediatrics",
    hospital: "Khulna Medical College Hospital",
    experienceYears: 9,
    education: "MBBS, DCH, Khulna Medical College",
    certificate: "Certified Pediatric Emergency Care Provider",
    symptoms: "Asthma, Allergies, Jaundice, Feeding Difficulties",
    procedures: "Nebulization, Allergy Testing, Growth Monitoring",
    feeBdt: 800,
    scheduleText: "Saturday - Thursday, 09:00 - 13:00",
  },
  {
    name: "Dr. Nusrat Jahan",
    specialty: "Anesthiology",
    hospital: "Bangabandhu Sheikh Mujib Medical University",
    experienceYears: 14,
    education: "MBBS, MD (Anesthesiology), BSMMU",
    certificate: "Fellow, College of Anesthesiologists of Bangladesh",
    symptoms: "Pre-operative Assessment, Chronic Pain, Post-op Pain Management",
    procedures: "General Anesthesia, Spinal & Epidural Block, Pain Management",
    feeBdt: 1300,
    scheduleText: "Sunday - Thursday, 08:00 - 12:00",
  },
  {
    name: "Dr. Shafiqul Islam",
    specialty: "Opthalmology",
    hospital: "Rajshahi Medical College Hospital",
    experienceYears: 16,
    education: "MBBS, FCPS (Ophthalmology), Rajshahi Medical College",
    certificate: "Fellow, Bangladesh Ophthalmological Society",
    symptoms: "Cataract, Glaucoma, Blurred Vision, Dry Eyes",
    procedures: "Cataract Surgery, LASIK, Retinal Examination",
    feeBdt: 1100,
    scheduleText: "Saturday - Wednesday, 09:00 - 15:00",
  },
  {
    name: "Dr. Taslima Akter",
    specialty: "Dentistry",
    hospital: "United Hospital Limited",
    experienceYears: 8,
    education: "BDS, MDS (Orthodontics), Dhaka Dental College",
    certificate: "Certified Orthodontist, Bangladesh Dental Society",
    symptoms: "Tooth Decay, Misalignment, Gum Disease, Tooth Sensitivity",
    procedures: "Root Canal Treatment, Braces & Aligners, Scaling & Polishing",
    feeBdt: 700,
    scheduleText: "Sunday - Friday, 10:00 - 18:00",
  },
  {
    name: "Dr. Golam Mostofa",
    specialty: "General Diagnosis",
    hospital: "Sylhet MAG Osmani Medical College Hospital",
    experienceYears: 20,
    education: "MBBS, FCPS (Medicine), Sylhet MAG Osmani Medical College",
    certificate: "Fellow, Bangladesh College of Physicians & Surgeons",
    symptoms: "Fatigue, Fever, Diabetes, General Checkup",
    procedures: "Full Body Checkup, Blood Panel Review, ECG Screening",
    feeBdt: 600,
    scheduleText: "Saturday - Thursday, 09:00 - 17:00",
  },
  {
    name: "Dr. Ariful Haque",
    specialty: "Neuro Surgent",
    hospital: "Mymensingh Medical College Hospital",
    experienceYears: 13,
    education: "MBBS, MS (Neurosurgery), Mymensingh Medical College",
    certificate: "Fellow, Bangladesh Neurosurgical Society",
    symptoms: "Chronic Headache, Spinal Disc Issues, Nerve Compression, Head Injury",
    procedures: "Craniotomy, Spinal Decompression, Tumor Resection",
    feeBdt: 2000,
    scheduleText: "Sunday - Thursday, 10:00 - 14:00",
  },
  {
    name: "Dr. Ismat Zerin",
    specialty: "Neuro Surgent",
    hospital: "Evercare Hospital Dhaka",
    experienceYears: 10,
    education: "MBBS, MCh (Neurosurgery), BSMMU",
    certificate: "Certified Minimally Invasive Neurosurgeon",
    symptoms: "Seizures, Brain Tumor, Stroke Recovery, Sciatica",
    procedures: "Endoscopic Neurosurgery, Deep Brain Stimulation, EEG Review",
    feeBdt: 2200,
    scheduleText: "Saturday - Wednesday, 11:00 - 15:00",
  },
];

const REVIEW_POOL = [
  { authorName: "Courtney Henry", rating: 5, comment: "Very attentive and explained everything clearly. Highly recommend for anyone in the area." },
  { authorName: "Cameron Williamson", rating: 4, comment: "Professional and on time. Wait was a bit long but the consultation was worth it." },
  { authorName: "Jane Cooper", rating: 3, comment: "Good advice overall, though the follow-up instructions could have been clearer." },
  { authorName: "Rafiq Hossain", rating: 5, comment: "Excellent bedside manner. Made my child feel comfortable throughout the visit." },
  { authorName: "Sadia Afrin", rating: 4, comment: "Knowledgeable doctor, the online consultation worked smoothly." },
  { authorName: "Tanvir Ahmed", rating: 5, comment: "Diagnosed the issue quickly and the treatment plan worked well." },
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.appointment.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.availableDate.deleteMany();
  await prisma.review.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.division.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding divisions...");
  const divisionMap = new Map<string, string>();
  for (const name of DIVISIONS) {
    const division = await prisma.division.create({ data: { name } });
    divisionMap.set(name, division.id);
  }

  console.log("Seeding hospitals...");
  const hospitalMap = new Map<string, string>();
  for (const h of HOSPITALS) {
    const hospital = await prisma.hospital.create({
      data: {
        name: h.name,
        address: h.address,
        city: h.city,
        divisionId: divisionMap.get(h.division)!,
      },
    });
    hospitalMap.set(h.name, hospital.id);
  }

  console.log("Seeding specialties...");
  const specialtyMap = new Map<string, string>();
  for (const name of SPECIALTIES) {
    const specialty = await prisma.specialty.create({ data: { name } });
    specialtyMap.set(name, specialty.id);
  }

  console.log("Seeding doctors, availability, and reviews...");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const d of DOCTORS) {
    const doctor = await prisma.doctor.create({
      data: {
        name: d.name,
        experienceYears: d.experienceYears,
        education: d.education,
        certificate: d.certificate,
        symptoms: d.symptoms,
        procedures: d.procedures,
        feeBdt: d.feeBdt,
        scheduleText: d.scheduleText,
        specialtyId: specialtyMap.get(d.specialty)!,
        hospitalId: hospitalMap.get(d.hospital)!,
      },
    });

    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = addDays(today, dayOffset);
      if (date.getDay() === 5) continue; // Friday off, typical BD weekend day

      const availableDate = await prisma.availableDate.create({
        data: { date, doctorId: doctor.id },
      });

      const times = ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"];
      for (const time of times) {
        await prisma.timeSlot.create({
          data: { time, availableDateId: availableDate.id },
        });
      }
    }

    const shuffled = [...REVIEW_POOL].sort(() => Math.random() - 0.5);
    const reviewCount = 2 + Math.floor(Math.random() * 2);
    for (const r of shuffled.slice(0, reviewCount)) {
      await prisma.review.create({
        data: {
          rating: r.rating,
          comment: r.comment,
          authorName: r.authorName,
          doctorId: doctor.id,
        },
      });
    }
  }

  console.log("Seeding demo user (demo@carebd.com / password123)...");
  await prisma.user.create({
    data: {
      name: "Cameron Ahmed",
      email: "demo@carebd.com",
      phone: "01712345678",
      passwordHash: await bcrypt.hash("password123", 10),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
