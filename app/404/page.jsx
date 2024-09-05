/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Custom404 = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-white text-9xl font-bold opacity-5"
              style={{
                transform: `translate(${position.x / 50}px, ${position.y / 50}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              404
            </div>
          </div>
          <div className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 mb-6 mx-auto animate-spin rounded-full border-4 border-yellow-300 border-t-transparent"></div>
            <h1 className="text-4xl font-bold text-center text-white mb-4">Oops! Page Not Found</h1>
            <p className="text-xl text-center text-gray-200 mb-8">
              The page you're looking for seems to have wandered off. Don't worry, even URLs get lost sometimes!
            </p>
            <div className="flex justify-center">
              <Link 
                href="/"
                className="flex items-center justify-center px-6 py-3 bg-yellow-400 text-indigo-900 rounded-full font-semibold text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Return Home
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-300 text-sm">
            Lost? Try moving your mouse around to reveal a hidden surprise!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Custom404;