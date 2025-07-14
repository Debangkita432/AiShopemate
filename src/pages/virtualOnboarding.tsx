import React, { useState } from 'react';

const productOverlays = [
  { name: 'Glasses' },
  { name: 'Lipstick' },
  { name: 'Earrings' },
];

const VirtualOnboarding: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(productOverlays[0]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const resetAll = () => {
    setImage(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#0071ce] mb-2 text-center">Virtual Try On</h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
          Try on products virtually before you buy. Select a product, then upload your selfie!
        </p>
        {/* Product selector */}
        <div className="w-full overflow-x-auto flex gap-6 mb-8 py-2 px-2 scrollbar-thin scrollbar-thumb-gray-300">
          {productOverlays.map((product) => (
            <button
              key={product.name}
              className={`flex flex-col items-center px-6 py-4 rounded-xl border-2 transition shadow-sm min-w-[120px] text-lg font-bold ${selectedProduct.name === product.name ? 'border-[#ffc220] bg-yellow-50 scale-105' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
              onClick={() => setSelectedProduct(product)}
            >
              <span className="mb-2">{product.name}</span>
            </button>
          ))}
        </div>
        {/* Try-on area */}
        <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
          {/* Controls */}
          <div className="flex flex-col gap-4 items-center w-full md:w-1/3">
            <button
              className="bg-[#ffc220] text-white font-semibold px-6 py-3 rounded-full shadow hover:shadow-lg transition w-full"
              onClick={resetAll}
              disabled={!image}
            >
              Try Another Photo
            </button>
            <label className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="upload-selfie"
              />
              <span className="block w-full bg-[#ffc220] text-white font-semibold px-6 py-3 rounded-full shadow hover:shadow-lg transition text-center cursor-pointer">
                Upload Selfie
              </span>
            </label>
          </div>
          {/* Try-on preview */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[90vw] max-w-[400px] h-[400px] bg-gray-200 rounded-2xl shadow-inner flex items-center justify-center overflow-hidden">
              {/* Loading */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                  <span className="text-[#0071ce] font-bold text-xl animate-pulse">Loading...</span>
                </div>
              )}
              {/* Uploaded image */}
              {image && !loading && (
                <img
                  src={image}
                  alt="Selfie"
                  className="w-full h-full object-cover rounded-2xl absolute"
                />
              )}
              {/* Overlay product name (centered, large, semi-transparent) */}
              {image && !loading && selectedProduct && (
                <span
                  className="absolute left-1/2 top-1/2 text-4xl md:text-5xl -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70 font-extrabold text-[#0071ce] drop-shadow-lg select-none"
                  style={{ zIndex: 10 }}
                >
                  {selectedProduct.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualOnboarding; 