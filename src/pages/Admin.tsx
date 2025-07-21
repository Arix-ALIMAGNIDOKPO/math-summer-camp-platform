import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Users, MessageSquare, Download, Eye, Trash2, CheckCircle, XCircle, Clock, LogOut, Lock } from 'lucide-react';
import { MscLogo } from '@/components/ui-custom/MscLogo';

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
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://math-summer-camp-platform-backend.onrender.com';

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const authToken = localStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Identifiants par défaut (à changer en production)
    const validUsername = 'Admin25';
    const validPassword = 'SMCII';

    if (loginForm.username === validUsername && loginForm.password === validPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'authenticated');
      fetchData();
      toast.success('Connexion réussie');
    } else {
      setLoginError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setStudents([]);
    setMessages([]);
    setLoginForm({ username: '', password: '' });
    toast.success('Déconnexion réussie');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, messagesRes] = await Promise.all([
        fetch(`${API_URL}/api/students`),
        fetch(`${API_URL}/api/messages`)
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (studentId: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/api/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setStudents(prev => 
          prev.map(student => 
            student.id === studentId ? { ...student, status: status as any } : student
          )
        );
        toast.success('Statut mis à jour avec succès');
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent({ ...selectedStudent, status: status as any });
        }
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(message => 
            message.id === messageId ? { ...message, status: status as any } : message
          )
        );
        toast.success('Statut du message mis à jour');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Erreur lors de la mise à jour du statut du message');
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;

    try {
      const response = await fetch(`${API_URL}/api/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStudents(prev => prev.filter(student => student.id !== studentId));
        toast.success('Étudiant supprimé avec succès');
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(null);
        }
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(prev => prev.filter(message => message.id !== messageId));
        toast.success('Message supprimé avec succès');
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage(null);
        }
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Erreur lors de la suppression du message');
    }
  };

  const exportStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/export/students`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inscriptions_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Export réussi');
      } else {
        throw new Error('Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Error exporting students:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Confirmé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInterestBadge = (interest: string) => {
    const colors = {
      participant: 'bg-blue-100 text-blue-800',
      parent: 'bg-green-100 text-green-800',
      intervenant: 'bg-purple-100 text-purple-800',
      partenaire: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[interest as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {interest}
      </span>
    );
  };

  const getMessageStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-red-100 text-red-800">Nouveau</Badge>;
      case 'read':
        return <Badge variant="outline" className="text-blue-600">Lu</Badge>;
      case 'replied':
        return <Badge variant="outline" className="text-green-600">Répondu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filtrer les étudiants
  const filteredStudents = students.filter(student => {
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalStudents: students.length,
    pendingStudents: students.filter(s => s.status === 'pending').length,
    confirmedStudents: students.filter(s => s.status === 'confirmed').length,
    rejectedStudents: students.filter(s => s.status === 'rejected').length,
    totalMessages: messages.length,
    newMessages: messages.filter(m => m.status === 'new').length,
  };

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <MscLogo className="mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900">Administration</h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous pour accéder au panneau d'administration
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                    className="mt-1"
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
                    className="mt-1"
                  />
                </div>
                
                {loginError && (
                  <div className="text-red-600 text-sm">{loginError}</div>
                )}
                
                <Button type="submit" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <MscLogo />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                <p className="text-gray-600">Summer Maths Camp - Gestion des inscriptions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={exportStudents} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter Excel
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              {stats.newMessages > 0 && (
                <p className="text-xs text-red-600 mt-1">{stats.newMessages} nouveaux</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Inscriptions ({stats.totalStudents})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({stats.totalMessages})</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            {/* Filtres et recherche */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Rechercher</Label>
                    <Input
                      id="search"
                      placeholder="Nom, prénom, email ou ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status-filter">Statut</Label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                    >
                      <option value="all">Tous</option>
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmés</option>
                      <option value="rejected">Rejetés</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liste des Inscriptions ({filteredStudents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom Complet</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
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
                          <TableCell>{student.telephone}</TableCell>
                          <TableCell>{student.age} ans</TableCell>
                          <TableCell>{student.niveau}</TableCell>
                          <TableCell>{student.ville}</TableCell>
                          <TableCell>{getStatusBadge(student.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedStudent(student)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              {student.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => updateStudentStatus(student.id, 'confirmed')}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => updateStudentStatus(student.id, 'rejected')}
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteStudent(student.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages de Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Intérêt</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.name}</TableCell>
                          <TableCell>{message.email}</TableCell>
                          <TableCell>{message.phone || '-'}</TableCell>
                          <TableCell>{getInterestBadge(message.interest)}</TableCell>
                          <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                          <TableCell>{new Date(message.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{getMessageStatusBadge(message.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedMessage(message)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteMessage(message.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">
                  Détails de l'inscription - {selectedStudent.prenom} {selectedStudent.nom}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="font-mono">{selectedStudent.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">{getStatusBadge(selectedStudent.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p>{selectedStudent.telephone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Âge</label>
                  <p>{selectedStudent.age} ans</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Niveau</label>
                  <p>{selectedStudent.niveau}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">École</label>
                  <p>{selectedStudent.ecole}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ville</label>
                  <p>{selectedStudent.ville}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Département</label>
                  <p>{selectedStudent.departement}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Commune</label>
                  <p>{selectedStudent.commune}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-500">Motivation</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">{selectedStudent.motivation}</p>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-500">Date d'inscription</label>
                <p>{new Date(selectedStudent.registeredAt).toLocaleString('fr-FR')}</p>
              </div>

              {selectedStudent.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      updateStudentStatus(selectedStudent.id, 'confirmed');
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => {
                      updateStudentStatus(selectedStudent.id, 'rejected');
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">
                  Message de {selectedMessage.name}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p>{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p>{selectedMessage.phone || 'Non fourni'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Intérêt</label>
                  <div className="mt-1">{getInterestBadge(selectedMessage.interest)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p>{new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">{getMessageStatusBadge(selectedMessage.status)}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-3">
                {selectedMessage.status === 'new' && (
                  <Button
                    variant="outline"
                    onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                  >
                    Marquer comme lu
                  </Button>
                )}
                {selectedMessage.status !== 'replied' && (
                  <Button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                  >
                    Marquer comme répondu
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Votre message concernant le Summer Maths Camp`)}
                >
                  Répondre par email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;