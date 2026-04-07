import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Heart } from 'lucide-react';

// Configuration
const FOLDER_ID = '16UOlg8U1J60ksb_rLsLXTuct4UiUCifT';
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

interface DriveFile {
  id: string;
  name: string;
}

export default function App() {
  const [images, setImages] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        setError('Google Drive API Key is missing. Please check the instructions.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&key=${API_KEY}&fields=files(id,name)&pageSize=50`
        );
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'Failed to fetch images');
        }

        const data = await response.json();
        setImages(data.files || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const getDriveUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

  return (
    <div className="min-h-screen bg-romantic-bg text-romantic-text font-sans selection:bg-romantic-accent selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-romantic-bg/80 backdrop-blur-md z-50 border-b border-romantic-accent/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif italic font-bold tracking-tight text-romantic-accent">
            Sahil & Kabita
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest">
            <a href="#" className="hover:text-romantic-accent transition-colors">Home</a>
            <a href="#" className="hover:text-romantic-accent transition-colors">About</a>
            <a href="#" className="hover:text-romantic-accent transition-colors text-romantic-accent">Gallery</a>
            <a href="#" className="hover:text-romantic-accent transition-colors">Contact</a>
          </div>

          <button 
            className="p-2 hover:bg-romantic-accent/5 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="text-romantic-accent" /> : <Menu className="text-romantic-accent" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-romantic-bg z-40 pt-24 px-6 flex flex-col gap-8 text-3xl font-serif font-bold italic text-romantic-accent"
          >
            <a href="#" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <header className="mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-romantic-accent/5 text-[10px] font-bold uppercase tracking-widest mb-6 text-romantic-accent border border-romantic-accent/10">
            Since 2021
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none text-romantic-accent">
              Our Beautiful<br />Journey
            </h1>
            <p className="max-w-md text-lg text-romantic-text/70 leading-relaxed italic">
              A collection of our favorite memories. Through all the sweet moments, the silly fights, and endless love, every picture tells our story.
            </p>
          </div>
        </header>

        {/* Gallery Grid */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-romantic-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-center">
            <p className="font-bold mb-2">Error Loading Gallery</p>
            <p className="text-sm opacity-80 mb-6">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {images.map((img, index) => {
              const spanClass = 
                index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : 
                index % 7 === 1 ? 'md:col-span-2 md:row-span-1' : 
                index % 7 === 3 ? 'md:col-span-1 md:row-span-2' : 
                'md:col-span-1 md:row-span-1';

              return (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  className={`${spanClass} relative group cursor-pointer overflow-hidden rounded-2xl bg-romantic-accent/5`}
                  onClick={() => setSelectedImage(img.id)}
                >
                  <img
                    src={getDriveUrl(img.id)}
                    alt={img.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-romantic-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                      <Heart className="text-romantic-accent fill-romantic-accent" size={20} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-romantic-text/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={getDriveUrl(selectedImage)}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border-4 border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-romantic-accent/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-sm text-romantic-text/50 text-center">
          <p className="font-serif italic text-lg text-romantic-accent">Made with love by Sahil for Kabita | Forever playing our tune, Kausi love.</p>
          <p>© 2026 Sahil & Kabita. All our memories.</p>
        </div>
      </footer>
    </div>
  );
}
