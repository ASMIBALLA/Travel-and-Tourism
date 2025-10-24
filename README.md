🏔️ Sikkim Monastery 360

A feature-rich, interactive web platform for exploring Sikkim’s monasteries, festivals, and travel options — now enhanced with immersive 360° monastery views and festival highlight videos.

Built with Next.js + React, this platform allows users to discover cultural events, visualize monastery locations, experience virtual monastery tours, and plan travel seamlessly through a modern, engaging UI.

🚀 Features

🗓️ Interactive Festival Calendar
Explore religious, cultural, and music festivals across Sikkim. Filter by type, search by name or location, and export events to ICS calendar files.

🚌 Travel Booking System
Search and book trips, select transport options, view booking history, and confirm reservations — all in one place.

📊 Dynamic Festival Data
Festival data is dynamically loaded from a Google Sheet CSV or Excel file for easy annual updates.

🗺️ Monastery Map Explorer
Interactive map displaying monastery locations, with responsive modal info popups, route suggestions, and location input.

🧭 360° Virtual Monastery View
Immerse yourself in panoramic monastery visuals — navigate and explore sacred interiors and landscapes in an interactive 360° experience powered by React-360/Three.js.

🎥 Video Showcase Integration
Watch short cultural documentaries and festival highlight videos embedded directly within event and monastery pages.

🧩 Componentized Architecture
Modular React components ensure maintainability and scalability:

FestivalCalendar

InteractiveMap

BookingHistory

Confirmation

LocationInput

MapModal

TransportOptions

Monastery360Viewer (new)

FestivalVideoGallery (new)

⚙️ Custom Hooks & Styles
Includes useBookingState for trip management, and custom CSS/Tailwind for a modern travel aesthetic.

🛠️ Tech Stack

Frameworks: Next.js 14+, React 18+

Styling: Tailwind CSS

Data Handling: XLSX (SheetJS) for Excel importing, dynamic JSON API integration

Mapping: Leaflet / Mapbox

360° View: React-360 / Three.js

State Management: React Hooks

Version Control: Git + GitHub

📦 Installation

Clone the repository

git clone https://github.com/ASMIBALLA/Travel-and-Tourism.git
cd Travel-and-Tourism

Install dependencies

npm install


Add festival & media data

Place sikkim_festivals_full.xlsx (or your updated data file) into /public.

Place monastery images, 360° panoramas, and video files in /public/assets/monasteries/.

Start the development server

npm run dev

🗂️ Project Structure
components/
 ├── FestivalCalendar.tsx
 ├── InteractiveMap.tsx
 ├── BookingHistory.tsx
 ├── Confirmation.tsx
 ├── LocationInput.tsx
 ├── MapModal.tsx
 ├── TransportOptions.tsx
 ├── Monastery360Viewer.tsx      # New 360° panorama component
 ├── FestivalVideoGallery.tsx    # New video showcase component
hooks/
 └── useBookingState.ts
styles/
 └── travelglobal.css
public/
 ├── sikkim_festivals_full.xlsx
 ├── assets/
 │    ├── monasteries/
 │    │     ├── Rumtek360.jpg
 │    │     ├── Pemayangtse360.jpg
 │    │     └── Tashiding360.jpg
 │    └── videos/
 │          ├── festival_intro.mp4
 │          └── tsechu_highlights.mp4

🖼️ UI / UX Overview
<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"> <div style="flex: 0 0 48%;"><img width="100%" alt="map" src="https://github.com/user-attachments/assets/e95da65e-83df-419d-8e84-0a99b028a6c7" /></div> <div style="flex: 0 0 48%;"><img width="100%" alt="calendar" src="https://github.com/user-attachments/assets/2f07d9c8-bf76-4e7e-acf6-c90f57c9e11c" /></div> <div style="flex: 0 0 48%;"><img width="100%" alt="monastery360" src="https://github.com/user-attachments/assets/8031da5f-1894-4633-80d4-88b29e5fb589" /></div> <div style="flex: 0 0 48%;"><img width="100%" alt="video-gallery" src="https://github.com/user-attachments/assets/2f07dff9-58c6-4879-aabe-7dea2a76ab63" /></div> </div>
🗂️ Updating Festival / Event Data

Update the festival dataset by replacing or editing the sikkim_festivals_full.xlsx file inside the public directory.

Supported columns:
id, name, startDate, endDate, location, description, type, img, video_url, panorama_url

Tip: Keep date fields in ISO (YYYY-MM-DD) format and ensure all file paths are correct for new panoramas or videos.


📝 License

MIT License — See LICENSE
 for details.

This project celebrates Sikkim’s vibrant culture through immersive 360° exploration, video storytelling, and seamless travel planning for all. 🌸
