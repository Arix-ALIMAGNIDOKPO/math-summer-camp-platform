
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MscLogo } from "@/components/ui-custom/MscLogo";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin - Summer Maths Camp";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 shadow-lg">
        <div className="flex justify-center mb-6">
          <MscLogo />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Admin Portal</h1>
        
        <p className="text-gray-600 mb-8 text-center">
          The admin portal is accessible directly through the Flask backend. Please use the buttons below to access it.
        </p>
        
        <div className="space-y-4">
          <Button className="w-full" asChild>
            <a href="/admin/login" target="_blank" rel="noopener noreferrer">Access Admin Portal</a>
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <a href="/" className="w-full">Return to Homepage</a>
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p className="text-center">
            For help with the admin interface, please refer to the documentation in the backend directory.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Admin;
