import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar/Navbar';
import Hero from '../Hero/Hero';
import './Home.css';

const Home = () => {
  return (
    <div id="main">
      <Navbar />
      <Hero />
      <footer className="footer">
        <p>
          Made with <span className="emoji">❤️</span> by{' '}
          <a href="https://www.linkedin.com/in/konain-raza-" target="_blank">
            Konain Raza
          </a>
        </p>
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Home;
