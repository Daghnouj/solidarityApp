import React, { useState, useEffect } from 'react';
import axios from 'axios';
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



  // ...

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      if (!therapistId) return;

      const API_URL = `${import.meta.env.VITE_API_URL}/availabilities/slots`;
      // Usually user selects a date in the calendar, but here the modal shows slots for a date...
      // wait, the modal logic seems defining a start date?
      // The current modal doesn't seem to have a date picker inside it? 
      // Ah, the TimeSlotModal usage in BookingForm implies:
      // onDateSelect passes the date back.
      // But how does the user pick the day? 
      // The current UI seems to show *future* slots or maybe specific day slots?
      // Mock code generated "Tomorrow" and "Day after tomorrow".

      // Let's assume we want to show slots for "today" onwards or a specific range.
      // For simplicity, let's fetch slots for the NEXT 7 DAYS if no date is provided, 
      // OR let's change the UI to pick a date first. 
      // But adhering to the User Request "slots are the availability of the professional", 
      // I will fetch slots for the current selected date context if any, or default to checking a few days.

      // However, the current backend implementation `getAvailableSlots` takes a SINGLE date.
      // So I should probably fetch for "Tomorrow" as per the mock, or iterate.

      // Let's update `getAvailableSlots` to maybe accept a range, OR just fetch for a specific day.
      // But wait, the frontend mock showed slots on DIFFERENT days (Tomorrow, Day after).

      // Let's just fetch for "Tomorrow" for now to match mock behavior, or allow user to pick.
      // Actually, looking at the code `onDateSelect(slot.start)`, it seems the modal IS the date picker essentially.

      // So I should probably fetch "Next available slots starting from tomorrow".
      // But my backend `getAvailableSlots` only does ONE day. 

      // FIX: I will update the Frontend to just fetch for a specific day (e.g. tomorrow) for now, 
      // OR I should loop in backend. 
      // Let's keep it simple: Fetch for tomorrow.

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await axios.get(API_URL, {
        params: {
          professionalId: therapistId,
          date: tomorrow.toISOString()
        }
      });

      // Transform string dates back to Date objects
      const slots = response.data.map((s: any) => ({
        id: s.id,
        start: new Date(s.start),
        end: new Date(s.end)
      }));

      setAvailableSlots(slots);
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