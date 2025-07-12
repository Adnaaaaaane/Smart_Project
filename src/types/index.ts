export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'Terminé' | 'Suspendu';
  teamMembers: string[]; // user IDs
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
  projectId: string;
  assignedTo: string; // user ID
  priority: 'Low' | 'Medium' | 'High';
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  currentView: 'dashboard' | 'projects' | 'project-detail' | 'task-detail' | 'users';
  selectedProjectId: string | null;
  selectedTaskId: string | null;
}