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
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 p-6 rounded-lg w-full h-full overflow-auto shadow-lg"
    >
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
              Welcome back, {userName}
            </h1>
            <p className="text-slate-600">
              Continue your wellness journey today
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Avatar className="h-12 w-12 border-2 border-purple-200 shadow-md">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-purple-100 p-3 rounded-full shadow-inner"
                  >
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-slate-600">Current Streak</p>
                    <h3 className="text-2xl font-bold">{streakDays} days</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-green-100 p-3 rounded-full shadow-inner"
                  >
                    <Clock className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-slate-600">Total Meditation</p>
                    <h3 className="text-2xl font-bold">
                      {totalMinutes} minutes
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-blue-100 p-3 rounded-full shadow-inner"
                  >
                    <Heart className="h-6 w-6 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-slate-600">Sessions Completed</p>
                    <h3 className="text-2xl font-bold">{completedSessions}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Chakra Visualization */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-700">
                Your Chakra Balance
              </CardTitle>
              <CardDescription>
                Track your progress across all energy centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chakras.map((chakra, index) => (
                  <motion.div
                    key={chakra.name}
                    className="space-y-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.5 }}
                          className={cn(
                            "w-3 h-3 rounded-full shadow-md",
                            chakra.color,
                          )}
                        />
                        <span className="font-medium">
                          {chakra.name} Chakra
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">
                        {chakra.progress}%
                      </span>
                    </div>
                    <Progress value={chakra.progress} className="h-2" />
                    <p className="text-xs text-slate-500">
                      {chakra.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Start Chakra Assessment
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meditation Sessions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Tabs defaultValue="recommended" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
                Meditation Sessions
              </h2>
              <TabsList className="shadow-md">
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recommended" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <MeditationCard session={session} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {popularSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <MeditationCard session={session} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <QuickActionCard
              icon={<PlayCircle className="h-6 w-6 text-purple-600" />}
              title="Quick Meditation"
              description="5-minute session"
              href="/meditations/quick"
            />
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <QuickActionCard
              icon={<User className="h-6 w-6 text-green-600" />}
              title="My Profile"
              description="View your progress"
              href="/profile"
            />
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <QuickActionCard
              icon={<Calendar className="h-6 w-6 text-blue-600" />}
              title="Schedule Session"
              description="Plan your practice"
              href="/schedule"
            />
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <QuickActionCard
              icon={<Settings className="h-6 w-6 text-slate-600" />}
              title="Settings"
              description="Customize your experience"
              href="/settings"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface MeditationCardProps {
  session: MeditationSession;
}

const MeditationCard: React.FC<MeditationCardProps> = ({ session }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative h-40">
        <img
          src={session.image}
          alt={session.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge
          className={cn(
            "absolute top-2 right-2",
            session.chakraColor,
            "text-white border-none shadow-md",
          )}
        >
          {session.chakra} Chakra
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium">{session.title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500">{session.duration}</span>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all"
              onClick={() =>
                (window.location.href = `/meditation/${session.id}`)
              }
            >
              <PlayCircle className="mr-1 h-4 w-4" />
              Play
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  href = "/",
}) => {
  const handleClick = () => {
    window.location.href = href;
  };

  return (
    <Card
      className="shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 15 }}
          className="bg-slate-100 p-3 rounded-full shadow-inner"
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessDashboard;
