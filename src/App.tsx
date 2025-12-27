import { AboutCrivora } from './components/AboutCrivora'
import { ContactCTA } from './components/ContactCTA'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { ProblemSolver } from './components/ProblemSolver'
import { SecuritySection } from './components/SecuritySection'
import { TargetAudience } from './components/TargetAudience'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProblemSolver />
        <HowItWorks />
        <TargetAudience />
        <Features />
        <SecuritySection />
        <AboutCrivora />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
