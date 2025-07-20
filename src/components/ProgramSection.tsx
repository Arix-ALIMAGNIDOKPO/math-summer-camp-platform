import React from 'react';
import { AnimatedSection } from './ui-custom/AnimatedSection';

export const ProgramSection: React.FC = () => {
  return (
    <AnimatedSection>
      <section id="program" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Programme
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre programme détaillé
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Programme 1
              </h3>
              <p className="text-gray-600">
                Description du programme
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Programme 2
              </h3>
              <p className="text-gray-600">
                Description du programme
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Programme 3
              </h3>
              <p className="text-gray-600">
                Description du programme
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};