# Firebase Quick Tweets

A fullstack Twitter clone built using modern **Next.js serverless technologies** and Firebase services. This project enables users to create, interact, and manage quick tweets seamlessly.

---

## 🔥 **Key Features**

- **User Authentication** using Firebase Authentication
- **Real-time Data Storage** with Firebase Firestore
- **Image Uploads** with Firebase Storage
- **Serverless Functions** powered by Firebase Cloud Functions
- **Responsive and Modern UI** styled with Tailwind CSS
- Emoji Support for tweets and comments using **Emoji Mart**

---

## 🚀 **Tech Stack**

### Frontend & Framework
- **Next.js** (Serverless React Framework)
- **React** for UI Components
- **Tailwind CSS** for Utility-first Styling

### Backend & Services
- **Firebase Authentication** (Google, Email/Password)
- **Firebase Firestore** (NoSQL Database)
- **Firebase Functions** (Serverless backend logic)
- **Firebase Storage** (Image uploads)

### Dependencies
- **React Hook Form** for form management
- **Joi** for input validation
- **Moment.js** for date formatting
- **Sharp** for image processing
- **Emoji Mart** for emoji picker integration

---

## 🛠️ **Installation & Setup**

Follow these steps to set up the project locally:

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (>= 18.x)
- **npm**
- A **Firebase Project** (configured with Firestore, Authentication, Functions, and Storage)

### Steps

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Set up Firebase**
   - Create a `.env.local` file in the root directory and add your Firebase project configuration according to `.env.example` file.


4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 🙌 **Acknowledgements**

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Emoji Mart](https://github.com/missive/emoji-mart)

---

