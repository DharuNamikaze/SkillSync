import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users, 
  Calendar as CalendarIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Clock3
} from "lucide-react";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "meeting",
    priority: "medium"
  });

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Get month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data that would come from your backend
      const mockEvents = [
        {
          id: 1,
          title: "Team Standup",
          date: new Date(currentYear, currentMonth, 5),
          startTime: "09:00",
          endTime: "09:30",
          type: "meeting",
          priority: "medium",
          participants: ["Alex Johnson", "Sarah Williams", "Michael Chen"]
        },
        {
          id: 2,
          title: "Project Deadline: Frontend MVP",
          date: new Date(currentYear, currentMonth, 15),
          startTime: "18:00",
          endTime: "18:00",
          type: "deadline",
          priority: "high"
        },
        {
          id: 3,
          title: "Code Review Session",
          date: new Date(currentYear, currentMonth, 8),
          startTime: "14:00",
          endTime: "15:30",
          type: "meeting",
          priority: "medium",
          participants: ["Emily Rodriguez", "David Kim"]
        },
        {
          id: 4,
          title: "API Integration Planning",
          date: new Date(currentYear, currentMonth, 12),
          startTime: "10:00",
          endTime: "11:30",
          type: "meeting",
          priority: "high",
          participants: ["Michael Chen", "Sarah Williams"]
        },
        {
          id: 5,
          title: "UI Design Review",
          date: new Date(currentYear, currentMonth, 18),
          startTime: "13:00",
          endTime: "14:30",
          type: "meeting",
          priority: "medium",
          participants: ["Alex Johnson", "Emily Rodriguez"]
        },
        {
          id: 6,
          title: "Backend Deployment",
          date: new Date(currentYear, currentMonth, 22),
          startTime: "09:00",
          endTime: "17:00",
          type: "task",
          priority: "high"
        },
        {
          id: 7,
          title: "Monthly Progress Review",
          date: new Date(currentYear, currentMonth, 28),
          startTime: "15:00",
          endTime: "16:30",
          type: "meeting",
          priority: "medium",
          participants: ["Alex Johnson", "Sarah Williams", "Michael Chen", "Emily Rodriguez", "David Kim"]
        }
      ];

      // Add some events for the next month
      const nextMonthEvents = [
        {
          id: 8,
          title: "Planning Session for Q3",
          date: new Date(currentYear, currentMonth + 1, 3),
          startTime: "10:00",
          endTime: "12:00",
          type: "meeting",
          priority: "high",
          participants: ["Alex Johnson", "Sarah Williams", "Michael Chen"]
        },
        {
          id: 9,
          title: "New Feature Kickoff",
          date: new Date(currentYear, currentMonth + 1, 10),
          startTime: "14:00",
          endTime: "15:30",
          type: "meeting",
          priority: "medium",
          participants: ["Emily Rodriguez", "David Kim"]
        }
      ];

      // Add some events for the previous month
      const prevMonthEvents = [
        {
          id: 10,
          title: "End of Month Review",
          date: new Date(currentYear, currentMonth - 1, 28),
          startTime: "15:00",
          endTime: "16:30",
          type: "meeting",
          priority: "medium",
          participants: ["Alex Johnson", "Sarah Williams"]
        }
      ];

      setEvents([...mockEvents, ...nextMonthEvents, ...prevMonthEvents]);
      setLoading(false);
    };

    fetchEvents();
  }, [currentMonth, currentYear]);

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    });
  };

  // Handle new event submission
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    
    // Create a new event object
    const eventDate = new Date(newEvent.date);
    const newEventObj = {
      id: events.length + 1,
      title: newEvent.title,
      date: eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      priority: newEvent.priority
    };

    // Add the new event to the events array
    setEvents([...events, newEventObj]);
    
    // Reset the form and close the modal
    setNewEvent({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "meeting",
      priority: "medium"
    });
    setShowEventModal(false);
  };

  // Get color for event type
  const getEventTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200";
      case "task":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get icon for event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "deadline":
        return <AlertCircle className="h-4 w-4" />;
      case "task":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  // Get color for event priority
  const getEventPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Format time (e.g., "09:00" to "9:00 AM")
  const formatTime = (time) => {
    if (!time) return "";
    
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDate = today.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-gray-200 bg-gray-50 p-2"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === todayDate;
      const dayEvents = getEventsForDay(day);
      
      days.push(
        <div 
          key={day} 
          className={`h-32 border border-gray-200 p-2 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs text-gray-500">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{event.title}</span>
                  <span className={`text-xs ${getEventPriorityColor(event.priority)}`}>
                    {event.priority.charAt(0).toUpperCase()}
                  </span>
                </div>
                {event.startTime && (
                  <div className="flex items-center text-xs mt-0.5">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTime(event.startTime)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
        <button 
          onClick={() => setShowEventModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-medium text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <button 
          onClick={goToToday}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition-colors rounded-md text-gray-700"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-7 gap-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-medium text-gray-700 p-2">
                {day}
              </div>
            ))}
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-32 border border-gray-200 bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-7 gap-4">
            {dayNames.map(day => (
              <div key={day} className="text-center font-medium text-gray-700 p-2">
                {day}
              </div>
            ))}
            {generateCalendarGrid()}
          </div>
        </div>
      )}

      {/* Event Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h4 className="font-medium text-gray-800 mb-2">Event Types</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-700">Meeting</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-700">Deadline</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-700">Task</span>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Add New Event</h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmitEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="task">Task</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;