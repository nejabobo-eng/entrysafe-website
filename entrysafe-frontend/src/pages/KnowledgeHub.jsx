import { BookOpen, FileText, Download, Calendar, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function KnowledgeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Business Registration', 'Tax Compliance', 'Accounting', 'Legal', 'Guides'];

  const articles = [
    {
      title: "Complete Guide to CIPC Business Registration in South Africa",
      category: "Business Registration",
      date: "Jan 15, 2026",
      readTime: "8 min read",
      excerpt: "Step-by-step guide to registering your business with CIPC, including required documents, fees, and common pitfalls to avoid.",
      featured: true
    },
    {
      title: "Understanding SARS Tax Obligations for Small Businesses",
      category: "Tax Compliance",
      date: "Jan 10, 2026",
      readTime: "6 min read",
      excerpt: "Learn about VAT registration, PAYE submissions, and income tax requirements for South African SMEs.",
      featured: true
    },
    {
      title: "How to Choose the Right Business Structure in SA",
      category: "Business Registration",
      date: "Jan 5, 2026",
      readTime: "5 min read",
      excerpt: "Compare sole proprietorship, partnership, private company, and nonprofit structures to find the best fit for your business.",
      featured: false
    },
    {
      title: "2026 Tax Filing Deadlines: What You Need to Know",
      category: "Tax Compliance",
      date: "Dec 28, 2025",
      readTime: "4 min read",
      excerpt: "Stay compliant with key SARS filing deadlines for individuals, companies, and provisional taxpayers in 2026.",
      featured: false
    },
    {
      title: "Essential Financial Statements Every Business Needs",
      category: "Accounting",
      date: "Dec 20, 2025",
      readTime: "7 min read",
      excerpt: "Understand income statements, balance sheets, and cash flow statements—and why they matter for your business.",
      featured: false
    },
    {
      title: "Legal Requirements for Hiring Your First Employee",
      category: "Legal",
      date: "Dec 15, 2025",
      readTime: "6 min read",
      excerpt: "Navigate employment contracts, UIF registration, and labor law compliance when expanding your team.",
      featured: false
    }
  ];

  const resources = [
    {
      title: "Business Registration Checklist",
      type: "PDF Guide",
      size: "2.3 MB"
    },
    {
      title: "Tax Compliance Calendar 2026",
      type: "PDF Calendar",
      size: "1.8 MB"
    },
    {
      title: "Financial Planning Template",
      type: "Excel Template",
      size: "450 KB"
    },
    {
      title: "Employee Contract Template",
      type: "Word Document",
      size: "120 KB"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-navy via-navy-dark to-navy text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-gold" />
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Knowledge Hub
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Expert guides, articles, and resources to help you navigate business compliance in South Africa
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-navy text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold text-navy mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredArticles.filter(a => a.featured).map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-navy to-navy-dark h-48 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gold" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="bg-gold text-navy px-3 py-1 rounded-full font-semibold">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {article.date}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-6">{article.excerpt}</p>
                  <button className="flex items-center text-navy font-semibold hover:text-navy-dark transition-colors">
                    Read Article
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* All Articles */}
          <h2 className="text-3xl font-bold text-navy mb-8">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.filter(a => !a.featured).map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6"
              >
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                  <span className="bg-gray-200 text-navy px-2 py-1 rounded font-semibold">
                    {article.category}
                  </span>
                  <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <button className="text-navy font-semibold hover:text-navy-dark transition-colors text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </section>

        {/* Downloadable Resources */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="text-3xl font-bold text-navy mb-8">Downloadable Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <Download className="text-gold w-10 h-10 mb-4" />
                  <h3 className="font-bold text-navy mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {resource.type} • {resource.size}
                  </p>
                  <button className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-dark transition-all text-sm font-semibold w-full">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gold to-gold-dark">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-navy mb-6">
              Need Personalized Guidance?
            </h2>
            <p className="text-xl text-navy-dark mb-8">
              Our expert team is ready to help you navigate your specific business challenges
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-navy text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-dark transition-all shadow-lg"
            >
              Contact Our Experts
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
