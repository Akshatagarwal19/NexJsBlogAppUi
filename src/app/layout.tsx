import React from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles

interface LayoutProps {
  children: React.ReactNode; // Specify that children is of type ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Your website description goes here."
        />
        <title>Blogs App</title>
      </head>
      <body>
        <div className="container">
          <header className="p-4 bg-dark text-white">
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
                  </ul>
                </div>
              </div>
            </nav>
          </header>
          <main className="my-4">{children}</main>
          <footer className="p-4 bg-dark text-white text-center">
            <p>&copy; {new Date().getFullYear()} My Blog. All Rights Reserved.</p>
          </footer>
        </div>
        {/* Bootstrap JS for functionalities like dropdowns, modals, etc. */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
};

export default Layout;
