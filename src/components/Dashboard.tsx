import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  Users, 
  Star, 
  Clock,
  MapPin,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Globe,
  CreditCard,
  Edit
} from 'lucide-react';

export function Dashboard() {
  const { user, workshops, transactions, setCurrentPage, cancelWorkshopAttendance } = useApp();

  // Get user's attended workshops
  const attendedWorkshops = workshops.filter(w => 
    w.participants.some(p => p.id === user.id)
  );

  // Get user's hosted workshops
  const hostedWorkshops = workshops.filter(w => w.facilitatorId === user.id);

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Calculate stats
  const upcomingAttended = attendedWorkshops.filter(w => w.status === 'upcoming').length;
  const upcomingHosted = hostedWorkshops.filter(w => w.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Track your learning journey and workshop activities
            </p>
          </div>
          <Button onClick={() => setCurrentPage('create')} className="mt-4 lg:mt-0">
            <Target className="w-4 h-4 mr-2" />
            Host a Workshop
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                  
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{user.rating}</span>
                    <span className="text-muted-foreground text-sm">/5.0</span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mb-4">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>

                  {user.bio && (
                    <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>
                  )}

                  {/* Skills */}
                  <div className="text-left">
                    <h3 className="font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="mt-6 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Credits</p>
                        <p className="text-xl font-bold">{user.credits}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attended</p>
                        <p className="text-xl font-bold">{user.totalWorkshopsAttended}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hosted</p>
                        <p className="text-xl font-bold">{user.totalWorkshopsHosted}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="attending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="attending">
                  Attending ({upcomingAttended})
                </TabsTrigger>
                <TabsTrigger value="hosting">
                  Hosting ({upcomingHosted})
                </TabsTrigger>
                <TabsTrigger value="activity">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="attending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Workshops You're Attending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {attendedWorkshops.length > 0 ? (
                      <div className="space-y-4">
                        {attendedWorkshops.map((workshop) => (
                          <div key={workshop.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{workshop.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(workshop.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{workshop.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {workshop.isOnline ? (
                                    <>
                                      <Globe className="w-4 h-4" />
                                      <span>Online</span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="w-4 h-4" />
                                      <span>{workshop.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={workshop.facilitator.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {workshop.facilitator.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">{workshop.facilitator.name}</span>
                                <Badge variant="secondary">{workshop.category}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={workshop.status === 'upcoming' ? 'default' : 'secondary'}
                              >
                                {workshop.status}
                              </Badge>
                              {workshop.status === 'upcoming' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => cancelWorkshopAttendance(workshop.id)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No workshops yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start attending workshops to build your skills
                        </p>
                        <Button onClick={() => setCurrentPage('explore')}>
                          Explore Workshops
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hosting" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Workshops You're Hosting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hostedWorkshops.length > 0 ? (
                      <div className="space-y-4">
                        {hostedWorkshops.map((workshop) => (
                          <div key={workshop.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{workshop.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(workshop.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{workshop.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{workshop.currentParticipants}/{workshop.maxParticipants}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{workshop.category}</Badge>
                                <Badge variant="outline" className="text-primary">
                                  <Award className="w-3 h-3 mr-1" />
                                  +{workshop.creditReward} credits
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={workshop.status === 'upcoming' ? 'default' : 'secondary'}
                              >
                                {workshop.status}
                              </Badge>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No workshops hosted yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Share your expertise and earn credits by hosting workshops
                        </p>
                        <Button onClick={() => setCurrentPage('create')}>
                          Host a Workshop
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                transaction.type === 'earned' 
                                  ? 'bg-secondary/10 text-secondary' 
                                  : 'bg-primary/10 text-primary'
                              }`}>
                                {transaction.type === 'earned' ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <CreditCard className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(transaction.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${
                                transaction.type === 'earned' ? 'text-secondary' : 'text-primary'
                              }`}>
                                {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                              </span>
                              <span className="text-sm text-muted-foreground">credits</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No activity yet</h3>
                        <p className="text-muted-foreground">
                          Your workshop activities will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}