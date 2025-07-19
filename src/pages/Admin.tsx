import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MscLogo } from "@/components/ui-custom/MscLogo";
import { Users, Download, Eye, Calendar, Mail, Phone, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  age: number;
  niveau: string;
  ecole: string;
  ville: string;
  departement: string;
  commune: string;
  motivation: string;
  registeredAt: string;
  status: 'pending' | 'confirmed' | 'rejected';
  statusUpdatedAt?: string;
}

interface LoginForm {
  username: string;
  password: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentFilter, setStudentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    document.title = "Admin - Summer Maths Camp";
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('admin_authenticated');
    const authTime = sessionStorage.getItem('auth_time');
    
    if (authStatus === 'true' && authTime) {
      const currentTime = Date.now();
      const sessionTime = parseInt(authTime);
      // Session expires after 2 hours
      if (currentTime - sessionTime < 2 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
        loadData();
      } else {
        handleLogout();
      }
    }

    // Check if blocked
    const blockTime = localStorage.getItem('admin_block_time');
    if (blockTime) {
      const currentTime = Date.now();
      const blockTimestamp = parseInt(blockTime);
      // Block for 15 minutes after 5 failed attempts
      if (currentTime - blockTimestamp < 15 * 60 * 1000) {
        setIsBlocked(true);
      } else {
        localStorage.removeItem('admin_block_time');
        localStorage.removeItem('login_attempts');
      }
    }

    const attempts = localStorage.getItem('login_attempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast.error("Accès bloqué. Veuillez réessayer plus tard.");
      return;
    }

    // Simple authentication - in production, this should be more secure
    if (loginForm.username === 'Admin25' && loginForm.password === 'SMCII') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('auth_time', Date.now().toString());
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('admin_block_time');
      setLoginAttempts(0);
      loadData();
      toast.success("Connexion réussie !");
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());
      
      if (newAttempts >= 5) {
        setIsBlocked(true);
        localStorage.setItem('admin_block_time', Date.now().toString());
        toast.error("Trop de tentatives échouées. Accès bloqué pour 15 minutes.");
      } else {
        toast.error(`Identifiants incorrects. ${5 - newAttempts} tentatives restantes.`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('auth_time');
    setStudents([]);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load students
      const studentsResponse = await fetch('http://localhost:5000/api/students');
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (studentId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await loadData();
        toast.success("Statut mis à jour avec succès");
        setSelectedStudent(null);
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export/students');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Export réussi !");
      } else {
        toast.error("Erreur lors de l'export");
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error("Erreur lors de l'export");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "En attente" },
      confirmed: { variant: "default", label: "Confirmée" },
      rejected: { variant: "destructive", label: "Rejetée" }
    };

    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredStudents = students.filter(student => 
    studentFilter === 'all' || student.status === studentFilter
  );

  const stats = {
    totalStudents: students.length,
    pendingStudents: students.filter(s => s.status === 'pending').length,
    confirmedStudents: students.filter(s => s.status === 'confirmed').length,
    rejectedStudents: students.filter(s => s.status === 'rejected').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <MscLogo className="mx-auto" />
            <div>
              <CardTitle className="text-2xl">Administration</CardTitle>
              <p className="text-muted-foreground">Summer Maths Camp</p>
            </div>
          </CardHeader>
          <CardContent>
            {isBlocked ? (
              <div className="text-center p-4">
                <p className="text-red-600 mb-4">Accès temporairement bloqué</p>
                <p className="text-sm text-muted-foreground">
                  Veuillez réessayer dans 15 minutes
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                    disabled={isBlocked}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isBlocked}
                  />
                </div>
                {loginAttempts > 0 && (
                  <p className="text-sm text-red-600">
                    {5 - loginAttempts} tentatives restantes
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={isBlocked}>
                  Se connecter
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MscLogo />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">Administration</h1>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Inscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmées</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmedStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejetées</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejectedStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Inscriptions des étudiants</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Select value={studentFilter} onValueChange={setStudentFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmées</SelectItem>
                    <SelectItem value="rejected">Rejetées</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportToExcel} variant="outline" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">ID</TableHead>
                      <TableHead className="min-w-[150px]">Nom complet</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[80px]">Âge</TableHead>
                      <TableHead className="min-w-[100px]">Niveau</TableHead>
                      <TableHead className="min-w-[120px]">Ville</TableHead>
                      <TableHead className="min-w-[100px]">Statut</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono text-sm">{student.id}</TableCell>
                        <TableCell className="font-medium">
                          {student.prenom} {student.nom}
                        </TableCell>
                        <TableCell className="break-all">{student.email}</TableCell>
                        <TableCell>{student.age} ans</TableCell>
                        <TableCell>{student.niveau}</TableCell>
                        <TableCell>{student.ville}</TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  {selectedStudent?.prenom} {selectedStudent?.nom}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedStudent && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Informations personnelles</Label>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <p><strong>Email:</strong> <span className="break-all">{selectedStudent.email}</span></p>
                                        <p><strong>Téléphone:</strong> {selectedStudent.telephone}</p>
                                        <p><strong>Âge:</strong> {selectedStudent.age} ans</p>
                                        <p><strong>Niveau:</strong> {selectedStudent.niveau}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Localisation</Label>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <p><strong>École:</strong> {selectedStudent.ecole}</p>
                                        <p><strong>Ville:</strong> {selectedStudent.ville}</p>
                                        <p><strong>Département:</strong> {selectedStudent.departement}</p>
                                        <p><strong>Commune:</strong> {selectedStudent.commune}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-sm font-medium">Motivation</Label>
                                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded">
                                      {selectedStudent.motivation}
                                    </p>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Changer le statut</Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Button 
                                        size="sm" 
                                        variant={selectedStudent.status === 'pending' ? 'default' : 'outline'}
                                        onClick={() => updateStudentStatus(selectedStudent.id, 'pending')}
                                      >
                                        En attente
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant={selectedStudent.status === 'confirmed' ? 'default' : 'outline'}
                                        onClick={() => updateStudentStatus(selectedStudent.id, 'confirmed')}
                                      >
                                        Confirmer
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant={selectedStudent.status === 'rejected' ? 'destructive' : 'outline'}
                                        onClick={() => updateStudentStatus(selectedStudent.id, 'rejected')}
                                      >
                                        Rejeter
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={`mailto:${selectedStudent.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                      </a>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={`tel:${selectedStudent.telephone}`}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Appeler
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;