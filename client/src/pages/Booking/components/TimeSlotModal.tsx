import React, { useState, useEffect } from 'react';
import type { TimeSlot } from '../types';

interface TimeSlotModalProps {
  show: boolean;
  onHide: () => void;
  onDateSelect: (date: Date) => void;
  therapistId: string;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
  show,
  onHide,
  onDateSelect,
  therapistId,
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchAvailableSlots();
    }
  }, [show, therapistId]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, fetch from API
      const mockSlots: TimeSlot[] = [
        {
          id: '1',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 minutes
        },
        {
          id: '2',
          start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        },
      ];
      
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Available Time Slots</h3>
            <button
              onClick={onHide}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onDateSelect(slot.start)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">
                    {slot.start.toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {slot.start.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {slot.end.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No available time slots
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotModal;