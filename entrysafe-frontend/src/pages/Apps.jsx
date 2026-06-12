import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Apps() {
  return (
	<>
	  <Navbar />
	  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
		<div className="max-w-3xl mx-auto text-center">
		  <h1 className="text-4xl font-bold text-navy mb-4">EntrySafe Apps</h1>
		  <p className="text-gray-600 mb-8">
			Our suite of applications will be available here soon. Stay tuned!
		  </p>
		  <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
			<div className="text-6xl mb-4">📱</div>
			<h2 className="text-2xl font-semibold text-navy mb-2">Coming Soon</h2>
			<p className="text-sm text-gray-500">
			  We are preparing a great experience. Check back later for downloads and details.
			</p>
		  </div>
		</div>
	  </div>
	  <Footer />
	</>
  )
}
