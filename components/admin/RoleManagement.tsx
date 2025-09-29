'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, Key, Plus, Edit2, Trash2, Check, X,
  ChevronDown, ChevronUp, Search, Filter, Save, AlertCircle,
  UserPlus, Lock, Unlock, Copy, Eye, EyeOff
} from 'lucide-react';
import { useRoles, Role, Permission } from '@/lib/settings-utils';
import { useNotifications } from '@/contexts/NotificationContext';

export function RoleManagement() {
  const { roles, permissions, loading, createRole, updateRole, deleteRole } = useRoles();
  const { addNotification } = useNotifications();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRoleExpansion = (roleId: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) {
      addNotification({
        type: 'ERROR',
        title: 'Cannot Delete',
        message: 'System roles cannot be deleted',
        priority: 'HIGH'
      });
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      try {
        await deleteRole(role.id);
        addNotification({
          type: 'SUCCESS',
          title: 'Role Deleted',
          message: `Role "${role.name}" has been deleted`,
          priority: 'LOW'
        });
      } catch (error) {
        addNotification({
          type: 'ERROR',
          title: 'Delete Failed',
          message: 'Failed to delete role',
          priority: 'HIGH'
        });
      }
    }
  };

  const handleDuplicateRole = async (role: Role) => {
    const newRole = await createRole({
      name: `${role.name} (Copy)`,
      description: role.description,
      permissions: [...role.permissions],
      isSystem: false
    });

    addNotification({
      type: 'SUCCESS',
      title: 'Role Duplicated',
      message: `Created "${newRole.name}" from "${role.name}"`,
      priority: 'LOW'
    });

    setEditingRole(newRole);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Role Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Shield className="w-4 h-4" />
            <span>{roles.length} Total Roles</span>
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    role.isSystem ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Shield className={`w-5 h-5 ${
                      role.isSystem ? 'text-purple-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white flex items-center space-x-2">
                      <span>{role.name}</span>
                      {role.isSystem && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          System
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-400">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRoleExpansion(role.id)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    {expandedRoles.has(role.id) ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    disabled={role.isSystem}
                  >
                    <Edit2 className={`w-4 h-4 ${
                      role.isSystem ? 'text-slate-600' : 'text-slate-400'
                    }`} />
                  </button>
                  <button
                    onClick={() => handleDuplicateRole(role)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    disabled={role.isSystem}
                  >
                    <Trash2 className={`w-4 h-4 ${
                      role.isSystem ? 'text-slate-600' : 'text-slate-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Expanded Permissions */}
              <AnimatePresence>
                {expandedRoles.has(role.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-slate-700"
                  >
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Permissions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {role.permissions.includes('*') ? (
                        <div className="col-span-full">
                          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                            Full System Access
                          </span>
                        </div>
                      ) : (
                        role.permissions.map((permId) => {
                          const permission = permissions.find(p => p.id === permId);
                          return permission ? (
                            <div
                              key={permId}
                              className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg flex items-center space-x-2"
                            >
                              <Key className="w-3 h-3 text-slate-500" />
                              <span className="truncate">{permission.name}</span>
                            </div>
                          ) : (
                            <div
                              key={permId}
                              className="px-3 py-1.5 bg-slate-700 text-slate-500 text-sm rounded-lg italic"
                            >
                              {permId}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(role.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Role Modal */}
      <AnimatePresence>
        {(showCreateModal || editingRole) && (
          <RoleModal
            role={editingRole}
            permissions={permissions}
            onSave={async (roleData) => {
              if (editingRole) {
                await updateRole(editingRole.id, roleData);
                addNotification({
                  type: 'SUCCESS',
                  title: 'Role Updated',
                  message: `Role "${roleData.name}" has been updated`,
                  priority: 'LOW'
                });
              } else {
                await createRole(roleData);
                addNotification({
                  type: 'SUCCESS',
                  title: 'Role Created',
                  message: `Role "${roleData.name}" has been created`,
                  priority: 'LOW'
                });
              }
              setShowCreateModal(false);
              setEditingRole(null);
            }}
            onClose={() => {
              setShowCreateModal(false);
              setEditingRole(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Role Modal Component
function RoleModal({
  role,
  permissions,
  onSave,
  onClose
}: {
  role: Role | null;
  permissions: Permission[];
  onSave: (role: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
    isSystem: role?.isSystem || false
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group permissions by category
  const permissionCategories = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const togglePermission = (permId: string) => {
    if (formData.permissions.includes('*')) {
      setFormData({ ...formData, permissions: [permId] });
    } else {
      const newPerms = formData.permissions.includes(permId)
        ? formData.permissions.filter(p => p !== permId)
        : [...formData.permissions, permId];
      setFormData({ ...formData, permissions: newPerms });
    }
  };

  const toggleFullAccess = () => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes('*') ? [] : ['*']
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {role ? 'Edit Role' : 'Create New Role'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
              placeholder="Enter role name..."
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
              placeholder="Describe this role..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm text-slate-400">Permissions</label>
              <button
                onClick={toggleFullAccess}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  formData.permissions.includes('*')
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {formData.permissions.includes('*') ? (
                  <span className="flex items-center space-x-1">
                    <Unlock className="w-3 h-3" />
                    <span>Full Access Enabled</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Enable Full Access</span>
                  </span>
                )}
              </button>
            </div>

            {!formData.permissions.includes('*') && (
              <div className="space-y-3">
                {Object.entries(permissionCategories).map(([category, perms]) => (
                  <div key={category} className="bg-slate-700 rounded-lg p-3">
                    <button
                      onClick={() => setSelectedCategory(
                        selectedCategory === category ? null : category
                      )}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium text-white">{category}</span>
                      {selectedCategory === category ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {selectedCategory === category && (
                      <div className="mt-3 space-y-2">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-slate-600 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-white">{perm.name}</p>
                              <p className="text-xs text-slate-400">{perm.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{role ? 'Update' : 'Create'} Role</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}