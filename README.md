# America the Quizzy 🇺🇸

A beautifully designed US Citizenship Test practice application with an Americana aesthetic. Built with Next.js 15 and React 19.

![Status](https://img.shields.io/badge/status-ready%20to%20deploy-success)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Features

- **USCIS Question Bank**: Authentic citizenship test questions from official USCIS materials
- **Smart Answer Grading**: Native fuzzy matching algorithm with intelligent normalization and Levenshtein distance
- **Americana Aesthetic**: Muted color palette, serif headings, and film grain texture
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Accessible**: WCAG 2.1 Level AA compliant with keyboard navigation and screen reader support
- **Single Page Application**: Smooth transitions between configuration, quiz, and results views

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd america-the-quizzy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
america-the-quizzy/
├── app/
│   ├── components/
│   │   ├── ConfigurationView.tsx    # Quiz setup form
│   │   ├── QuizView.tsx              # Question display & answer input
│   │   └── ResultsView.tsx           # Score summary & review
│   ├── types/
│   │   ├── index.ts                  # TypeScript interfaces
│   │   └── constants.ts              # USCIS categories & config
│   ├── api/
│   │   ├── generate-questions/       # Question generation endpoint
│   │   └── grade-answers/            # Answer grading endpoint
│   ├── layout.tsx                    # Root layout with fonts
│   ├── page.tsx                      # QuizOrchestrator (main)
│   ├── globals.css                   # Tailwind + Americana styles
│   └── icon.svg                      # Favicon
├── public/                           # Static assets
├── .env.example                      # Environment variable template
└── README.md                         # You are here
```

## 🎨 Design System

### Color Palette (Americana)

- **Dusty Blue** `#6B8E9E` - Primary buttons, headings
- **Desaturated Red** `#B85C5C` - Accents
- **Sun Yellow** `#D4B896` - Warm highlights
- **Warm Beige** `#C9B8A2` - Secondary text
- **Off White** `#F5F3EF` - Background
- **Sage Green** `#8B9B7E` - Correct answers
- **Soft Red** `#C67171` - Incorrect answers
- **Charcoal** `#3A3A3A` - Primary text

### Typography

- **Headings**: Merriweather (serif, mid-century inspired)
- **Body**: Inter (sans-serif, clean and readable)

### Aesthetic Elements

- **Film Grain**: Subtle CSS texture overlay (opacity: 0.03)
- **Glassmorphism**: Backdrop blur on cards
- **Smooth Transitions**: <100ms perceived latency

## 📝 Usage

1. **Configure Your Quiz**
   - Select number of questions (5-20)
   - Choose a category (American Government, American History, Integrated Civics, or Any)
   - Select a subcategory

2. **Take the Quiz**
   - Answer questions one at a time
   - Press Enter to submit or Escape to clear
   - Progress bar shows your position

3. **Review Results**
   - See your score and percentage
   - Review all questions with correct answers
   - Restart to practice again

## 🛠️ Technology Stack

### Core
- **Next.js 15.5.6** - App Router, API Routes, Server Components
- **React 19.1.0** - UI components with hooks
- **TypeScript 5.x** - Strict mode for type safety
- **Tailwind CSS 4.x** - Utility-first CSS with CSS-based configuration

### Question Management
- **Static Question Bank** - Local JSON file with USCIS questions
- **Native Fuzzy Matching** - Instant answer validation

### Deployment
- **Vercel** - Zero-config deployment

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-app.vercel.app`
   - No environment variables needed!

### Local Production Build

Test the production build locally before deploying:

```bash
npm run build
npm run start
```

## 📊 Performance Targets

- **Initial Load**: < 2 seconds (standard broadband)
- **UI Transitions**: < 100ms perceived latency
- **Bundle Size**: < 500KB compressed
- **Lighthouse Scores**: Performance >90, Accessibility 100, Best Practices >90

## ♿ Accessibility

- **Keyboard Navigation**: Full support (Tab, Enter, Escape)
- **Screen Readers**: Semantic HTML and ARIA labels
- **Touch Targets**: ≥44x44px on mobile
- **Color Contrast**: WCAG AA compliant (≥4.5:1)

## 🧪 Testing

This project follows a **no-test approach** as defined in the constitution:
- TypeScript strict mode for compile-time safety
- Manual testing for user flows
- Lighthouse audits for performance and accessibility

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your own needs!

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for aspiring US citizens**
