import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MscLogo } from "@/components/ui-custom/MscLogo";
import { toast } from "sonner";
import { Eye, Users, UserCheck, UserX, Clock } from "lucide-react";

interface Application {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  age: string;
  niveau: string;
  ecole: string;
  ville: string;
  departement: string;
  commune: string;
  motivation: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Identifiants admin
  const ADMIN_USERNAME = "admin_smc";
  const ADMIN_PASSWORD = "SMC2025@Admin";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      loadApplications();
      toast.success("Connexion réussie !");
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      // Simulation des données - en production, ceci ferait un appel API
      const mockApplications: Application[] = [
        {
          id: "APP001",
          prenom: "Marie",
          nom: "ADJOVI",
          email: "marie.adjovi@email.com",
          telephone: "+22997123456",
          age: "16",
          niveau: "premiere",
          ecole: "CEG Sainte Rita",
          ville: "Cotonou",
          departement: "Littoral",
          commune: "Cotonou",
          motivation: "Je suis passionnée par les mathématiques depuis mon enfance. Participer à ce camp me permettrait d'approfondir mes connaissances et de rencontrer d'autres jeunes partageant la même passion.",
          status: "pending",
          submittedAt: "2024-12-20T10:30:00Z"
        },
        {
          id: "APP002",
          prenom: "Jean",
          nom: "KOUDJO",
          email: "jean.koudjo@email.com",
          telephone: "+22996654321",
          age: "17",
          niveau: "terminale",
          ecole: "Lycée Mathieu Bouké",
          ville: "Parakou",
          departement: "Borgou",
          commune: "Parakou",
          motivation: "Les mathématiques sont ma matière préférée. Je souhaite améliorer mes compétences en résolution de problèmes et découvrir de nouvelles approches pédagogiques.",
          status: "accepted",
          submittedAt: "2024-12-19T14:15:00Z"
        }
      ];
      setApplications(mockApplications);
    } catch (error) {
      toast.error("Erreur lors du chargement des candidatures");
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = (id: string, newStatus: 'pending' | 'accepted' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    if (selectedApplication?.id === id) {
      setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null);
    }
    toast.success("Statut mis à jour avec succès");
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 shadow-lg">
          <div className="flex justify-center mb-6">
            <MscLogo />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Administration</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Identifiants de connexion :</h3>
            <p className="text-sm"><strong>Utilisateur :</strong> admin_smc</p>
            <p className="text-sm"><strong>Mot de passe :</strong> SMC2025@Admin</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <MscLogo />
            <h1 className="text-xl font-semibold">Administration - Summer Maths Camp</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsLoggedIn(false)}
          >
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold">{stats.accepted}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des candidatures */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Candidatures d'inscription</h2>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    Toutes
                  </Button>
                  <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('pending')}
                  >
                    En attente
                  </Button>
                  <Button
                    variant={filter === 'accepted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('accepted')}
                  >
                    Acceptées
                  </Button>
                  <Button
                    variant={filter === 'rejected' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('rejected')}
                  >
                    Rejetées
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedApplication?.id === app.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedApplication(app)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{app.prenom} {app.nom}</h3>
                          <p className="text-sm text-gray-600">{app.email}</p>
                          <p className="text-sm text-gray-600">{app.ecole} - {app.ville}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {app.status === 'pending' ? 'En attente' :
                             app.status === 'accepted' ? 'Acceptée' : 'Rejetée'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredApplications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune candidature trouvée
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Détails de la candidature */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Détails de la candidature</h2>
              
              {selectedApplication ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedApplication.prenom} {selectedApplication.nom}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {selectedApplication.id}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{selectedApplication.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Téléphone</Label>
                      <p className="text-sm">{selectedApplication.telephone}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium">Âge</Label>
                        <p className="text-sm">{selectedApplication.age} ans</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Niveau</Label>
                        <p className="text-sm">{selectedApplication.niveau}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">École</Label>
                      <p className="text-sm">{selectedApplication.ecole}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Localisation</Label>
                      <p className="text-sm">{selectedApplication.ville}, {selectedApplication.commune}, {selectedApplication.departement}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Motivation</Label>
                      <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.motivation}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium mb-3 block">Actions</Label>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        variant={selectedApplication.status === 'accepted' ? 'default' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'accepted')}
                      >
                        Accepter
                      </Button>
                      <Button
                        className="w-full"
                        variant={selectedApplication.status === 'pending' ? 'default' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'pending')}
                      >
                        Mettre en attente
                      </Button>
                      <Button
                        className="w-full"
                        variant={selectedApplication.status === 'rejected' ? 'destructive' : 'outline'}
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                      >
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez une candidature pour voir les détails</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;