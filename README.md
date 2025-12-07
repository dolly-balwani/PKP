🧠 Sahay – A Mental Health Support Platform
📌 Problem Statement

[PKPHM03] Mental Health Support
Mental health awareness is growing, yet access to timely, affordable, and reliable mental health resources remains limited—especially in underserved communities. Stigma, lack of professional support, and language barriers further prevent individuals from seeking help.

💡 Solution Overview

Sahay is a comprehensive digital mental health platform designed to provide early support, self-assessment tools, professional counselling access, AI-based emotional guidance, and community-driven peer support in one safe and accessible space.

The platform focuses on early intervention, cultural inclusivity, and continuous mental well-being, making mental health support easier to approach and less intimidating.

🔐 User & Counsellor Access

User Login: Individuals seeking mental health support

Counsellor Login: Verified counsellors providing professional guidance

Role-based access ensures secure and structured interactions

📅 Counsellor Appointment Booking

Users can browse and book appointments with counsellors

Seamless scheduling for timely professional support

Guided referrals based on assessment results

📊 Self-Assessment Tools

PHQ-9: Depression self-assessment

GAD-7: Anxiety self-assessment

Scientifically validated scoring with severity levels

Helps users understand their mental well-being and take informed next steps

📝 Daily Check-In

Simple daily well-being questions to track mood and emotional health

Encourages regular self-reflection and routine mental health monitoring

🤖 DBT-Based AI Chatbot

AI chatbot guided by Dialectical Behavior Therapy (DBT) principles

Provides:

Emotional validation

Grounding techniques

Stress and anxiety coping strategies

Available 24/7 as an emotional support companion

Designed to support, not replace, professional therapy

🌍 Multilingual Resource Hub

Curated mental health resources available in multiple languages

Articles, coping guides, and self-help content

Improves accessibility for diverse and underserved communities

🤝 Peer Support Community

Users can anonymously share thoughts and experiences

Peer-to-peer replies and supportive reactions

Encourages empathy, connection, and shared understanding

Community guidelines and reporting features help maintain a safe environment

🧘 Wellness & Routine Support

Guided meditation and breathing exercises

Daily exercise suggestions

Built-in timers and reminders to help users develop healthy routines

🔒 Privacy & Anonymity

Peer support posts are anonymous, allowing users to express themselves freely without fear of judgment

User identity is never displayed in community discussions

Other features remain secure and private

Designed with sensitivity toward mental health stigma while maintaining platform safety

🎯 Impact

Sahay helps users by:

Encouraging early awareness through self-assessment

Connecting individuals with professional and peer support

Providing 24/7 AI-assisted emotional guidance

Making mental health care more accessible, inclusive, and stigma-free

🚀 Vision

To build a trusted digital ecosystem where mental well-being support is available anytime, anywhere, empowering individuals—especially from underserved communities—to seek help confidently and without stigma.
🛠️ Tech Stack
Frontend

React – Component-based UI

Vite – Fast development and build tool

Tailwind CSS – Utility-first styling

Firebase Authentication – Secure user & counsellor login

Backend

Node.js – Server-side runtime

Express.js – REST API framework

MongoDB – Database for storing application data

AI & Wellness

DBT-based AI Chatbot – Provides emotional support and coping strategies

Mental Health Assessments – PHQ-9 & GAD-7 self-assessment tools

🔐 Authentication

Authentication is handled using Firebase Authentication for both users and counsellors.
The backend relies on existing authentication flow and does not manage authentication logic directly, ensuring a clean separation of concerns.

▶️ How to Run the Project Locally
✅ Prerequisites

Node.js (v16 or above)

MongoDB (local or MongoDB Atlas)

Git

1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Setup Backend
cd Backend
npm install


Create a .env file inside the Backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string


Run the backend server:

node server.js


Expected output:

✅ MongoDB Connected
🚀 Server running on port 5000

3️⃣ Setup Frontend

Open a new terminal:

cd Frontend
npm install
npm run dev


The frontend will be available at:

http://localhost:5173
