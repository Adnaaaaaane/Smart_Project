import React, { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Users, Edit, Trash2, CheckSquare } from 'lucide-react';
import { Project, Task, User } from '../types';
import { TaskForm } from './TaskForm';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  users: User[];
  currentUser: User;
  onBack: () => void;
  onSelectTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  tasks,
  users,
  currentUser,
  onBack,
  onSelectTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateProject,
  onDeleteProject
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const filteredTasks = statusFilter === 'all' 
    ? projectTasks 
    : projectTasks.filter(task => task.status === statusFilter);

  const teamMembers = users.filter(user => project.teamMembers.includes(user.id));
  
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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-emerald-100 text-emerald-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    onUpdateTask(taskId, { status: newStatus });
  };

  const tasksByStatus = {
    'To Do': filteredTasks.filter(task => task.status === 'To Do'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    'Done': filteredTasks.filter(task => task.status === 'Done')
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Période</p>
              <p className="font-medium text-gray-900">
                {new Date(project.startDate).toLocaleDateString('fr-FR')} - {' '}
                {new Date(project.endDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Équipe ({teamMembers.length})</p>
              <div className="flex -space-x-2 mt-1">
                {teamMembers.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"
                    title={member.name}
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                ))}
                {teamMembers.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{teamMembers.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Progression</p>
              <p className="font-medium text-gray-900">
                {projectTasks.filter(t => t.status === 'Done').length} / {projectTasks.length} tâches
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${projectTasks.length > 0 ? (projectTasks.filter(t => t.status === 'Done').length / projectTasks.length) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Tâches</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les tâches</option>
            <option value="To Do">À faire</option>
            <option value="In Progress">En cours</option>
            <option value="Done">Terminées</option>
          </select>
        </div>
        {currentUser.role === 'Admin' && (
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle tâche
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{status}</h3>
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
                {statusTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {statusTasks.map((task) => {
                const assignedUser = getUserById(task.assignedTo);
                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className="bg-gray-700 p-4 rounded border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm line-clamp-2">
                        {task.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {assignedUser?.name.split(' ').map(n => n[0]).join('') || '?'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-300">{assignedUser?.name}</span>
                      </div>
                      
                      <span className="text-xs text-gray-300">
                        {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Quick Status Change */}
                    <div className="flex gap-1 mt-3">
                      {(['To Do', 'In Progress', 'Done'] as const).map((newStatus) => (
                        <button
                          key={newStatus}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskStatusChange(task.id, newStatus);
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            task.status === newStatus
                              ? getStatusColor(newStatus)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {newStatus}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune tâche</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showTaskForm && (
        <TaskForm
          projectId={project.id}
          users={teamMembers}
          onSubmit={(task) => {
            onAddTask(task);
            setShowTaskForm(false);
          }}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};