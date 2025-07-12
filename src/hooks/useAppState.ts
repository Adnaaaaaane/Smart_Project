import { useState, useCallback } from 'react';
import { AppState, User, Project, Task, Comment } from '../types';
import { mockUsers, mockProjects, mockTasks, mockComments } from '../data/mockData';

const initialState: AppState = {
  currentUser: mockUsers[0], // Default to first admin user
  users: mockUsers,
  projects: mockProjects,
  tasks: mockTasks,
  comments: mockComments,
  currentView: 'dashboard',
  selectedProjectId: null,
  selectedTaskId: null,
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);

  const login = useCallback((email: string, password: string) => {
    const user = state.users.find(u => u.email === email);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  }, [state.users]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, currentUser: null, currentView: 'dashboard' }));
  }, []);

  const setCurrentView = useCallback((view: AppState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const selectProject = useCallback((projectId: string | null) => {
    setState(prev => ({ 
      ...prev, 
      selectedProjectId: projectId,
      currentView: projectId ? 'project-detail' : 'projects'
    }));
  }, []);

  const selectTask = useCallback((taskId: string | null) => {
    setState(prev => ({ 
      ...prev, 
      selectedTaskId: taskId,
      currentView: taskId ? 'task-detail' : 'project-detail'
    }));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.filter(t => t.projectId !== id)
    }));
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
      comments: prev.comments.filter(c => c.taskId !== id)
    }));
  }, []);

  const addComment = useCallback((comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
  }, []);

  const updateComment = useCallback((id: string, updates: Partial<Comment>) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  }, []);

  const deleteComment = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== id)
    }));
  }, []);

  const addUser = useCallback((user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === id ? { ...u, ...updates } : u
      )
    }));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));
  }, []);

  return {
    state,
    actions: {
      login,
      logout,
      setCurrentView,
      selectProject,
      selectTask,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      addComment,
      updateComment,
      deleteComment,
      addUser,
      updateUser,
      deleteUser,
    }
  };
};