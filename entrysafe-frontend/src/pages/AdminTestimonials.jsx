import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, CheckCircle, XCircle, Trash2, Clock } from 'lucide-react';

export default function AdminTestimonials() {
  const { user } = useAuth();
  const [pendingTestimonials, setPendingTestimonials] = useState([]);
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Fetch pending testimonials
      const pendingQuery = query(
        collection(db, 'testimonials'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingData = pendingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingTestimonials(pendingData);

      // Fetch approved testimonials
      const approvedQuery = query(
        collection(db, 'testimonials'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const approvedSnapshot = await getDocs(approvedQuery);
      const approvedData = approvedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApprovedTestimonials(approvedData);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user.uid
      });
      await fetchTestimonials();
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        await fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-gold fill-gold' : 'text-gray-300'}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TestimonialCard = ({ testimonial, isPending }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-1">
          {renderStars(testimonial.rating)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          {formatDate(testimonial.createdAt)}
        </div>
      </div>

      <p className="text-gray-700 italic mb-4 leading-relaxed">
        "{testimonial.comment}"
      </p>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <p className="font-semibold text-navy">{testimonial.name}</p>
        <p className="text-sm text-gray-600">{testimonial.businessType}</p>
        <p className="text-sm text-gray-500">{testimonial.province}</p>
        <p className="text-xs text-gray-400 mt-2">User ID: {testimonial.userId}</p>
        <p className="text-xs text-gray-400">Email: {testimonial.userEmail}</p>
      </div>

      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={() => handleApprove(testimonial.id)}
            className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            onClick={() => handleReject(testimonial.id)}
            className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      )}

      {!isPending && (
        <button
          onClick={() => handleReject(testimonial.id)}
          className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/admin"
              className="text-navy hover:text-gold font-semibold mb-4 inline-block"
            >
              ← Back to Admin Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-navy mb-2">Testimonials Management</h1>
            <p className="text-lg text-gray-600">Review and approve testimonials from users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Pending Review</p>
                  <p className="text-4xl font-bold text-orange-600">{pendingTestimonials.length}</p>
                </div>
                <Clock className="text-orange-600" size={48} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Approved & Published</p>
                  <p className="text-4xl font-bold text-green-600">{approvedTestimonials.length}</p>
                </div>
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Testimonials</p>
                  <p className="text-4xl font-bold text-navy">{pendingTestimonials.length + approvedTestimonials.length}</p>
                </div>
                <Star className="text-gold fill-gold" size={48} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending ({pendingTestimonials.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'approved'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Approved ({approvedTestimonials.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading testimonials...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'pending' ? (
                pendingTestimonials.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
                    <Clock className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-2xl font-bold text-navy mb-2">No Pending Testimonials</h3>
                    <p className="text-gray-600">All testimonials have been reviewed!</p>
                  </div>
                ) : (
                  pendingTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      isPending={true}
                    />
                  ))
                )
              ) : (
                approvedTestimonials.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
                    <CheckCircle className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-2xl font-bold text-navy mb-2">No Approved Testimonials</h3>
                    <p className="text-gray-600">No testimonials have been approved yet.</p>
                  </div>
                ) : (
                  approvedTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      isPending={false}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
