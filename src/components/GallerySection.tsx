
import { useState } from "react";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = [
    "https://images.unsplash.com/photo-1679669693237-74d556d6b5ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80",
    "https://images.unsplash.com/photo-1581288756149-518e6b0818b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
    "https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1629123355035-cbb93cb20a1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
  ];

  const testimonials = [
    {
      quote: "Ce camp a complètement transformé ma vision des mathématiques. J'ai découvert des concepts fascinants et fait des rencontres incroyables.",
      author: "Sophie M., 16 ans, participante 2024",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
    },
    {
      quote: "En tant qu'intervenant, j'ai été impressionné par la curiosité et le talent des jeunes participants. Une expérience enrichissante pour tous.",
      author: "Dr. Alexandre Laurent, Professeur de mathématiques",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    },
    {
      quote: "Mon fils est revenu du camp avec une nouvelle passion pour les mathématiques. Les activités variées et l'encadrement de qualité ont fait toute la différence.",
      author: "Corinne D., parent d'un participant",
      image: "https://images.unsplash.com/photo-1619335680874-59eb2f06356a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    }
  ];

  return (
    <section id="gallery" className="section-padding bg-white relative">
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">Galerie</Chip>
          <h2 className="heading-lg mb-6">Retours d'Expérience</h2>
          <p className="subheading">
            Découvrez les moments forts des éditions précédentes et les témoignages de nos participants, 
            intervenants et partenaires.
          </p>
        </AnimatedSection>
        
        <AnimatedSection>
          <Tabs defaultValue="photos" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="photos" className="text-sm rounded-full data-[state=active]:bg-primary">Photos</TabsTrigger>
                <TabsTrigger value="testimonials" className="text-sm rounded-full data-[state=active]:bg-primary">Témoignages</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="photos" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      alt={`Camp image ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials" className="mt-0">
              <div className="grid md:grid-cols-3 gap-8">
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
        <DialogContent className="max-w-5xl bg-transparent border-0 shadow-none">
          <div className="relative aspect-video w-full">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Gallery preview" 
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
