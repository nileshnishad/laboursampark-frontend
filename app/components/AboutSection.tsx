"use client";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-900 dark:text-white">About LabourSampark</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Bridging the gap between skilled professionals and opportunity</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Left Content */}
        <div>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Our Mission</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            LabourSampark is a revolutionary platform dedicated to connecting skilled labourers and trusted contractors across India. We believe every skilled professional deserves equal opportunities, and every contractor deserves access to verified, reliable talent.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our mission is to make it simple, transparent, and secure for labourers to find meaningful work and for contractors to build reliable teams. We're not just connecting people—we're building a community that values trust, skill, and fair opportunity.
          </p>
        </div>

        {/* Right Content */}
        <div>
          <h3 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">Why Choose LabourSampark?</h3>
          <ul className="space-y-3">
            {[
              { title: "Verified Professionals", desc: "Every profile is verified with detailed credentials and work history" },
              { title: "Transparent Ratings", desc: "Real feedback from contractors and labourers you can trust" },
              { title: "Quick Connection", desc: "Direct messaging and instant communication with verified contacts" },
              { title: "Secure Platform", desc: "Your data is protected with industry-standard security measures" }
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">✓</div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-white">{item.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 py-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-6">
        {[
          { number: "10,000+", label: "Active Labourers" },
          { number: "2,500+", label: "Verified Contractors" },
          { number: "50+", label: "Trades Supported" },
          { number: "98%", label: "Satisfaction Rate" }
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">{stat.number}</div>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-8 text-center">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "👤",
              title: "Easy Profile Setup",
              desc: "Create a professional profile in minutes with your skills, experience, and portfolio"
            },
            {
              icon: "⭐",
              title: "Verified Reviews",
              desc: "Build trust through verified feedback from clients and colleagues"
            },
            {
              icon: "💬",
              title: "Direct Communication",
              desc: "Connect directly with opportunities and collaborate seamlessly"
            },
            {
              icon: "🔍",
              title: "Smart Search",
              desc: "Find the perfect match based on skills, location, and experience"
            },
            {
              icon: "📱",
              title: "Mobile Friendly",
              desc: "Access opportunities anytime, anywhere on your mobile device"
            },
            {
              icon: "🛡️",
              title: "Secure & Safe",
              desc: "Your data is protected and all transactions are secure"
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="mb-6 text-blue-100">Join thousands of professionals already using LabourSampark to grow their careers and businesses</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg">
          Create Your Profile Today
        </button>
      </div>
    </section>
  );
}
