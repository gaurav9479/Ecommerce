import React from "react";
import { Link } from "react-router-dom";
import ProductList from "./Products/Productlist";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-soft"></div>
        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-slideUp">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Welcome to{" "}
              <span className="gradient-text">GLIPKART</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Discover premium electronics and gadgets at unbeatable prices.
              Your one-stop shop for all things tech.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/products" className="btn-primary">
                Shop Now
                <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/products?featured=true" className="btn-outline">
                View Featured
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-12">
              {[
                { label: "Products", value: "500+" },
                { label: "Happy Customers", value: "10K+" },
                { label: "Reviews", value: "4.8★" },
                { label: "Fast Delivery", value: "2 Days" }
              ].map((stat, index) => (
                <div key={index} className="glass rounded-xl p-4 hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-900/50 py-4">
        <ProductList featured={true} count={8} title="⭐ Featured Products" />
      </section>

      {/* Categories Section */}
      <section className="container-custom section-padding">
        <h2 className="text-3xl font-bold gradient-text mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Smartphones", icon: "📱", color: "from-blue-500 to-cyan-500" },
            { name: "Laptops", icon: "💻", color: "from-purple-500 to-pink-500" },
            { name: "Headphones", icon: "🎧", color: "from-green-500 to-teal-500" },
            { name: "Cameras", icon: "📷", color: "from-orange-500 to-red-500" },
          ].map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.name.toLowerCase()}`}
              className="group"
            >
              <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className={`text-lg font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container-custom section-padding bg-slate-800/30 rounded-3xl my-12">
        <h2 className="text-3xl font-bold gradient-text mb-12 text-center">Why Choose GLIPKART?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🚚",
              title: "Fast Delivery",
              description: "Get your orders delivered within 2-3 business days across India."
            },
            {
              icon: "🔒",
              title: "Secure Payments",
              description: "Shop with confidence using our encrypted payment gateway."
            },
            {
              icon: "💯",
              title: "Quality Guaranteed",
              description: "All products are 100% authentic with manufacturer warranty."
            }
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-4 group">
              <div className="text-6xl group-hover:scale-110 transition-transform inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section>
        <ProductList count={12} title="Latest Arrivals" />
      </section>

      {/* Newsletter Section */}
      <section className="container-custom section-padding">
        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Stay Updated!
          </h2>
          <p className="text-slate-300 mb-8">
            Subscribe to our newsletter and get exclusive deals and updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
