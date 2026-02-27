import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, CheckCircle, MessageCircle } from 'lucide-react';

export default function Testimonials() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    businessType: '',
    province: ''
  });

  const provinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West'
  ];

  // Fetch approved testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(
          collection(db, 'testimonials'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const testimonialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('');

    try {
      // Extract first name and last initial
      const displayName = user.displayName || user.email.split('@')[0];
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0];
      const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
      const anonymizedName = `${firstName} ${lastInitial}.`;

      await addDoc(collection(db, 'testimonials'), {
        userId: user.uid,
        userEmail: user.email,
        name: anonymizedName,
        rating: parseInt(formData.rating),
        comment: formData.comment,
        businessType: formData.businessType,
        province: formData.province,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setSubmitStatus('success');
      setFormData({ rating: 5, comment: '', businessType: '', province: '' });
      setShowForm(false);

      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < rating ? 'text-gold fill-gold' : 'text-gray-300'}
      />
    ));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-navy mb-4">Client Testimonials</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Real feedback from real business owners using Entry Safe
            </p>
            
            {/* Transparency Statement */}
            <div className="bg-white border-l-4 border-navy rounded-lg p-6 max-w-3xl mx-auto mb-8 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-navy flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="font-semibold text-navy mb-2">Our Commitment to Authenticity</p>
                  <p className="text-gray-700">
                    All testimonials published here are submitted by registered Entry Safe users and reviewed before publication. 
                    We value genuine feedback and maintain transparency in all our reviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Testimonial Button */}
            {user ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-navy to-navy-dark text-white font-bold px-8 py-4 rounded-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Share Your Experience
              </button>
            ) : (
              <Link
                to="/register"
                className="bg-gradient-to-r from-gold to-gold-dark text-navy font-bold px-8 py-4 rounded-lg hover:shadow-xl transition-all inline-block"
              >
                Sign Up to Share Your Experience
              </Link>
            )}
          </div>

          {/* Submission Form */}
          {showForm && user && (
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Submit Your Testimonial</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">
                      Your Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                        >
                          <Star
                            size={32}
                            className={star <= formData.rating ? 'text-gold fill-gold' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-semibold text-navy mb-2">
                      Business Type *
                    </label>
                    <input
                      type="text"
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                      placeholder="e.g., Construction, E-commerce, Consulting"
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <label htmlFor="province" className="block text-sm font-semibold text-navy mb-2">
                      Province *
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="block text-sm font-semibold text-navy mb-2">
                      Your Experience *
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all resize-none"
                      placeholder="Share your experience with Entry Safe..."
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Privacy Notice:</strong> Your testimonial will be displayed with your first name and last initial only (e.g., "John D."). 
                      Your full name and email will never be publicly visible. Testimonials are reviewed before publication.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-navy to-navy-dark text-white font-bold py-3 rounded-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Testimonial'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="max-w-3xl mx-auto mb-8 p-6 bg-green-100 border border-green-400 text-green-800 rounded-lg">
              <p className="font-semibold">✅ Testimonial Submitted Successfully!</p>
              <p className="text-sm">Thank you for your feedback. Your testimonial will be reviewed and published shortly.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="max-w-3xl mx-auto mb-8 p-6 bg-red-100 border border-red-400 text-red-800 rounded-lg">
              <p className="font-semibold">❌ Error Submitting Testimonial</p>
              <p className="text-sm">Please try again or contact support if the problem persists.</p>
            </div>
          )}

          {/* Testimonials Display */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-navy mb-2">No Testimonials Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your experience with Entry Safe!</p>
              {user && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-navy text-white font-bold px-6 py-3 rounded-lg hover:bg-navy-dark transition-all"
                >
                  Write a Testimonial
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="mb-4">
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-700 italic mb-6 leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-navy">{testimonial.name}</p>
                      <CheckCircle className="text-green-600" size={16} title="Verified User" />
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.businessType}</p>
                    <p className="text-sm text-gray-500">{testimonial.province}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
