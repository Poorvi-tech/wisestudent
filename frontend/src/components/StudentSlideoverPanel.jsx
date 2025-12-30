import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, MessageSquare, Flag, Eye, 
  Activity, Heart, Trophy, Zap, Coins, Calendar,
  Clock, AlertTriangle, FileText, Send, Save,
  TrendingUp, Brain, Target, Award, Flame
} from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const StudentSlideoverPanel = ({ student, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [_notes, setNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, student]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/school/teacher/student/${student._id}/details`);
      setStudentDetails(response.data);
      setNotes(response.data.notes || '');
      setIsFlagged(response.data.flagged || false);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      await api.post(`/api/school/teacher/student/${student._id}/notes`, {
        note: newNote.trim()
      });
      toast.success('Note saved successfully');
      setNewNote('');
      fetchStudentDetails();
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleToggleFlag = async () => {
    try {
      await api.put(`/api/school/teacher/student/${student._id}/flag`, {
        flagged: !isFlagged,
        reason: !isFlagged ? 'Needs attention' : null
      });
      setIsFlagged(!isFlagged);
      toast.success(isFlagged ? 'Student unflagged' : 'Student flagged for counselor');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling flag:', error);
      toast.error('Failed to update flag');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await api.post(`/api/school/teacher/student/${student._id}/message`, {
        message: messageText.trim()
      });
      toast.success('Message sent successfully');
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (!student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Slide-over Panel */}
          <Motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 z-10 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={student.avatar || '/avatars/avatar1.png'}
                      alt={student.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-xl ring-4 ring-white/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black drop-shadow-lg">{student.name}</h2>
                    <p className="text-white/90 text-sm font-medium">{student.email}</p>
                  </div>
                </div>
                <Motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </Motion.button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <Motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-500/30 to-cyan-600/30 backdrop-blur-md rounded-xl p-3 text-center border border-white/20 shadow-lg"
                >
                  <Zap className="w-5 h-5 mx-auto mb-1 drop-shadow-md" />
                  <p className="text-xl font-black drop-shadow-md">{student.level || 1}</p>
                  <p className="text-xs opacity-90 font-semibold">Level</p>
                </Motion.div>
                <Motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-amber-500/30 to-orange-600/30 backdrop-blur-md rounded-xl p-3 text-center border border-white/20 shadow-lg"
                >
                  <Trophy className="w-5 h-5 mx-auto mb-1 drop-shadow-md" />
                  <p className="text-xl font-black drop-shadow-md">{student.xp || 0}</p>
                  <p className="text-xs opacity-90 font-semibold">XP</p>
                </Motion.div>
                <Motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-yellow-500/30 to-amber-600/30 backdrop-blur-md rounded-xl p-3 text-center border border-white/20 shadow-lg"
                >
                  <Coins className="w-5 h-5 mx-auto mb-1 drop-shadow-md" />
                  <p className="text-xl font-black drop-shadow-md">{student.coins || 0}</p>
                  <p className="text-xs opacity-90 font-semibold">Coins</p>
                </Motion.div>
                <Motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-red-500/30 to-pink-600/30 backdrop-blur-md rounded-xl p-3 text-center border border-white/20 shadow-lg"
                >
                  <Flame className="w-5 h-5 mx-auto mb-1 drop-shadow-md" />
                  <p className="text-xl font-black drop-shadow-md">{student.streak || 0}</p>
                  <p className="text-xs opacity-90 font-semibold">Streak</p>
                </Motion.div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white sticky top-[180px] z-10 shadow-sm">
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 px-4 py-3 font-bold transition-all relative ${
                  activeTab === 'timeline'
                    ? 'text-indigo-600 bg-gradient-to-b from-indigo-50 to-purple-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Timeline
                {activeTab === 'timeline' && (
                  <Motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                  />
                )}
              </Motion.button>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-4 py-3 font-bold transition-all relative ${
                  activeTab === 'notes'
                    ? 'text-purple-600 bg-gradient-to-b from-purple-50 to-pink-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Notes
                {activeTab === 'notes' && (
                  <Motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                  />
                )}
              </Motion.button>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('actions')}
                className={`flex-1 px-4 py-3 font-bold transition-all relative ${
                  activeTab === 'actions'
                    ? 'text-pink-600 bg-gradient-to-b from-pink-50 to-rose-50'
                    : 'text-gray-600 hover:text-pink-600 hover:bg-gray-50'
                }`}
              >
                <Send className="w-4 h-4 inline mr-2" />
                Actions
                {activeTab === 'actions' && (
                  <Motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 to-rose-600"
                  />
                )}
              </Motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
                  />
                  <p className="text-sm font-semibold text-gray-500">Loading comprehensive dashboard data</p>
                </div>
              ) : (
                <>
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                            <Activity className="w-5 h-5 text-white" />
                          </div>
                          Recent Activity Timeline
                        </h3>
                        {loading && (
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                            />
                            Loading...
                          </div>
                        )}
                      </div>
                      {studentDetails?.timeline && studentDetails.timeline.length > 0 ? (
                        studentDetails.timeline.map((item, idx) => (
                          <Motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200/50 shadow-md hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                                {item.type === 'mission' ? <Target className="w-5 h-5" /> :
                                 item.type === 'mood' ? <Heart className="w-5 h-5" /> :
                                 <Activity className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 mb-1">{item.action}</p>
                                <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                </p>
                              </div>
                            </div>
                          </Motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity className="w-8 h-8 text-indigo-400" />
                          </div>
                          <p className="font-semibold">No recent activity</p>
                          <p className="text-xs mt-1">Activity will appear here as the student engages</p>
                        </div>
                      )}

                      {/* Mood Summary */}
                      {studentDetails?.recentMood && (
                        <Motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-5 bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 rounded-xl border-2 border-pink-200/50 shadow-md"
                        >
                          <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            Recent Mood
                          </h4>
                          <div className="flex items-center gap-3">
                            <div className="text-4xl drop-shadow-md">{studentDetails.recentMood.emoji || '😊'}</div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-lg">{studentDetails.recentMood.mood || 'Happy'}</p>
                              <p className="text-sm text-gray-600 font-semibold">Score: {studentDetails.recentMood.score || 3}/5</p>
                            </div>
                          </div>
                        </Motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          Teacher Notes
                        </h3>
                      </div>

                      {/* Add New Note */}
                      <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-xl p-5 border-2 border-purple-200/50 shadow-md"
                      >
                        <textarea
                          placeholder="Add a new note about this student..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none font-medium"
                        />
                        <Motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveNote}
                          className="mt-3 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 w-full justify-center"
                        >
                          <Save className="w-4 h-4" />
                          Save Note
                        </Motion.button>
                      </Motion.div>

                      {/* Existing Notes */}
                      <div className="space-y-3">
                        {studentDetails?.notes && studentDetails.notes.length > 0 ? (
                          studentDetails.notes.map((note, idx) => (
                            <Motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-4 bg-white rounded-xl border-2 border-gray-200/50 shadow-md hover:shadow-lg transition-all"
                            >
                              <p className="text-gray-800 mb-3 font-medium leading-relaxed">{note.text}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span className="flex items-center gap-1 font-semibold">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(note.date).toLocaleDateString()}
                                </span>
                                <span className="font-semibold">By: {note.teacher || 'You'}</span>
                              </div>
                            </Motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-400">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <FileText className="w-8 h-8 text-purple-400" />
                            </div>
                            <p className="font-semibold">No notes yet</p>
                            <p className="text-xs mt-1">Add your first note above</p>
                          </div>
                        )}
                      </div>

                      {/* Consent Flags */}
                      {studentDetails?.consentFlags && (
                        <Motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-xl border-2 border-amber-200/50 shadow-md"
                        >
                          <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                            Consent & Permissions
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(studentDetails.consentFlags).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200/50">
                                <span className="text-sm text-gray-700 font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                  value ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                                }`}>
                                  {value ? 'Granted' : 'Not Granted'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === 'actions' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                            <Send className="w-5 h-5 text-white" />
                          </div>
                          Quick Actions
                        </h3>
                      </div>

                      {/* Send Message */}
                      <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200/50 shadow-md"
                      >
                        <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          Notify Student
                        </h4>
                        <textarea
                          placeholder="Type your message to the student..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none font-medium"
                        />
                        <Motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSendMessage}
                          className="mt-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 w-full justify-center"
                        >
                          <Send className="w-4 h-4" />
                          Send Notification
                        </Motion.button>
                      </Motion.div>

                      {/* Row: Flag + Full Profile */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Flag for Counselor */}
                        <Motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`rounded-xl p-5 border-2 h-full shadow-md ${
                            isFlagged 
                              ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300' 
                              : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                          }`}
                        >
                          <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${isFlagged ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gray-400'}`}>
                              <Flag className="w-4 h-4 text-white" />
                            </div>
                            Flag for Counselor
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            {isFlagged 
                              ? 'This student is currently flagged and will be reviewed by counselor'
                              : 'Flag this student if they need counselor attention'}
                          </p>
                          <Motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleToggleFlag}
                            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 w-full justify-center ${
                              isFlagged
                                ? 'bg-gradient-to-r from-gray-600 to-slate-700 text-white hover:shadow-lg'
                                : 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white hover:shadow-lg'
                            }`}
                          >
                            <Flag className="w-4 h-4" />
                            {isFlagged ? 'Remove Flag' : 'Flag Student'}
                          </Motion.button>
                        </Motion.div>

                        {/* View Full Profile */}
                        <Motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl p-5 border-2 border-purple-200/50 h-full shadow-md"
                        >
                          <h4 className="font-black text-gray-900 mb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                            Full Profile
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            View complete analytics and progress reports
                          </p>
                          <Motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onClose();
                              window.location.href = `/school-teacher/student/${student._id}/progress`;
                            }}
                            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 w-full justify-center"
                          >
                            <Eye className="w-4 h-4" />
                            View Full Profile
                          </Motion.button>
                        </Motion.div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentSlideoverPanel;

