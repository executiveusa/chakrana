import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import {
  Calendar,
  Clock,
  Heart,
  PlayCircle,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";

interface ChakraInfo {
  name: string;
  color: string;
  description: string;
  progress: number;
}

interface MeditationSession {
  id: string;
  title: string;
  duration: string;
  chakra: string;
  chakraColor: string;
  image: string;
}

interface WellnessDashboardProps {
  userName?: string;
  userAvatar?: string;
  chakras?: ChakraInfo[];
  recommendedSessions?: MeditationSession[];
  popularSessions?: MeditationSession[];
  streakDays?: number;
  totalMinutes?: number;
  completedSessions?: number;
}

const WellnessDashboard: React.FC<WellnessDashboardProps> = ({
  userName = "Sarah",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  chakras = [
    {
      name: "Root",
      color: "bg-red-500",
      description: "Grounding and stability",
      progress: 65,
    },
    {
      name: "Sacral",
      color: "bg-orange-500",
      description: "Creativity and emotion",
      progress: 40,
    },
    {
      name: "Solar Plexus",
      color: "bg-yellow-500",
      description: "Personal power and confidence",
      progress: 75,
    },
    {
      name: "Heart",
      color: "bg-green-500",
      description: "Love and compassion",
      progress: 50,
    },
    {
      name: "Throat",
      color: "bg-blue-500",
      description: "Communication and expression",
      progress: 30,
    },
    {
      name: "Third Eye",
      color: "bg-indigo-500",
      description: "Intuition and insight",
      progress: 60,
    },
    {
      name: "Crown",
      color: "bg-purple-500",
      description: "Spiritual connection",
      progress: 45,
    },
  ],
  recommendedSessions = [
    {
      id: "1",
      title: "Root Chakra Healing",
      duration: "15 min",
      chakra: "Root",
      chakraColor: "bg-red-500",
      image:
        "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80",
    },
    {
      id: "2",
      title: "Heart Opening Practice",
      duration: "20 min",
      chakra: "Heart",
      chakraColor: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    },
    {
      id: "3",
      title: "Third Eye Activation",
      duration: "25 min",
      chakra: "Third Eye",
      chakraColor: "bg-indigo-500",
      image:
        "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=600&q=80",
    },
  ],
  popularSessions = [
    {
      id: "4",
      title: "Full Chakra Alignment",
      duration: "30 min",
      chakra: "All",
      chakraColor: "bg-purple-500",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    },
    {
      id: "5",
      title: "Sacral Creativity Flow",
      duration: "18 min",
      chakra: "Sacral",
      chakraColor: "bg-orange-500",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    },
    {
      id: "6",
      title: "Throat Chakra Expression",
      duration: "22 min",
      chakra: "Throat",
      chakraColor: "bg-blue-500",
      image:
        "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=600&q=80",
    },
  ],
  streakDays = 7,
  totalMinutes = 320,
  completedSessions = 24,
}) => {
  return (
    <div className="bg-slate-50 p-6 rounded-lg w-full h-full overflow-auto">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {userName}
            </h1>
            <p className="text-slate-600">
              Continue your wellness journey today
            </p>
          </div>
          <Avatar className="h-12 w-12 border-2 border-purple-200">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Current Streak</p>
                  <h3 className="text-2xl font-bold">{streakDays} days</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Meditation</p>
                  <h3 className="text-2xl font-bold">{totalMinutes} minutes</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Sessions Completed</p>
                  <h3 className="text-2xl font-bold">{completedSessions}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chakra Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Your Chakra Balance</CardTitle>
            <CardDescription>
              Track your progress across all energy centers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chakras.map((chakra) => (
                <div key={chakra.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("w-3 h-3 rounded-full", chakra.color)}
                      />
                      <span className="font-medium">{chakra.name} Chakra</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {chakra.progress}%
                    </span>
                  </div>
                  <Progress value={chakra.progress} className="h-2" />
                  <p className="text-xs text-slate-500">{chakra.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start Chakra Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meditation Sessions */}
        <Tabs defaultValue="recommended" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Meditation Sessions</h2>
            <TabsList>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recommended" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedSessions.map((session) => (
                <MeditationCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularSessions.map((session) => (
                <MeditationCard key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionCard
            icon={<PlayCircle className="h-6 w-6 text-purple-600" />}
            title="Quick Meditation"
            description="5-minute session"
          />
          <QuickActionCard
            icon={<User className="h-6 w-6 text-green-600" />}
            title="My Profile"
            description="View your progress"
          />
          <QuickActionCard
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
            title="Schedule Session"
            description="Plan your practice"
          />
          <QuickActionCard
            icon={<Settings className="h-6 w-6 text-slate-600" />}
            title="Settings"
            description="Customize your experience"
          />
        </div>
      </div>
    </div>
  );
};

interface MeditationCardProps {
  session: MeditationSession;
}

const MeditationCard: React.FC<MeditationCardProps> = ({ session }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <img
          src={session.image}
          alt={session.title}
          className="w-full h-full object-cover"
        />
        <Badge
          className={cn(
            "absolute top-2 right-2",
            session.chakraColor,
            "text-white border-none",
          )}
        >
          {session.chakra} Chakra
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-medium">{session.title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500">{session.duration}</span>
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <PlayCircle className="mr-1 h-4 w-4" />
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-slate-100 p-3 rounded-full">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessDashboard;
