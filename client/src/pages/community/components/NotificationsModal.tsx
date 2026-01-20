// components/community/NotificationsModal.tsx

import { motion } from "framer-motion";

interface Props {
  visible: boolean;
  onClose: () => void;
  notifications: string[];
  clearNotifications: () => void;
}

export default function NotificationsModal({
  visible,
  onClose,
  notifications,
  clearNotifications,
}: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-4 z-10"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-600" onClick={clearNotifications}>
              Clear
            </button>
            <button className="text-gray-500" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="text-sm text-gray-500">No notifications.</div>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} className="p-3 rounded-lg border">
                <div className="text-sm">{n}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date().toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
