// src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function PortfolioPage() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(-1); // For the lightbox

  useEffect(() => {
    // This is the ID for your main portfolio Flickr Album
    const albumId = "72177720327835516"; // Replace if you have a different main album

    fetch(`/.netlify/functions/get-flickr-album?album_id=${albumId}`)
      .then(res => res.json())
      .then(data => {
        setPhotos(data.map(url => ({ src: url }))); // Format for lightbox
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch Flickr album:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="container mx-auto px-6 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">Our Full Portfolio</h1>
        <p className="text-xl text-gray-600">
          Explore our complete collection. Click on any image to see it in full detail.
        </p>
      </section>

      {isLoading ? (
        <p className="text-center text-xl">Loading Gallery...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div 
              key={i} 
              className="rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={() => setIndex(i)}
            >
              <img src={photo.src} alt={`Portfolio image ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
      />
    </main>
  );
}

export default PortfolioPage;