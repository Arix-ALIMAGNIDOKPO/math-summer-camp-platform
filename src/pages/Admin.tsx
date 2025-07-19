import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MscLogo } from "@/components/ui-custom/MscLogo";
import { Users, MessageSquare, Download, Eye, Filter, Calendar, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
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
  phone?: string;
  interest: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [studentFilter, setStudentFilter] = useState('all');
  const [messageFilter, setMessageFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin - Summer Maths Camp";
    // Check if already authenticated
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, this should be more secure
    if (loginForm.username === 'Admin25' && loginForm.password === 'SMCII') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadData();
      toast.success("Connexion réussie !");
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setStudents([]);
    setMessages([]);
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

      // Load messages
      const messagesResponse = await fetch('http://localhost:5000/api/messages');
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
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

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await loadData();
        toast.success("Statut mis à jour avec succès");
        setSelectedMessage(null);
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const exportToExcel = async (type: 'students' | 'messages') => {
    try {
      const response = await fetch(`http://localhost:5000/api/export/${type}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  const getStatusBadge = (status: string, type: 'student' | 'message') => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "En attente" },
      confirmed: { variant: "default", label: "Confirmée" },
      rejected: { variant: "destructive", label: "Rejetée" },
      new: { variant: "default", label: "Nouveau" },
      read: { variant: "secondary", label: "Lu" },
      replied: { variant: "outline", label: "Répondu" }
    };

    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
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
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">Inscriptions ({stats.totalStudents})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({stats.totalMessages})</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Inscriptions des étudiants</CardTitle>
                  <div className="flex space-x-2">
                    <Select value={studentFilter} onValueChange={setStudentFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmées</SelectItem>
                        <SelectItem value="rejected">Rejetées</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => exportToExcel('students')} variant="outline">
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Âge</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-mono text-sm">{student.id}</TableCell>
                          <TableCell className="font-medium">
                            {student.prenom} {student.nom}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.age} ans</TableCell>
                          <TableCell>{student.niveau}</TableCell>
                          <TableCell>{student.ville}</TableCell>
                          <TableCell>{getStatusBadge(student.status, 'student')}</TableCell>
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
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Informations personnelles</Label>
                                        <div className="mt-2 space-y-2 text-sm">
                                          <p><strong>Email:</strong> {selectedStudent.email}</p>
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
                                      <div className="mt-2 flex space-x-2">
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

                                    <div className="flex space-x-2">
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Messages de contact</CardTitle>
                  <div className="flex space-x-2">
                    <Select value={messageFilter} onValueChange={setMessageFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="new">Nouveaux</SelectItem>
                        <SelectItem value="read">Lus</SelectItem>
                        <SelectItem value="replied">Répondus</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => exportToExcel('messages')} variant="outline">
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Intérêt</TableHead>
                        <TableHead>Message</TableHead>
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
                          <TableCell>
                            <Badge variant="outline">{message.interest}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {message.message}
                          </TableCell>
                          <TableCell>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(message.status, 'message')}</TableCell>
                          <TableCell>
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
                                  <DialogTitle>Message de {selectedMessage?.name}</DialogTitle>
                                </DialogHeader>
                                {selectedMessage && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Contact</Label>
                                        <div className="mt-2 space-y-2 text-sm">
                                          <p><strong>Nom:</strong> {selectedMessage.name}</p>
                                          <p><strong>Email:</strong> {selectedMessage.email}</p>
                                          {selectedMessage.phone && (
                                            <p><strong>Téléphone:</strong> {selectedMessage.phone}</p>
                                          )}
                                          <p><strong>Intérêt:</strong> {selectedMessage.interest}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Informations</Label>
                                        <div className="mt-2 space-y-2 text-sm">
                                          <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                          <p><strong>Statut:</strong> {getStatusBadge(selectedMessage.status, 'message')}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-sm font-medium">Message</Label>
                                      <p className="mt-2 text-sm bg-gray-50 p-3 rounded">
                                        {selectedMessage.message}
                                      </p>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">Changer le statut</Label>
                                      <div className="mt-2 flex space-x-2">
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

                                    <div className="flex space-x-2">
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