import Link from "next/link";
import Image from "next/image";
import UniOfIbadan from "@/assets/images/university-of-ibadan.png";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl">
                Transform Your Educational Experience
              </h1>
              <p className="text-xl mb-8 max-w-xl">
                Connect, learn, and grow with Campus connect - the ultimate
                platform for students and lecturers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="btn-primary text-center px-6 py-3 rounded-md bg-white text-blue-600 hover:bg-gray-200 transition duration-200"
                >
                  Get Started
                </Link>
                <Link
                  href="/"
                  className="text-white btn text-center border border-white px-6 py-3 rounded-md transition duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src={UniOfIbadan}
                alt="Education Platform"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Campus connect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Course Management
              </h3>
              <p className="text-gray-600">
                Easily access and manage course materials for all your classes
                in one place.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Specifically designed interfaces for both students and
                lecturers, ensuring optimal experience.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Seamless File Sharing
              </h3>
              <p className="text-gray-600">
                Upload and access course materials in any format with our
                flexible file management system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to enhance your educational journey?
          </h2>
          <p className="text-xl mb-14 max-w-2xl mx-auto">
            Join thousands of students and lecturers already using Campus
            connect to streamline their educational experience.
          </p>
          <Link
            href="/register"
            className="btn-primary text-center px-6 py-4 rounded-md bg-white text-blue-600 hover:bg-gray-200 transition duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
