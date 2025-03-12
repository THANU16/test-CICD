import React from 'react';
import Image from 'next/image';

const FloatingImage = () => {
  return (
    <div className="relative transform-gpu">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/60 rounded-3xl blur-[200px] opacity-30 animate-pulse" />
      
      <div className="relative animate-float hover:animate-none transition-transform duration-300 hover:scale-105 bg-transparent rounded-2xl p-2">
        <Image
          src="/lycasim.png"
          alt="Logo"
          width={485}
          height={416}
          priority
          className="select-none drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default FloatingImage;