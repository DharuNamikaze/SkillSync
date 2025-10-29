import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Briefcase, 
  Award, 
  ArrowUpRight, 
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ProjectsAPI, API_BASE } from "../lib/api";
import { getAuthToken } from "../auth";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [skillProgress, setSkillProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authHeaders = () => {
      const token = getAuthToken();
      return token
        ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        : { 'Content-Type': 'application/json' };
    };

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsRes = await fetch(`${API_BASE}/dashboard/stats`, { headers: authHeaders() });
        const statsJson = statsRes.ok ? await statsRes.json() : { data: null };

        let activitiesArr = [];
        let tasksArr = [];
        let skillsArr = [];
        try {
          const [actRes, taskRes, skillRes] = await Promise.all([
            fetch(`${API_BASE}/dashboard/activities`, { headers: authHeaders() }),
            fetch(`${API_BASE}/dashboard/tasks`, { headers: authHeaders() }),
            fetch(`${API_BASE}/dashboard/skills`, { headers: authHeaders() }),
          ]);
          if (actRes.ok) activitiesArr = (await actRes.json()).data || [];
          if (taskRes.ok) tasksArr = (await taskRes.json()).data || [];
          if (skillRes.ok) skillsArr = (await skillRes.json()).data || [];
        } catch (_) {}

        setStats(statsJson.data || {
          projectsCompleted: 0,
          projectsInProgress: 0,
          totalTeams: 0,
          skillsLearned: 0,
          projectCompletionRate: 0,
        });
        setActivities(activitiesArr);
        setUpcomingTasks(tasksArr);
        setSkillProgress(skillsArr);
      } catch (error) {
        setStats({
          projectsCompleted: 0,
          projectsInProgress: 0,
          totalTeams: 0,
          skillsLearned: 0,
          projectCompletionRate: 0,
        });
        setActivities([]);
        setUpcomingTasks([]);
        setSkillProgress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Safely coerce values to numbers to avoid NaN in UI
  const safeNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Format date to readable format (robust against invalid inputs)
  const formatDate = (date) => {
    if (!date) return "N/A";

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) return "N/A";

    // Format: "Jan 15, 2025" or "Dec 3, 2024"
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return targetDate.toLocaleDateString('en-US', options);
  };

  // Format timestamp for activities (robust against invalid inputs)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";

    const activityDate = new Date(timestamp);
    if (isNaN(activityDate.getTime())) return "N/A";

    const now = new Date();
    const diffMs = now.getTime() - activityDate.getTime();
    if (!Number.isFinite(diffMs)) return "N/A";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return activityDate.toLocaleDateString();
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      case "not_started":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "project_milestone":
        return <Award className="h-5 w-5 text-purple-500" />;
      case "task_completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "team_joined":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "skill_achieved":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "project_created":
        return <Briefcase className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading text-foreground">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse py-6">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-4/4 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          <Card className="hover-lift transition-all duration-200 pt-10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-base text-muted-foreground">Projects</p>
                  <h3 className="text-2xl font-heading mt-1">{safeNum(stats?.projectsCompleted) + safeNum(stats?.projectsInProgress)}</h3>
                </div>
                <div className="p-2 bg-secondary rounded-base border-2 border-border bg-green-700">
                  <Briefcase className="h-6 w-6 " />
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <div>
                  <span className="block font-base text-foreground">{safeNum(stats?.projectsCompleted)}</span>
                  <span>Completed</span>
                </div>
                <div>
                  <span className="block font-base text-foreground">{safeNum(stats?.projectsInProgress)}</span>
                  <span>In Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-all duration-200 pt-10">
            <CardContent className="p-6 ">
              <div className="flex justify-between items-start ">
                <div>
                  <p className="text-sm font-base ">Tasks</p>
                  <h3 className="text-2xl font-heading mt-1">{safeNum(stats?.tasksCompleted) + safeNum(stats?.tasksInProgress)}</h3>
                </div>
                <div className="p-2 bg-accent rounded-base border-2 border-border ">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <div>
                  <span className="block font-base text-foreground">{safeNum(stats?.tasksCompleted)}</span>
                  <span>Completed</span>
                </div>
                <div>
                  <span className="block font-base text-foreground">{safeNum(stats?.tasksInProgress)}</span>
                  <span>In Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-all duration-200 pt-10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-base text-muted-foreground">Skills</p>
                  <h3 className="text-2xl font-heading mt-1">{stats?.skillsLearned}</h3>
                  <div className="flex items-center mt-1 space-x-1">
                    <span className="text-xs text-muted-foreground">Skills acquired</span>
                  </div>
                </div>
                <div className="p-2 bg-secondary rounded-base border-2 border-border bg-indigo-700">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-all duration-200 pt-10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-base text-muted-foreground">Teams</p>
                  <h3 className="text-2xl font-heading mt-1">{stats?.totalTeams}</h3>
                  <div className="flex items-center mt-1 space-x-1">
                    <span className="text-xs text-muted-foreground">Active teams</span>
                  </div>
                </div>
                <div className="p-2  rounded-base border-2 border-border bg-orange-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <Card className="hover-lift transition-all duration-200">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg">Upcoming Tasks</CardTitle>
                <Link to="/projects">
                  <Button variant="neutral" size="sm" className="flex items-center gap-2">
                    View all <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-6 w-16 bg-muted rounded"></div>
                    </div>
                  </div>
                ))
              ) : upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(task.status)}
                        </div>
                        <div>
                          <h4 className="font-base font-medium">{task.title?.replace(/\s*deadline\s*$/i, '')}</h4>
                          <p className="text-sm text-muted-foreground">{task.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No upcoming tasks
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Recent Activity */}
     
    </div>
  );
}

export default Dashboard;