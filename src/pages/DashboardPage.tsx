import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, MessageSquare, Smile, 
  TrendingUp, AlertTriangle, User, 
  ArrowRight, Heart, Brain, Zap, Users, Shield, Database, Info,
  Megaphone, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import WellnessAgent from '../components/WellnessAgent';
import { Feedback } from '../types';

const DashboardPage: React.FC = () => {
  const { user, token, isFirebaseReady } = useAuth();
  const [stats, setStats] = useState({ chatCount: 0, moodAvg: 0, lastMood: null });
  const [moodData, setMoodData] = useState([]);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline'>('connected');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthRes = await fetch('/api/health');
        const health = await healthRes.json();
        if (health.db !== 'connected') {
          setDbStatus('offline');
        }

        const [chats, moods, feedbackRes] = await Promise.all([
          fetch('/api/chats', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
          fetch('/api/moods', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
          fetch('/api/feedback', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
        ]);
        
        setStats({
          chatCount: chats.length,
          moodAvg: moods.length > 0 ? parseFloat((moods.reduce((acc: number, m: any) => acc + m.mood, 0) / moods.length).toFixed(1)) : 0,
          lastMood: moods.length > 0 ? moods[moods.length - 1].mood : null
        });

        setMoodData(moods.map((m: any) => ({
          date: new Date(m.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          mood: m.mood
        })));

        setFeedbacks(feedbackRes);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchData();
  }, [token, user]);

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {dbStatus === 'offline' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Database className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 mb-1">Database Connection Required</h3>
                <p className="text-sm text-amber-800 mb-4">
                  The application is currently running in <strong>Offline Mode</strong> because it cannot connect to your MongoDB Atlas cluster. 
                  This is almost certainly due to <strong>IP Whitelisting</strong>.
                </p>
                <div className="bg-white/50 p-4 rounded-2xl border border-amber-100 text-xs space-y-2">
                  <p className="font-bold text-amber-900 flex items-center">
                    <Info className="h-3 w-3 mr-2" /> How to fix this:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-800">
                    <li>Log in to your <strong>MongoDB Atlas Dashboard</strong>.</li>
                    <li>Navigate to <strong>Network Access</strong> (under Security).</li>
                    <li>Click <strong>Add IP Address</strong>.</li>
                    <li>Select <strong>Allow Access From Anywhere</strong> (adds <code>0.0.0.0/0</code>).</li>
                    <li>Click <strong>Confirm</strong> and wait 1-2 minutes.</li>
                  </ol>
                </div>
                <p className="mt-4 text-[10px] text-amber-600 italic">
                  Note: You can still test the AI Chatbot, but your history will not be saved permanently until the database is connected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500">Here's a summary of your wellness journey.</p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Chatting
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Chats', value: stats.chatCount, icon: MessageSquare, color: 'primary' },
            { label: 'Avg Mood', value: stats.moodAvg, icon: Heart, color: 'accent' },
            { label: 'Current Status', value: stats.lastMood ? moodEmojis[stats.lastMood - 1] : 'N/A', icon: Smile, color: 'accent' },
            { label: 'Persona', value: user?.personalityType || 'N/A', icon: User, color: 'primary' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary/10' : 'accent/10'} flex items-center justify-center mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mood Analytics */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 flex items-center font-serif">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Mood Analytics
                </h3>
                <Link to="/mood" className="text-primary text-sm font-bold hover:underline">View Details</Link>
              </div>
              <div className="h-64 w-full">
                {moodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                      <YAxis domain={[1, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#5A5A40" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#5A5A40', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">No mood data available yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Feedback Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center font-serif">
                <Megaphone className="mr-2 h-5 w-5 text-accent" />
                Platform Updates & Feedback
              </h3>
              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center">
                    <p className="text-gray-400 text-sm italic">No updates from administrators yet.</p>
                  </div>
                ) : (
                  feedbacks.slice(0, 3).map((fb) => (
                    <motion.div 
                      key={fb._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center">
                          <Shield className="h-3 w-3 mr-1" /> {fb.adminName}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {new Date(fb.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{fb.message}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI Insights & Quick Actions */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-3xl shadow-xl text-white">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold font-serif">AI Insights</h3>
              </div>
              <p className="text-white/90 mb-6 leading-relaxed">
                {stats.moodAvg > 3.5 
                  ? "You've been doing great lately! Keep up the positive habits and remember to take small breaks."
                  : "It seems you've had some low moments. Remember, it's okay not to be okay. MindCare AI is here to listen whenever you're ready."}
              </p>
              <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl font-bold hover:bg-white/30 transition-all">
                Get Personalized Tips
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { name: 'Professional Help', path: '/help', icon: Users },
                  { name: 'Mental Awareness', path: '/awareness', icon: Brain },
                  { name: 'Privacy Settings', path: '/privacy', icon: Shield }
                ].map((link, i) => (
                  <Link
                    key={i}
                    to={link.path}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <WellnessAgent moodAvg={stats.moodAvg} lastMood={stats.lastMood} />
    </div>
  );
};

export default DashboardPage;
