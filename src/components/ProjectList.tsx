import React, { useState } from 'react';
import { Plus, Calendar, Users, Filter, Search } from 'lucide-react';
import { Project, User } from '../types';
import { ProjectForm } from './ProjectForm';

interface ProjectListProps {
  projects: Project[];
  users: User[];
  currentUser: User;
  onSelectProject: (projectId: string) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  users,
  currentUser,
  onSelectProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-emerald-100 text-emerald-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTeamMembers = (memberIds: string[]) => {
    return users.filter(user => memberIds.includes(user.id));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-gray-300">Gérez tous vos projets en cours</p>
        </div>
        {currentUser.role === 'Admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau projet
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const teamMembers = getTeamMembers(project.teamMembers);
          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-gray-800 border border-gray-700 rounded p-6 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {project.name}
                </h3>
                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                  {project.status}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString('fr-FR')} - {' '}
                    {new Date(project.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-300">{teamMembers.length} membres</span>
                  </div>
                  <div className="flex -space-x-2">
                    {teamMembers.slice(0, 3).map((member, index) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded bg-green-600 border-2 border-gray-800 flex items-center justify-center"
                        title={member.name}
                      >
                        <span className="text-xs font-medium text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ))}
                    {teamMembers.length > 3 && (
                      <div className="w-8 h-8 rounded bg-gray-600 border-2 border-gray-800 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          +{teamMembers.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-300">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche' 
              : 'Commencez par créer votre premier projet'}
          </p>
        </div>
      )}

      {showForm && (
        <ProjectForm
          users={users}
          onSubmit={(project) => {
            onAddProject(project);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};