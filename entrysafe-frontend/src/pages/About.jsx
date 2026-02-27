import { Target, Heart, Users, Award, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Client-Centered",
      description: "Your success is our success. We prioritize your needs and goals in everything we do."
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Integrity",
      description: "Transparent, honest, and ethical service delivery in all our business dealings."
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Excellence",
      description: "We deliver high-quality work and continuously improve our services."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Empowerment",
      description: "We educate and empower entrepreneurs to make informed business decisions."
    }
  ];

  const milestones = [
    { year: "2020", event: "Mlu Accounting Services Founded" },
    { year: "2022", event: "Launched EntrySafe Platform" },
    { year: "2024", event: "500+ Businesses Registered" },
    { year: "2026", event: "Expanding Digital Services" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About EntrySafe
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Empowering South African entrepreneurs with professional business services and secure document management
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-navy mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  EntrySafe was born from a simple observation: South African entrepreneurs face unnecessary complexity when starting and managing their businesses. From confusing CIPC registration processes to overwhelming tax compliance requirements, the barriers to entry were too high.
                </p>
                <p>
                  Founded as part of <strong className="text-navy">Mlu Accounting Services</strong>, EntrySafe is our commitment to making business ownership accessible, compliant, and stress-free. We combine professional accounting expertise with modern technology to deliver services that entrepreneurs actually need.
                </p>
                <p>
                  Today, we've helped hundreds of businesses across South Africa navigate registration, taxation, and compliance—allowing them to focus on what they do best: growing their businesses.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-navy to-navy-dark p-8 rounded-2xl shadow-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg leading-relaxed mb-6">
                To simplify business compliance and empower South African entrepreneurs with the tools, knowledge, and support they need to succeed.
              </p>
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <p className="text-lg leading-relaxed">
                To become South Africa's most trusted partner for business registration, compliance, and financial management—making entrepreneurship accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-navy mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <div className="text-navy mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our growth</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gold hidden lg:block"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
                      <p className="text-3xl font-bold text-gold mb-2">{milestone.year}</p>
                      <p className="text-lg text-navy font-semibold">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="hidden lg:block w-8 h-8 bg-gold rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 bg-gradient-to-br from-navy to-navy-dark text-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Meet Our Founder</h2>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center text-navy text-4xl font-bold">
                  M
                </div>
                <h3 className="text-2xl font-bold text-gold mb-2">Mlu Mncube</h3>
                <p className="text-gray-200 mb-4">Founder & Principal Accountant</p>
              </div>
              <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                With a passion for empowering entrepreneurs and years of experience in accounting and business consulting, 
                Mlu founded Mlu Accounting Services to make professional business services accessible to all South African 
                entrepreneurs. EntrySafe is the digital extension of that mission—combining expertise with technology to 
                simplify business compliance.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gold to-gold-dark">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-navy mb-6">
              Ready to Start Your Business Journey?
            </h2>
            <p className="text-xl text-navy-dark mb-8">
              Join hundreds of successful South African entrepreneurs who trust EntrySafe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center bg-navy text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-dark transition-all shadow-lg"
              >
                View Our Services
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center bg-white text-navy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
