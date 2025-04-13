import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import "./HomePage.css";

function Home() {
  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Share your story with the world</h1>
            <p className="hero-subtitle">
              BlogIt is where ideas come to life. Write, publish, and connect
              with readers who care about what you have to say.
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="btn btn-primary">
                Start Writing
              </a>
              <a href="/explore" className="btn btn-secondary">
                Explore Stories
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/hero-image.jpg" alt="Person writing a blog" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why choose BlogIt?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Easy to Use</h3>
              <p>
                Our intuitive editor makes writing and publishing blogs a
                breeze, with no technical skills required.
              </p>
            </div>
            <div className="feature-card">
              <h3>Grow Your Audience</h3>
              <p>
                Connect with readers who share your interests and build a loyal
                following for your content.
              </p>
            </div>
            <div className="feature-card">
              <h3>Monetize Your Work</h3>
              <p>
                Turn your passion into income with our built-in monetization
                tools for established writers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to start your writing journey?</h2>
          <p>
            Join thousands of writers who have already found their voice on
            BlogIt
          </p>
          <a href="/signup" className="btn btn-primary">
            Create Your Account
          </a>
        </div>
      </section>
      <div>
        {" "}
        <Footer />
      </div>
    </div>
  );
}

export default Home;
