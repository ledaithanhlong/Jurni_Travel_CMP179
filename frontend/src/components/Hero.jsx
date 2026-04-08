import React from 'react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-blue-500 text-white">
      <div className="p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm">Discover your next trip</h1>
        <p className="mt-2 opacity-90 max-w-2xl">Hotels, flights, car rentals and activities at the best prices.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href="/hotels" className="bg-white/95 text-sky-700 px-4 py-2 rounded shadow hover:bg-white">Search Hotels</a>
          <a href="/flights" className="bg-white/10 backdrop-blur px-4 py-2 rounded border border-white/30 hover:bg-white/20">Find Flights</a>
          <a href="/cars" className="bg-white/10 backdrop-blur px-4 py-2 rounded border border-white/30 hover:bg-white/20">Rent Cars</a>
        </div>
      </div>
      <div className="absolute -right-16 -bottom-16 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/10" />
    </div>
  );
}


