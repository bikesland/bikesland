export default function About() {
  return (
    <main className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold text-center">
        About BikesLand
      </h1>

      <p className="mt-6 text-lg text-center max-w-3xl mx-auto">
        Welcome to <span className="font-bold text-green-400">BikesLand</span>.
        We are a trusted second-hand bike dealer in Nellore.
        Our goal is to provide quality used bikes with genuine documents,
        fair prices, and excellent customer service.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6">

        <div className="border border-gray-700 rounded-xl p-5">
          <h2 className="text-xl font-bold">🏍️ Quality Bikes</h2>
          <p className="mt-3">
            Every bike is carefully checked before sale.
          </p>
        </div>

        <div className="border border-gray-700 rounded-xl p-5">
          <h2 className="text-xl font-bold">📄 Genuine Documents</h2>
          <p className="mt-3">
            RC, insurance and documents are verified.
          </p>
        </div>

        <div className="border border-gray-700 rounded-xl p-5">
          <h2 className="text-xl font-bold">🤝 Trusted Service</h2>
          <p className="mt-3">
            Customer satisfaction is our first priority.
          </p>
        </div>

      </div>

      <div className="mt-10 text-center">
        <a
          href="/"
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          ⬅ Back to Home
        </a>
      </div>

    </main>
  );
}