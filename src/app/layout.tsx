"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script"; // Import Script
import "bootstrap/dist/css/bootstrap.min.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply the dark theme class to the body if darkMode is true
    if (darkMode) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Blogs App</title>
      </head>
      <body>
        <div className="container">
          <header className="p-4 theme-header bg-dark text-white d-flex justify-content-between align-items-center">
            <nav className="navbar navbar-expand-lg navbar-dark">
              <div className="container-fluid">
                <Link href="/" className="navbar-brand">
                  My Blog
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link href="/" className="nav-link">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/auth/login" className="nav-link">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/auth/register" className="nav-link">
                        Register
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/reels" className="nav-link">
                        Reels
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="btn btn-secondary"
              aria-label="Toggle Theme"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </header>
          <main className="my-4">{children}</main>
          <footer className="p-4 bg-dark text-white text-center">
            <p>&copy; {new Date().getFullYear()} My Blog. All Rights Reserved.</p>
          </footer>
        </div>
        {/* Load Bootstrap JS asynchronously */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
};

export default Layout;
