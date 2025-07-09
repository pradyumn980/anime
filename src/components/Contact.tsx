import React, { useState } from "react";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-gradient-to-br from-black/80 to-gray-900/80 rounded-xl shadow-lg border border-gray-700/40">
      <h2 className="text-xl font-bold text-white mb-2">Contact Us</h2>
      <p className="text-gray-400 mb-4 text-sm">Have feedback or questions? Reach out below!</p>
      <div className="mb-4 text-gray-300 text-sm">
        <span className="font-semibold">Email:</span> <a href="mailto:support@animefinder.com" className="text-emerald-400 hover:underline">support@animefinder.com</a>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-400"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-400"
          rows={3}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-gradient-to-r from-red-600 to-emerald-500 text-white font-semibold hover:from-red-700 hover:to-emerald-600 transition-all"
        >
          Send Message
        </button>
        {submitted && (
          <div className="text-emerald-400 text-center mt-2">Thank you for reaching out!</div>
        )}
      </form>
    </div>
  );
};

export default Contact; 