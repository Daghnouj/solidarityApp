import React from 'react';
import type { UserRow } from '../../types';
import { Mail, User, Calendar, Shield } from 'lucide-react';

interface UsersTableProps {
  users: UserRow[];
  loading?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading }) => {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4 font-medium">Loading users...</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-gray-400" size={32} />
        </div>
        <p className="text-gray-500 font-medium">No users found</p>
        <p className="text-gray-400 text-sm mt-2">Users will appear here once they're added</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-blue-900 to-blue-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Name
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  Role
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Joined
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className="hover:bg-blue-50/50 transition-colors duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Name Cell */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-blue-900 group-hover:text-orange-600 transition-colors">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Email Cell */}
                <td className="px-6 py-4">
                  <span className="text-gray-700">{user.email}</span>
                </td>

                {/* Role Cell */}
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'Admin' 
                      ? 'bg-orange-100 text-orange-700' 
                      : user.role === 'Therapist'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role || 'User'}
                  </span>
                </td>

                {/* Joined Date Cell */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : '-'
                    }
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Stats */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-900">{users.length}</span> users
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;