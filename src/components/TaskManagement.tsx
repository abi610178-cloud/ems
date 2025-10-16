import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Clock, Calendar, AlertCircle, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEmployee } from '../contexts/EmployeeContext';
import { taskService } from '../services/taskService';
import { Task } from '../types/task';
import Modal from './Modal';
import { notificationService } from '../services/notificationService';

const TaskManagement: React.FC = () => {
  const { user } = useAuth();
  const { employees } = useEmployee();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    percentage: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [tasksData, stats] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getTaskStatistics()
      ]);
      setTasks(tasksData);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          assigned_to: formData.assigned_to,
          priority: formData.priority,
          due_date: formData.due_date || null
        });
      } else {
        const assignedEmployee = employees.find(e => e.id === formData.assigned_to);
        await taskService.createTask({
          title: formData.title,
          description: formData.description,
          assigned_to: formData.assigned_to,
          assigned_to_name: assignedEmployee?.name || 'Unknown',
          created_by: user.id,
          priority: formData.priority,
          due_date: formData.due_date || undefined
        });
      }

      setShowModal(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: ''
      });
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      priority: task.priority,
      due_date: task.due_date || ''
    });
    setShowModal(true);
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await taskService.updateTaskStatus(task.id, newStatus);

      if (newStatus === 'completed') {
        const employeeName = getEmployeeName(task.assigned_to);
        try {
          await notificationService.createNotification({
            type: 'task_completed',
            title: 'Task Completed',
            message: `${employeeName} has completed the task: "${task.title}"`,
            employee_id: task.assigned_to,
            employee_name: employeeName,
            related_id: task.id,
            metadata: {
              task_title: task.title,
              task_priority: task.priority,
              due_date: task.due_date
            }
          });
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
        }
      }

      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assigned_to: '',
      priority: 'medium',
      due_date: ''
    });
    setShowModal(true);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white font-mono">TASK MANAGEMENT</h2>
          <p className="text-slate-400 mt-1 text-sm font-mono">Assign and track employee tasks</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium font-mono text-sm uppercase tracking-wide"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-400" size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400 font-mono uppercase">Total</span>
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{statistics.total}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-400" size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400 font-mono uppercase">Pending</span>
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{statistics.pending}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400 font-mono uppercase">Done</span>
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{statistics.completed}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-purple-400" size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400 font-mono uppercase">Rate</span>
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{statistics.percentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 font-mono">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              PENDING
              <span className="text-sm font-normal text-slate-400">({pendingTasks.length})</span>
            </h3>
          </div>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-500 border border-slate-700/50">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="font-mono text-sm">NO PENDING TASKS</p>
              </div>
            ) : (
              pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2 font-mono">{task.title}</h4>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-lg border font-mono ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="text-green-400 hover:bg-green-500/20 p-2 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-700/50">
                    <span className="text-slate-300 font-mono">
                      {getEmployeeName(task.assigned_to)}
                    </span>
                    {task.due_date && (
                      <span className="text-slate-500 flex items-center gap-1 font-mono text-xs">
                        <Calendar size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 font-mono">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              COMPLETED
              <span className="text-sm font-normal text-slate-400">({completedTasks.length})</span>
            </h3>
          </div>
          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-500 border border-slate-700/50">
                <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="font-mono text-sm">NO COMPLETED TASKS</p>
              </div>
            ) : (
              completedTasks.map(task => (
                <div
                  key={task.id}
                  className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/50 transition-all opacity-75"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2 font-mono">{task.title}</h4>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-lg border font-mono ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleTaskStatus(task)}
                        className="text-orange-400 hover:bg-orange-500/20 p-2 rounded-lg transition-colors"
                        title="Mark as pending"
                      >
                        <Clock size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-700/50">
                    <span className="text-slate-300 font-mono">
                      {getEmployeeName(task.assigned_to)}
                    </span>
                    {task.completed_at && (
                      <span className="text-green-400 text-xs font-medium font-mono">
                        ✓ {new Date(task.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
          setFormData({
            title: '',
            description: '',
            assigned_to: '',
            priority: 'medium',
            due_date: ''
          });
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <select
              required
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingTask(null);
                setFormData({
                  title: '',
                  description: '',
                  assigned_to: '',
                  priority: 'medium',
                  due_date: ''
                });
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
