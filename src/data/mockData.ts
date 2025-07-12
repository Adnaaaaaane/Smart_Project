import { User, Project, Task, Comment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Martin',
    email: 'alice@company.com',
    role: 'Admin'
  },
  {
    id: '2',
    name: 'Bob Dubois',
    email: 'bob@company.com',
    role: 'Member'
  },
  {
    id: '3',
    name: 'Claire Laurent',
    email: 'claire@company.com',
    role: 'Member'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david@company.com',
    role: 'Admin'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Site Web E-commerce',
    description: 'Développement d\'une plateforme e-commerce moderne avec React et Node.js',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'En cours',
    teamMembers: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Application Mobile',
    description: 'Application mobile cross-platform pour la gestion des commandes',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    status: 'En cours',
    teamMembers: ['2', '3', '4']
  },
  {
    id: '3',
    name: 'Refonte Infrastructure',
    description: 'Migration vers le cloud et modernisation de l\'infrastructure',
    startDate: '2023-11-01',
    endDate: '2024-03-31',
    status: 'Terminé',
    teamMembers: ['1', '4']
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design de l\'interface utilisateur',
    description: 'Créer les maquettes et prototypes pour l\'interface principale',
    status: 'Done',
    dueDate: '2024-02-15',
    projectId: '1',
    assignedTo: '3',
    priority: 'High'
  },
  {
    id: '2',
    title: 'Configuration de la base de données',
    description: 'Mettre en place la structure de données et les relations',
    status: 'In Progress',
    dueDate: '2024-02-20',
    projectId: '1',
    assignedTo: '2',
    priority: 'High'
  },
  {
    id: '3',
    title: 'Intégration du système de paiement',
    description: 'Implémenter Stripe pour les transactions',
    status: 'To Do',
    dueDate: '2024-03-10',
    projectId: '1',
    assignedTo: '1',
    priority: 'Medium'
  },
  {
    id: '4',
    title: 'Tests d\'interface',
    description: 'Tests unitaires et d\'intégration pour l\'application mobile',
    status: 'In Progress',
    dueDate: '2024-02-25',
    projectId: '2',
    assignedTo: '4',
    priority: 'Medium'
  },
  {
    id: '5',
    title: 'Déploiement en production',
    description: 'Configuration des serveurs et déploiement',
    status: 'Done',
    dueDate: '2024-03-25',
    projectId: '3',
    assignedTo: '1',
    priority: 'High'
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'J\'ai terminé la première version des maquettes. Elles sont disponibles sur Figma.',
    taskId: '1',
    userId: '3',
    createdAt: '2024-02-10T10:30:00Z'
  },
  {
    id: '2',
    content: 'Excellente base ! J\'ai quelques suggestions pour améliorer l\'UX.',
    taskId: '1',
    userId: '1',
    createdAt: '2024-02-11T14:15:00Z'
  },
  {
    id: '3',
    content: 'La base de données est configurée. Je travaille maintenant sur l\'API.',
    taskId: '2',
    userId: '2',
    createdAt: '2024-02-18T09:45:00Z'
  },
  {
    id: '4',
    content: 'Besoin d\'aide pour les tests de régression sur iOS.',
    taskId: '4',
    userId: '4',
    createdAt: '2024-02-22T16:20:00Z'
  }
];