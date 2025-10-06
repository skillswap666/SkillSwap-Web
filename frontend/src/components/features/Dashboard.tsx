import React from 'react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useWorkshops } from '../../hooks/useWorkshops';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  Star, 
  Calendar,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { workshops, loading } = useWorkshops({ limit: 6 });

  const stats = [
    {
      title: 'Total Credits',
      value: user?.credits || 0,
      icon: CreditCard,
      color: 'text-green-600',
    },
    {
      title: 'Workshops Hosted',
      value: user?.totalWorkshopsHosted || 0,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Workshops Attended',
      value: user?.totalWorkshopsAttended || 0,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Average Rating',
      value: user?.rating ? user.rating.toFixed(1) : '0.0',
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Ready to learn something new or share your skills?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/workshops/create')}
              className="w-full justify-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Workshop
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/workshops')}
              className="w-full justify-start"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Workshops
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/profile')}
              className="w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest workshop interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.totalWorkshopsHosted === 0 && user?.totalWorkshopsAttended === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No activity yet. Start by creating or joining a workshop!
                </p>
              ) : (
                <div className="space-y-3">
                  {user?.totalWorkshopsHosted > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">
                        Hosted {user.totalWorkshopsHosted} workshop{user.totalWorkshopsHosted !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {user?.totalWorkshopsAttended > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Attended {user.totalWorkshopsAttended} workshop{user.totalWorkshopsAttended !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Workshops */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Workshops</CardTitle>
          <CardDescription>
            Discover new skills and connect with experts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading workshops...</p>
            </div>
          ) : workshops.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No workshops available yet.</p>
              <Button 
                onClick={() => navigate('/workshops/create')}
                className="mt-4"
              >
                Create the first workshop
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={workshop.facilitator.avatar} />
                          <AvatarFallback>
                            {workshop.facilitator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{workshop.facilitator.name}</p>
                          <p className="text-sm text-gray-500">{workshop.category}</p>
                        </div>
                      </div>
                      <Badge variant={
                        workshop.skillLevel === 'BEGINNER' ? 'default' :
                        workshop.skillLevel === 'INTERMEDIATE' ? 'secondary' : 'destructive'
                      }>
                        {workshop.skillLevel}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{workshop.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {workshop.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(workshop.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {workshop.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {workshop.isOnline ? 'Online' : workshop.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {workshop.currentParticipants}/{workshop.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{workshop.creditCost} credits</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/workshops/${workshop.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
