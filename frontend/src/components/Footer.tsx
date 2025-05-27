"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white h-12 flex items-center">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Campus connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
