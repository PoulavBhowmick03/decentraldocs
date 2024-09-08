/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  FileText,
  Shield,
  Users,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Lock,
  Check,
  Menu,
  Share2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const features = [
  { icon: Shield, text: "Secure" },
  { icon: FileText, text: "Smart Contracts" },
  { icon: Share2, text: "Decentralized" },
];

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const yRange = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: "John Doe",
      role: "CEO, TechCorp",
      content:
        "DecentralDocs has revolutionized our document management process. It's secure, efficient, and incredibly user-friendly.",
    },
    {
      name: "Jane Smith",
      role: "CTO, InnovateCo",
      content:
        "The blockchain integration gives us peace of mind. Our sensitive documents have never been more secure.",
    },
    {
      name: "Alex Johnson",
      role: "Director, GlobalTech",
      content:
        "The ability to instantly verify documents has saved us countless hours and resources. Highly recommended!",
    },
  ];

  useEffect(() => {
    // Add custom scrollbar styles
    document.body.style.scrollbarWidth = "thin";
    document.body.style.scrollbarColor = "#3B82F6 #1F2937";

    const style = document.createElement("style");
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #1F2937;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #3B82F6;
        border-radius: 20px;
        border: 3px solid #1F2937;
      }
    `;
    document.head.append(style);

    return () => {
      document.body.style.scrollbarWidth = "";
      document.body.style.scrollbarColor = "";
      style.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <svg
          className="w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#dotPattern)"
          />
        </svg>
      </div>
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900 bg-opacity-80 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-400">
            DecentralDocs
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="#features"
              className="hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-blue-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-blue-400 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>
          <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white">
            Sign Up
          </Button>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </nav>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-800 p-4"
          >
            <Link
              href="#features"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="block py-2 hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up
            </Button>
          </motion.div>
        )}
      </header>
      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
            }}
          />
          <div className="text-center space-y-8 relative z-10 px-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Decentralized Document Platform
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Issue, verify, and manage documents securely on the blockchain
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white group"
              >
                Watch Demo
                <Play className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
            <motion.div
              className="flex justify-center space-x-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <feature.icon className="h-8 w-8 text-blue-400 mb-2" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section ref={statsRef} className="py-20 bg-gray-800 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Documents Issued", value: "1M+" },
                { label: "Users Worldwide", value: "100K+" },
                { label: "Secure Transactions", value: "5M+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "Document Issuing",
                  description:
                    "Securely issue digital documents on the blockchain",
                },
                {
                  icon: <Shield className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "Verification",
                  description:
                    "Instantly verify the authenticity of any document",
                },
                {
                  icon: <Users className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "User Management",
                  description:
                    "Effortlessly manage users and their permissions",
                },
                {
                  icon: <Zap className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "Fast Processing",
                  description:
                    "Lightning-fast document processing and verification",
                },
                {
                  icon: <Globe className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "Global Access",
                  description:
                    "Access your documents from anywhere in the world",
                },
                {
                  icon: <Lock className="w-12 h-12 mb-4 text-blue-400" />,
                  title: "Enhanced Security",
                  description:
                    "Military-grade encryption for all your sensitive data",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2 text-blue-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gray-800 relative">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              How It Works
            </h2>
            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: "Connect Your Wallet",
                  description: "Link your blockchain wallet to our platform",
                },
                {
                  step: 2,
                  title: "Create or Upload Documents",
                  description:
                    "Easily create new documents or upload existing ones",
                },
                {
                  step: 3,
                  title: "Issue on Blockchain",
                  description:
                    "Securely issue your documents on the blockchain",
                },
                {
                  step: 4,
                  title: "Share and Verify",
                  description:
                    "Share your documents and allow instant verification",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-blue-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 relative">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Pricing Plans
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Basic",
                  price: "$9.99",
                  features: [
                    "100 Document Issues",
                    "Basic Verification",
                    "Email Support",
                  ],
                },
                {
                  name: "Pro",
                  price: "$29.99",
                  features: [
                    "Unlimited Document Issues",
                    "Advanced Verification",
                    "Priority Support",
                    "API Access",
                  ],
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  features: [
                    "Custom Solutions",
                    "Dedicated Account Manager",
                    "24/7 Support",
                    "On-Premise Deployment",
                  ],
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-semibold mb-2 text-blue-300">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold text-white mb-6">
                    {plan.price}
                  </p>
                  <ul className="text-gray-400 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="mb-2 flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Choose Plan
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-gray-800 relative">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              What Our Clients Say
            </h2>
            <div className="max-w-4xl mx-auto">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900 p-8 rounded-lg text-center"
              >
                <p className="text-xl text-gray-300 mb-4">
                  "{testimonials[currentTestimonial].content}"
                </p>
                <p className="text-blue-400 font-semibold">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-500">
                  {testimonials[currentTestimonial].role}
                </p>
              </motion.div>
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentTestimonial
                        ? "bg-blue-500"
                        : "bg-gray-600"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Ready to Get Started?
                </h2>
                <p className="text-gray-300 mb-8">
                  Join thousands of satisfied users and experience the future of
                  document management today.
                </p>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up Now
                </Button>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="DecentralDocs Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg">
                  <p className="font-bold">30-Day Free Trial</p>
                  <p className="text-sm">No credit card required</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-800 relative">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Get in Touch
            </h2>
            <motion.div
              className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-blue-300">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-blue-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 text-blue-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                DecentralDocs
              </h3>
              <p className="text-gray-500">
                Secure, efficient, and decentralized document management for the
                modern world.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-gray-400 hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-blue-400">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-4">
                Connect
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} DecentralDocs. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
