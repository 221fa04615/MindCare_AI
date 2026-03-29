import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Meh, Heart, Calendar, Plus, Loader2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const MoodTrackingPage: React.FC = () => {
  const { token } = useAuth();
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'primary' },
    { value: 2, emoji: '😕', label: 'Sad', color: 'primary' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'accent' },
    { value: 4, emoji: '🙂', label: 'Happy', color: 'accent' },
    { value: 5, emoji: '😊', label: 'Very Happy', color: 'accent' },
  ];

  useEffect(() => {
    fetchMoods();
  }, [token]);

  const fetchMoods = async () => {
    try {
      const res = await fetch('/api/moods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMoods(data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setLoading(true);
    try {
      const res = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mood: selectedMood, note }),
      });

      if (res.ok) {
        setSuccess(true);
        setSelectedMood(null);
        setNote('');
        fetchMoods();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 font-serif">How are you feeling?</h1>
          <p className="text-gray-500 mt-2">Track your daily mood and see your emotional progress.</p>
        </div>

        {/* Mood Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-5 gap-4">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedMood(option.value)}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                    selectedMood === option.value
                      ? `bg-${option.color}/10 border-2 border-${option.color} scale-110`
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="text-4xl mb-2">{option.emoji}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    selectedMood === option.value ? `text-${option.color}` : 'text-gray-400'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 font-serif">Add a note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind today?"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedMood || loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : success ? (
                <span className="flex items-center"><CheckCircle className="mr-2 h-6 w-6" /> Mood Saved!</span>
              ) : (
                <span className="flex items-center"><Plus className="mr-2 h-6 w-6" /> Log Daily Mood</span>
              )}
            </button>
          </form>
        </motion.div>

        {/* Mood History */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center font-serif">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Recent History
          </h3>
          <div className="grid gap-4">
            {moods.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">No mood logs yet. Start tracking today!</p>
              </div>
            ) : (
              moods.map((entry: any) => {
                const mood = moodOptions.find(m => m.value === entry.mood);
                return (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{mood?.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-900">{mood?.label}</p>
                        <p className="text-sm text-gray-500">{format(new Date(entry.date), 'MMMM d, yyyy • h:mm a')}</p>
                        {entry.note && <p className="text-sm text-gray-600 mt-1 italic">"{entry.note}"</p>}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${entry.mood > 3 ? 'bg-accent' : 'bg-primary'} shadow-lg`}></div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackingPage;
