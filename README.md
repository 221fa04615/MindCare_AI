# MindCare AI 🧠✨

**MindCare AI** is a comprehensive, full-stack AI-powered mental health companion designed to provide immediate, empathetic support and emotional tracking. It leverages advanced Generative AI to offer a personalized "safe space" for users to express their feelings, track their moods, and receive guidance through life's challenges.

---

## 🚀 Live Demo
Check out the deployed application: [MindCare AI Live](https://mindcare-ai-serx.onrender.com)

---

## 📖 Project Description & Working

MindCare AI acts as a digital psychologist that is available 24/7. Unlike traditional chatbots, MindCare AI is designed with **Emotional Intelligence** at its core. 

### How it works:
1.  **Personalized Experience**: Upon onboarding, users provide their gender and personality type. The AI adapts its persona (Arjun for female users, Siya for male users) to provide the most comfortable conversational environment.
2.  **Empathetic Conversations**: The chatbot doesn't just answer questions; it listens. It uses sophisticated prompt engineering to match the user's emotional state, providing short sweet replies for casual talk and deep, supportive "essays" for complex emotional venting.
3.  **Mood Tracking**: Every interaction is analyzed for sentiment. Users can also manually log their moods, which are then visualized in a personal dashboard to help identify emotional patterns over time.
4.  **Safety First**: The system continuously monitors for crisis keywords. If a user expresses thoughts of self-harm, the AI immediately triggers a crisis protocol, providing local emergency resources and alerting the admin dashboard.

---

## 🤖 AI Features & "Training"

While we use the **Google Gemini 3 Flash** model as the engine, the "intelligence" and "personality" of MindCare AI come from advanced **System Instructions** and **Context Management**.

### 1. Persona Engineering (The "Training")
We have "trained" the AI through a complex system instruction set that defines its behavior:
*   **Empathy First**: The AI is instructed to be "sweet, deeply empathetic, and supportive."
*   **Dynamic Length Matching**: A critical directive ensures the AI doesn't overwhelm users. If you say "Hi," it says "Hello [Name]! How are you?" If you write a paragraph about stress, it responds with a detailed therapeutic guide.
*   **The "Firm Friend" Logic**: If a user admits to doing something ethically wrong (like stealing), the AI is programmed to briefly switch to a "firm/harsh" tone to highlight the gravity of the mistake, before returning to its empathetic self to guide them toward rectification and growth.

### 2. Combined AI Logic (Efficiency)
To ensure high performance and low latency, we use a **Single-Call Architecture**:
*   **Sentiment Analysis**: In the same request that generates a reply, the AI analyzes the user's message and categorizes it (Positive, Stress, Anxiety, Crisis, etc.).
*   **JSON Structured Output**: The AI returns a structured JSON object containing both the `text` response and the `sentiment` tag. This halves API usage and ensures the UI updates instantly.

### 3. Context Awareness
The AI doesn't "forget" the conversation. We maintain a **Context History** of the last 10-11 messages. However, to keep the conversation relevant, the system detects "Long Gaps" (>4 hours). If you return after a long time, the AI starts a fresh context while still remembering your name and profile.

---

## 🛠 Tech Stack

### Frontend
*   **React 19 & Vite**: For a lightning-fast, modern user interface.
*   **Tailwind CSS 4**: For a clean, responsive, and "calm" aesthetic.
*   **Framer Motion**: For smooth, organic animations that reduce "UI anxiety."
*   **Lucide React**: For intuitive iconography.
*   **Recharts**: For visualizing mood trends and emotional data.

### Backend
*   **Node.js & Express**: Handling the API logic and server-side operations.
*   **MongoDB & Mongoose**: Storing user profiles, encrypted chat history, and mood logs.
*   **Socket.io**: For real-time connection monitoring.
*   **JWT (JSON Web Tokens)**: For secure, stateless user authentication.

### AI & Infrastructure
*   **Google Gemini API**: The core LLM (Large Language Model) for natural language processing.
*   **Firebase Admin & Client**: Used as an authentication bridge and for potential real-time database features.
*   **Render**: For cloud deployment and hosting.

---

## 🔄 Total Workflow

1.  **Authentication**: User signs up or logs in. A JWT is generated for the backend, and a Firebase Custom Token is generated to bridge the user into the Firebase ecosystem.
2.  **Onboarding**: New users complete a one-time profile setup (Age, Gender, Personality). This data is saved to MongoDB and used to customize the AI persona.
3.  **The Chat Loop**:
    *   User sends a message.
    *   **Optimistic UI**: The message appears instantly on the screen.
    *   **AI Request**: The frontend sends the message + context history to Gemini.
    *   **Processing**: Gemini returns a response + sentiment tag.
    *   **Persistence**: Both the user message and bot response are saved to MongoDB.
4.  **Mood Analysis**: The sentiment from the chat is automatically logged. Users can also visit the **Mood** page to add detailed notes.
5.  **Dashboard**: The **Dashboard** aggregates all data, showing the user's "Emotional Journey" through interactive charts.
6.  **Admin Oversight**: Admins have a dedicated panel to view global stats, monitor unresolved crisis alerts, and provide direct feedback to users.

---

## 🛡 Security & Privacy
*   **Data Encryption**: Passwords are hashed using `bcryptjs`.
*   **Auth Guards**: All API routes are protected by JWT middleware.
*   **Safety Filters**: The AI is configured with strict safety settings to prevent the generation of harmful or inappropriate content.

---

*Developed with ❤️ for Mental Health Awareness.*
