import React from 'react';
import { BarChart3, FolderOpen, CheckSquare, Users, Calendar, TrendingUp } from 'lucide-react';
import { Project, Task, User } from '../types';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
  currentUser: User;
  onSelectProject: (projectId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  tasks,
  users,
  currentUser,
  onSelectProject
}) => {
  const myTasks = tasks.filter(task => task.assignedTo === currentUser.id);
  const activeProjects = projects.filter(project => project.status === 'En cours');
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Projets actifs',
      value: activeProjects.length,
      icon: FolderOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Mes tâches',
      value: myTasks.length,
      icon: CheckSquare,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Équipe',
      value: users.length,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Progression',
      value: `${progressPercentage}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentTasks = myTasks
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Done': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Bonjour, {currentUser.name} 👋
        </h1>
        <p className="text-gray-300">Voici un aperçu de vos projets et tâches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Projets en cours</h2>
            <BarChart3 className="w-5 h-5 text-gray-300" />
          </div>
          <div className="space-y-3">
            {activeProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-300">
                      {new Date(project.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Recent Tasks */}
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Mes tâches récentes</h2>
            <CheckSquare className="w-5 h-5 text-gray-300" />
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-4 bg-gray-700 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{task.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                        {task.status}
                      </span>
                      <span className="px-2 py-1 bg-orange-600 text-white rounded text-xs font-medium">
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};