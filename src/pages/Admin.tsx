import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MscLogo } from "@/components/ui-custom/MscLogo";
import { Users, Download, Eye, Calendar, Mail, Phone, GraduationCap, MessageSquare, User, MapPin, School } from "lucide-react";
import { Trash2 } from "lucide-react";
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

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

interface LoginForm {
  username: string;
  password: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [studentFilter, setStudentFilter] = useState('all');
  const [messageFilter, setMessageFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    document.title = "Admin - Summer Maths Camp";
    
    // Test API connectivity on component mount
    const testAPI = async () => {
      try {
        console.log('Testing API connectivity...');
        const response = await fetch('https://math-summer-camp-platform-backend.onrender.com/api/health');
        const data = await response.json();
        console.log('API Health Check:', data);
      } catch (error) {
        console.error('API connectivity test failed:', error);
      }
    };
    
    testAPI();

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
    setStudents([]);
    setMessages([]);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading data from API...');
      
      // Load students
      try {
        const studentsResponse = await fetch('https://math-summer-camp-platform-backend.onrender.com/api/students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        console.log('Students response status:', studentsResponse.status);
        
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          console.log('Students data loaded:', studentsData.length, 'students');
          setStudents(Array.isArray(studentsData) ? studentsData : []);
        } else {
          console.error('Failed to load students:', studentsResponse.status, studentsResponse.statusText);
          const errorText = await studentsResponse.text();
          console.error('Students error response:', errorText);
          setStudents([]);
        }
      } catch (studentsError) {
        console.error('Error loading students:', studentsError);
        setStudents([]);
      }

      // Load messages
      try {
        const messagesResponse = await fetch('https://math-summer-camp-platform-backend.onrender.com/api/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        console.log('Messages response status:', messagesResponse.status);
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          console.log('Messages data loaded:', messagesData.length, 'messages');
          setMessages(Array.isArray(messagesData) ? messagesData : []);
        } else {
          console.error('Failed to load messages:', messagesResponse.status, messagesResponse.statusText);
          const errorText = await messagesResponse.text();
          console.error('Messages error response:', errorText);
          setMessages([]);
        }
      } catch (messagesError) {
        console.error('Error loading messages:', messagesError);
        setMessages([]);
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
      console.log('Updating student status:', studentId, 'to', newStatus);
      
      const response = await fetch(`https://math-summer-camp-platform-backend.onrender.com/api/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Update status response:', response.status);
      if (response.ok) {
        await loadData();
        toast.success("Statut mis à jour avec succès");
        setSelectedStudent(null);
      } else {
        const errorText = await response.text();
        console.error('Update status error:', response.status, errorText);
        toast.error(`Erreur lors de la mise à jour: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) {
      return;
    }

    try {
      console.log('Deleting student:', studentId);
      const response = await fetch(`https://math-summer-camp-platform-backend.onrender.com/api/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete student response status:', response.status);
      
      if (response.ok) {
        await loadData();
        toast.success("Inscription supprimée avec succès");
        setSelectedStudent(null);
      } else {
        const errorText = await response.text();
        console.error('Delete student error:', response.status, errorText);
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      console.log('Updating message status:', messageId, 'to', newStatus);
      
      const response = await fetch(`https://math-summer-camp-platform-backend.onrender.com/api/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Update message status response:', response.status);
      if (response.ok) {
        await loadData();
        toast.success("Statut du message mis à jour");
        setSelectedMessage(null);
      } else {
        const errorText = await response.text();
        console.error('Update message status error:', response.status, errorText);
        toast.error(`Erreur lors de la mise à jour: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    try {
      console.log('Deleting message:', messageId);
      const response = await fetch(`https://math-summer-camp-platform-backend.onrender.com/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete message response status:', response.status);
      
      if (response.ok) {
        await loadData();
        toast.success("Message supprimé avec succès");
        setSelectedMessage(null);
      } else {
        const errorText = await response.text();
        console.error('Delete message error:', response.status, errorText);
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const exportToExcel = async () => {
    try {
      console.log('Starting export...');
      
      const response = await fetch('https://math-summer-camp-platform-backend.onrender.com/api/export/students', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
      
      console.log('Export response status:', response.status);
      
      if (response.ok) {
        const blob = await response.blob();
        console.log('Export blob size:', blob.size);
        
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
        const errorText = await response.text();
        console.error('Export error:', response.status, errorText);
        toast.error(`Erreur lors de l'export: ${errorText}`);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error(`Erreur lors de l'export: ${error.message}`);
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

  const getMessageStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { variant: "destructive", label: "Nouveau" },
      read: { variant: "secondary", label: "Lu" },
      replied: { variant: "default", label: "Répondu" }
    };

    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getInterestLabel = (interest: string) => {
    const labels: Record<string, string> = {
      participant: "Participant",
      parent: "Parent",
      intervenant: "Intervenant",
      partenaire: "Partenaire"
    };
    return labels[interest] || interest;
  };

  const filteredStudents = students.filter(student => 
    studentFilter === 'all' || student.status === studentFilter
  );

  const filteredMessages = messages.filter(message => 
    messageFilter === 'all' || message.status === messageFilter
  );

  const stats = {
    totalStudents: students.length,
    pendingStudents: students.filter(s => s.status === 'pending').length,
    confirmedStudents: students.filter(s => s.status === 'confirmed').length,
    rejectedStudents: students.filter(s => s.status === 'rejected').length,
    totalMessages: messages.length,
    newMessages: messages.filter(m => m.status === 'new').length,
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
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                  {stats.newMessages > 0 && (
                    <p className="text-xs text-red-600">{stats.newMessages} nouveaux</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Inscriptions ({stats.totalStudents})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages ({stats.totalMessages})
              {stats.newMessages > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {stats.newMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
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
                          <TableHead className="min-w-[150px]">Actions</TableHead>
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
                              <div className="flex gap-2">
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
                                  <DialogContent className="max-w-4xl max-h-[90vh]">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        {selectedStudent?.prenom} {selectedStudent?.nom}
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedStudent && (
                                      <ScrollArea className="max-h-[70vh] pr-4">
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <Card className="p-4">
                                              <div className="flex items-center gap-2 mb-3">
                                                <User className="h-4 w-4 text-blue-600" />
                                                <Label className="text-sm font-semibold">Informations personnelles</Label>
                                              </div>
                                              <div className="space-y-3 text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Email:</span>
                                                  <span className="break-all">{selectedStudent.email}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Téléphone:</span>
                                                  <span>{selectedStudent.telephone}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Âge:</span>
                                                  <span>{selectedStudent.age} ans</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Niveau:</span>
                                                  <span className="capitalize">{selectedStudent.niveau}</span>
                                                </div>
                                              </div>
                                            </Card>

                                            <Card className="p-4">
                                              <div className="flex items-center gap-2 mb-3">
                                                <MapPin className="h-4 w-4 text-green-600" />
                                                <Label className="text-sm font-semibold">Localisation</Label>
                                              </div>
                                              <div className="space-y-3 text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Ville:</span>
                                                  <span>{selectedStudent.ville}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Département:</span>
                                                  <span>{selectedStudent.departement}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Commune:</span>
                                                  <span>{selectedStudent.commune}</span>
                                                </div>
                                              </div>
                                            </Card>

                                            <Card className="p-4">
                                              <div className="flex items-center gap-2 mb-3">
                                                <School className="h-4 w-4 text-purple-600" />
                                                <Label className="text-sm font-semibold">Établissement</Label>
                                              </div>
                                              <div className="space-y-3 text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">École:</span>
                                                  <span>{selectedStudent.ecole}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <span className="font-medium">Inscription:</span>
                                                  <span>{new Date(selectedStudent.registeredAt).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                              </div>
                                            </Card>

                                            <Card className="p-4">
                                              <div className="flex items-center gap-2 mb-3">
                                                <Calendar className="h-4 w-4 text-orange-600" />
                                                <Label className="text-sm font-semibold">Statut</Label>
                                              </div>
                                              <div className="space-y-3">
                                                <div>{getStatusBadge(selectedStudent.status)}</div>
                                                <div className="flex flex-wrap gap-2">
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
                                            </Card>
                                          </div>
                                          
                                          <Card className="p-4">
                                            <Label className="text-sm font-semibold mb-3 block">Lettre de motivation</Label>
                                            <ScrollArea className="h-32 w-full rounded border p-3 bg-gray-50">
                                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {selectedStudent.motivation}
                                              </p>
                                            </ScrollArea>
                                          </Card>

                                          <div className="flex flex-wrap gap-2 pt-4 border-t">
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
                                            <Button 
                                              variant="destructive" 
                                              size="sm"
                                              onClick={() => deleteStudent(selectedStudent.id)}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Supprimer
                                            </Button>
                                          </div>
                                        </div>
                                      </ScrollArea>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteStudent(student.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Messages de contact</CardTitle>
                  <Select value={messageFilter} onValueChange={setMessageFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filtrer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="new">Nouveaux</SelectItem>
                      <SelectItem value="read">Lus</SelectItem>
                      <SelectItem value="replied">Répondus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Chargement des messages...</div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {messageFilter === 'all' ? 'Aucun message trouvé' : `Aucun message ${messageFilter === 'new' ? 'nouveau' : messageFilter === 'read' ? 'lu' : 'répondu'} trouvé`}
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Intérêt</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.name}</TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{getInterestLabel(message.interest)}</TableCell>
                          <TableCell>{new Date(message.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{getMessageStatusBadge(message.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedMessage(message)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <MessageSquare className="h-5 w-5" />
                                      Message de {selectedMessage?.name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedMessage && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Informations de contact</Label>
                                          <div className="mt-2 space-y-1 text-sm">
                                            <p><strong>Email:</strong> {selectedMessage.email}</p>
                                            {selectedMessage.phone && (
                                              <p><strong>Téléphone:</strong> {selectedMessage.phone}</p>
                                            )}
                                            <p><strong>Intérêt:</strong> {getInterestLabel(selectedMessage.interest)}</p>
                                            <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Statut</Label>
                                          <div className="mt-2 space-y-2">
                                            <div>{getMessageStatusBadge(selectedMessage.status)}</div>
                                            <div className="flex flex-wrap gap-1">
                                              <Button 
                                                size="sm" 
                                                variant={selectedMessage.status === 'new' ? 'default' : 'outline'}
                                                onClick={() => updateMessageStatus(selectedMessage.id, 'new')}
                                              >
                                                Nouveau
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={selectedMessage.status === 'read' ? 'default' : 'outline'}
                                                onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                                              >
                                                Lu
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={selectedMessage.status === 'replied' ? 'default' : 'outline'}
                                                onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                                              >
                                                Répondu
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label className="text-sm font-medium">Message</Label>
                                        <ScrollArea className="h-32 w-full rounded border p-3 bg-gray-50 mt-2">
                                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedMessage.message}
                                          </p>
                                        </ScrollArea>
                                      </div>

                                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={`mailto:${selectedMessage.email}?subject=Re: Votre message concernant le Summer Maths Camp`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Répondre
                                          </a>
                                        </Button>
                                        {selectedMessage.phone && (
                                          <Button variant="outline" size="sm" asChild>
                                            <a href={`tel:${selectedMessage.phone}`}>
                                              <Phone className="h-4 w-4 mr-2" />
                                              Appeler
                                            </a>
                                          </Button>
                                        )}
                                        <Button 
                                          variant="destructive" 
                                          size="sm"
                                          onClick={() => deleteMessage(selectedMessage.id)}
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Supprimer
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteMessage(message.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;