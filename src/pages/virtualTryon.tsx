import React from 'react';

const VirtualTryOn = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-extrabold text-[#0071DC] mb-2">Virtual Try On</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Try on products virtually before you buy. Upload your selfie and a product image to get started.
      </p>

      <div className="w-full max-w-screen-xl">
        <iframe
          src="http://localhost:8501"
          title="Walmart Virtual Try-On"
          className="w-full h-[850px] rounded-xl border-2 border-[#FFC220] shadow-lg"
        />
      </div>
    </div>
  );
};

export default VirtualTryOn;
