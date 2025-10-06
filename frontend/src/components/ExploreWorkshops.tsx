import React, { useState } from 'react';
import { useWorkshops } from '../hooks/useWorkshops';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Star, 
  Clock,
  MapPin,
  CreditCard,
  Globe,
  MapIcon
} from 'lucide-react';

const categories = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'Design',
  'Business',
  'Marketing',
  'Other'
];

const skillLevels = [
  'BEGINNER',
  'INTERMEDIATE', 
  'ADVANCED'
];

export function ExploreWorkshops() {
  const { user } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Use the API hook to fetch workshops
  const { workshops, loading, joinWorkshop, leaveWorkshop } = useWorkshops({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    skillLevel: selectedSkillLevel !== 'all' ? selectedSkillLevel : undefined,
    status: 'UPCOMING'
  });

  const handleJoinWorkshop = async (workshopId: string) => {
    try {
      await joinWorkshop(workshopId);
    } catch (error) {
      console.error('Failed to join workshop:', error);
    }
  };

  const handleLeaveWorkshop = async (workshopId: string) => {
    try {
      await leaveWorkshop(workshopId);
    } catch (error) {
      console.error('Failed to leave workshop:', error);
    }
  };

  const isUserAttending = (workshopId: string) => {
    const workshop = workshops.find(w => w.id === workshopId);
    return workshop?.participants.some(p => p.id === user?.id) || false;
  };

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explore Workshops</h1>
          <p className="text-lg text-muted-foreground">
            Discover workshops from our community of experts and expand your skillset.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search workshops, skills, or facilitators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Skill Level Filter */}
            <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {skillLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading workshops...' : `Showing ${workshops.length} workshop${workshops.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Workshops Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading workshops...</p>
          </div>
        ) : workshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-0">
                  {/* Workshop Image */}
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    {workshop.image && (
                      <img 
                        src={workshop.image} 
                        alt={workshop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                  </div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{workshop.category}</Badge>
                      <Badge variant="outline" className="text-primary">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {workshop.creditCost}
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{workshop.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {workshop.description}
                    </p>

                    {/* Facilitator */}
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={workshop.facilitator.avatar} />
                        <AvatarFallback className="text-xs">
                          {workshop.facilitator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{workshop.facilitator.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{workshop.facilitator.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Workshop Details */}
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(workshop.date).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{workshop.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workshop.isOnline ? (
                          <>
                            <Globe className="w-4 h-4" />
                            <span>Online</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{workshop.location}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{workshop.currentParticipants}/{workshop.maxParticipants} participants</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {workshop.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {workshop.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{workshop.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.location.href = `/workshops/${workshop.id}`}
                      >
                        View Details
                      </Button>
                      {isUserAttending(workshop.id) ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveWorkshop(workshop.id)}
                          className="shrink-0"
                        >
                          Leave
                        </Button>
                      ) : workshop.currentParticipants >= workshop.maxParticipants ? (
                        <Badge variant="outline" className="px-3 py-1">
                          Full
                        </Badge>
                      ) : (user?.credits || 0) < workshop.creditCost ? (
                        <Badge variant="outline" className="px-3 py-1 text-muted-foreground">
                          Not Enough Credits
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleJoinWorkshop(workshop.id)}
                          className="shrink-0"
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No workshops found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find workshops.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSkillLevel('all');
                  setSelectedLocation('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}