
import { useState } from "react";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const GallerySection = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = [
    "/lovable-uploads/56d44f87-ea9a-4216-843a-ce33f1a71d56.png",
    "/lovable-uploads/96f366bf-9171-465d-b3ac-c4ecafee7c2c.png",
    "/lovable-uploads/7522ded7-e67e-492a-849f-061bd5289354.png",
    "/lovable-uploads/86a866cd-2f9b-4f2b-8673-02416547a832.png",
    "/lovable-uploads/5f042cb2-0d95-4f15-9668-a724a29e8982.png",
    "/lovable-uploads/f77bd2f7-64b2-432b-a419-9e108afe5cb0.png"
  ];

  const testimonials = [
    {
      quote: t("gallery.testimonial1.quote"),
      author: t("gallery.testimonial1.author"),
      image: "/lovable-uploads/56d44f87-ea9a-4216-843a-ce33f1a71d56.png",
    },
    {
      quote: t("gallery.testimonial2.quote"),
      author: t("gallery.testimonial2.author"),
      image: "/lovable-uploads/96f366bf-9171-465d-b3ac-c4ecafee7c2c.png",
    },
    {
      quote: t("gallery.testimonial3.quote"),
      author: t("gallery.testimonial3.author"),
      image: "/lovable-uploads/7522ded7-e67e-492a-849f-061bd5289354.png",
    }
  ];

  return (
    <section id="gallery" className="section-padding bg-white relative">
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">{t("gallery")}</Chip>
          <h2 className="heading-lg mb-6">{t("gallery.title")}</h2>
          <p className="subheading">
            {t("gallery.subtitle")}
          </p>
        </AnimatedSection>
        
        <AnimatedSection>
          <Tabs defaultValue="photos" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="photos" className="text-sm rounded-full data-[state=active]:bg-primary">{t("gallery.photos")}</TabsTrigger>
                <TabsTrigger value="testimonials" className="text-sm rounded-full data-[state=active]:bg-primary">{t("gallery.testimonials")}</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="photos" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div 
                    key={index}
                    className="aspect-square relative group overflow-hidden rounded-xl shadow-md cursor-pointer"
                    onClick={() => setSelectedImage(photo)}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </div>
                    <img 
                      src={photo} 
                      alt={t("gallery.image.alt", { index: index + 1 })} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <AnimatedSection 
                    key={index} 
                    delay={index * 100} 
                    className="glass-effect rounded-xl p-6 relative"
                  >
                    <div className="absolute -top-6 left-6 w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pt-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30 mb-4">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                      </svg>
                      <p className="text-sm italic mb-4">{testimonial.quote}</p>
                      <p className="text-xs font-medium">{testimonial.author}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </AnimatedSection>
      </div>
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className={cn("max-w-5xl bg-transparent border-0 shadow-none", isMobile ? "p-2" : "")}>
          <div className="relative w-full">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt={t("gallery.preview")} 
                className="w-full h-full object-contain rounded-lg shadow-xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
