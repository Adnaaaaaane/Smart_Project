import React from 'react';
import { useAppState } from './hooks/useAppState';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { TaskDetail } from './components/TaskDetail';
import { UserManagement } from './components/UserManagement';

function App() {
  const { state, actions } = useAppState();

  if (!state.currentUser) {
    return <LoginForm onLogin={actions.login} />;
  }

  const selectedProject = state.selectedProjectId 
    ? state.projects.find(p => p.id === state.selectedProjectId)
    : null;

  const selectedTask = state.selectedTaskId
    ? state.tasks.find(t => t.id === state.selectedTaskId)
    : null;

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return (
          <Dashboard
            projects={state.projects}
            tasks={state.tasks}
            users={state.users}
            currentUser={state.currentUser}
            onSelectProject={actions.selectProject}
          />
        );

      case 'projects':
        return (
          <ProjectList
            projects={state.projects}
            users={state.users}
            currentUser={state.currentUser}
            onSelectProject={actions.selectProject}
            onAddProject={actions.addProject}
            onUpdateProject={actions.updateProject}
            onDeleteProject={actions.deleteProject}
          />
        );

      case 'project-detail':
        if (!selectedProject) {
          actions.setCurrentView('projects');
          return null;
        }
        return (
          <ProjectDetail
            project={selectedProject}
            tasks={state.tasks}
            users={state.users}
            currentUser={state.currentUser}
            onBack={() => actions.selectProject(null)}
            onSelectTask={actions.selectTask}
            onAddTask={actions.addTask}
            onUpdateTask={actions.updateTask}
            onDeleteTask={actions.deleteTask}
            onUpdateProject={actions.updateProject}
            onDeleteProject={actions.deleteProject}
          />
        );

      case 'task-detail':
        if (!selectedTask) {
          actions.setCurrentView('project-detail');
          return null;
        }
        return (
          <TaskDetail
            task={selectedTask}
            comments={state.comments}
            users={state.users}
            currentUser={state.currentUser}
            onBack={() => actions.selectTask(null)}
            onUpdateTask={actions.updateTask}
            onDeleteTask={actions.deleteTask}
            onAddComment={actions.addComment}
            onUpdateComment={actions.updateComment}
            onDeleteComment={actions.deleteComment}
          />
        );

      case 'users':
        return (
          <UserManagement
            users={state.users}
            currentUser={state.currentUser}
            onAddUser={actions.addUser}
            onUpdateUser={actions.updateUser}
            onDeleteUser={actions.deleteUser}
          />
        );

      default:
        return (
          <Dashboard
            projects={state.projects}
            tasks={state.tasks}
            users={state.users}
            currentUser={state.currentUser}
            onSelectProject={actions.selectProject}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        currentUser={state.currentUser}
        currentView={state.currentView}
        onNavigate={actions.setCurrentView}
        onLogout={actions.logout}
      />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;