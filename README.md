# Doctor Appointment BD

A doctor discovery and appointment booking platform for Bangladesh — browse specialists by division, hospital and specialty, then book a specific time slot.

## Features

- **Doctor directory** with specialty, hospital, years of experience, education, certifications, treated symptoms, procedures performed, and consultation fee in BDT.
- **Online and in-person** consultation flags per doctor.
- **Slot-based booking.** Each doctor has available dates, and each date has discrete time slots — a slot holds at most one confirmed appointment.
- **Patient accounts** with credentials auth, plus appointment history and cancellation.
- **Ratings and reviews** per doctor, supporting both registered and guest authors.
- **Geographic model** covering all eight Bangladesh divisions and their major hospitals.

## Data model

```
Division ──< Hospital ──< Doctor >── Specialty
                            │
                            ├──< AvailableDate ──< TimeSlot ──< Appointment >── User
                            └──< Review >── User
```

`AvailableDate` is unique per `(doctor, date)` and `TimeSlot` unique per `(date, time)`, so the schema itself prevents duplicate slots being generated.

## Tech stack

Next.js (App Router) · TypeScript · Prisma · SQLite · NextAuth · Tailwind CSS · bcrypt

Booking, registration, login, and cancellation are all server actions — there is no client-side API surface for mutations beyond the NextAuth route.

## Running locally

```bash
npm install
cp .env.example .env        # set DATABASE_URL and AUTH_SECRET
npx prisma migrate dev
npx tsx prisma/seed.ts      # divisions, hospitals, specialties, doctors, dates and slots
npm run dev
```

Open http://localhost:3000.

## Known limitations

1. **The double-booking check is not atomic.** `bookAppointmentAction` reads the slot's confirmed appointments and then creates one in a separate query. Two concurrent requests for the same slot can both pass the check. The fix is a unique partial index on `(timeSlotId)` for confirmed appointments, or wrapping the check and insert in a transaction — currently the race window is open.
2. **SQLite** is fine for development and this prototype, but the app would need Postgres to run for real.
3. **Doctor and hospital data is seeded**, not administered — there is no admin interface for adding or editing practitioners.
4. **Cancelled slots are not released** back into availability in an explicit workflow; cancellation sets appointment status only.
5. **No payment integration** — booking records an appointment and the consultation fee is informational.
