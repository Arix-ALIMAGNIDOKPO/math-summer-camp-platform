
import { useState } from "react";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const GallerySection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"photos" | "testimonials">("photos");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = [
    "/lovable-uploads/10ab2c29-0f72-48ed-871e-70a11a3be8eb.png",
    "/lovable-uploads/13bde48a-7d5b-42ef-91b9-6637a3f1c3d0.png",
    "/lovable-uploads/c018bef3-11b7-4093-8655-bd69a0c42e7a.png",
    "/lovable-uploads/cff6e0db-4df1-4dd2-a8b0-7760fdf64453.png",
    "/lovable-uploads/3fda7fed-05f4-4b51-970c-efa21b12bad5.png",
    "/lovable-uploads/576b90e4-cbe6-42b5-8580-8f5101bad43d.png",
    "/lovable-uploads/abeeae78-d165-44ce-8b1f-81e305d6dbcb.png",
  ];

  const testimonials = [
    {
      quote: t("gallery.testimonial1.quote"),
      author: t("gallery.testimonial1.author"),
      image: "/lovable-uploads/10ab2c29-0f72-48ed-871e-70a11a3be8eb.png",
    },
    {
      quote: t("gallery.testimonial2.quote"),
      author: t("gallery.testimonial2.author"),
      image: "/lovable-uploads/c018bef3-11b7-4093-8655-bd69a0c42e7a.png",
    },
    {
      quote: t("gallery.testimonial3.quote"),
      author: t("gallery.testimonial3.author"),
      image: "/lovable-uploads/3fda7fed-05f4-4b51-970c-efa21b12bad5.png",
    },
  ];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section id="gallery" className="section-padding bg-gray-50 relative overflow-hidden">
      <div className="gradient-blur left-1/4 top-1/4" />
      
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">{t("gallery")}</Chip>
          <h2 className="heading-lg mb-6">{t("gallery.title")}</h2>
          <p className="subheading">
            {t("gallery.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab("photos")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === "photos" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-200/50"
              )}
            >
              {t("gallery.photos")}
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === "testimonials" 
                  ? "bg-white shadow-sm" 
                  : "hover:bg-gray-200/50"
              )}
            >
              {t("gallery.testimonials")}
            </button>
          </div>
        </div>
        
        {activeTab === "photos" ? (
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((src, index) => (
                <div 
                  key={index} 
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={src} 
                    alt={t("gallery.image.alt", { index: index + 1 })} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ) : (
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-md overflow-hidden flex flex-col">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <blockquote className="italic text-muted-foreground mb-4 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    <p className="text-sm font-semibold">{testimonial.author}</p>
                  </div>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
      
      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleryImages[selectedImageIndex]} 
              alt={t("gallery.preview")}
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />
            
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                className="bg-black/50 border-0 text-white hover:bg-black/75 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length
                  );
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Button>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                className="bg-black/50 border-0 text-white hover:bg-black/75 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex + 1) % galleryImages.length
                  );
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
