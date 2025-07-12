import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, AlertCircle, MessageSquare, Send, Edit, Trash2 } from 'lucide-react';
import { Task, Comment, User as UserType } from '../types';

interface TaskDetailProps {
  task: Task;
  comments: Comment[];
  users: UserType[];
  currentUser: UserType;
  onBack: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onUpdateComment: (id: string, updates: Partial<Comment>) => void;
  onDeleteComment: (id: string) => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  comments,
  users,
  currentUser,
  onBack,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  const taskComments = comments.filter(comment => comment.taskId === task.id);
  const assignedUser = users.find(user => user.id === task.assignedTo);
  
  // Vérifier si l'utilisateur actuel fait partie du projet
  const currentUserProject = users.find(user => user.id === currentUser.id);
  const canComment = currentUserProject !== undefined; // Tous les utilisateurs peuvent commenter si ils ont accès au projet

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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({
        content: newComment.trim(),
        taskId: task.id,
        userId: currentUser.id
      });
      setNewComment('');
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingComment(commentId);
    setEditCommentText(content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editCommentText.trim()) {
      onUpdateComment(commentId, { content: editCommentText.trim() });
      setEditingComment(null);
      setEditCommentText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    onUpdateTask(task.id, { status: newStatus });
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <p className="text-gray-600">{task.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de la tâche</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <div className="flex gap-2 mt-1">
                    {(['To Do', 'In Progress', 'Done'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          task.status === status
                            ? getStatusColor(status)
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priorité</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Échéance</p>
                  <p className="font-medium text-gray-900">
                    {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigné à</p>
                  <div className="flex items-center gap-2 mt-1">
                    {assignedUser?.avatar ? (
                      <img
                        src={assignedUser.avatar}
                        alt={assignedUser.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {assignedUser?.name.split(' ').map(n => n[0]).join('') || '?'}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{assignedUser?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Commentaires ({taskComments.length})
              </h2>
            </div>

            {/* Add Comment Form - Accessible à tous les membres du projet */}
            {canComment && (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ajouter un commentaire..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Publier
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {taskComments.map((comment) => {
                const commentUser = getUserById(comment.userId);
                const isOwner = comment.userId === currentUser.id;
                
                return (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {commentUser?.name.split(' ').map(n => n[0]).join('') || '?'}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{commentUser?.name}</span>
                          <span className="text-sm text-gray-300">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {isOwner && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditComment(comment.id, comment.content)}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteComment(comment.id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 bg-gray-600 border border-gray-500 text-white rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(comment.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                            >
                              Sauvegarder
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-200">{comment.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {taskComments.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun commentaire pour l'instant</p>
                  <p className="text-xs text-gray-500">Soyez le premier à commenter cette tâche</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Actions rapides</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange(task.status === 'Done' ? 'In Progress' : 'Done')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  task.status === 'Done'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                {task.status === 'Done' ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
              </button>
              
              {currentUser.role === 'Admin' && (
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="w-full px-3 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Supprimer la tâche
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};