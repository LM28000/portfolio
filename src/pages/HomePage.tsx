import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Contact />
    </div>
  );
};

export default HomePage;