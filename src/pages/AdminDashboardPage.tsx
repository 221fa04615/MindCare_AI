import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  Shield, Users, MessageSquare, AlertTriangle, 
  TrendingUp, CheckCircle, XCircle, Loader2,
  BarChart, Activity, UserCheck, Send
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ userCount: 0, chatCount: 0, crisisCount: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: feedback })
      });
      if (res.ok) {
        setFeedback('');
        alert('Feedback submitted successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
          fetch('/api/admin/crisis', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
        ]);
        setStats(statsRes);
        setAlerts(alertsRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAdminData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Command Center</h1>
            <p className="text-gray-500">Monitoring platform health and critical alerts.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.userCount, icon: Users, color: 'primary' },
            { label: 'Total Messages', value: stats.chatCount, icon: MessageSquare, color: 'accent' },
            { label: 'Active Crisis Alerts', value: stats.crisisCount, icon: AlertTriangle, color: 'red' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'red' ? 'red-50' : stat.color + '/10'} flex items-center justify-center mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color === 'red' ? 'text-red-600' : 'text-' + stat.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Crisis Alerts Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center font-serif">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Critical Crisis Alerts
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
              Real-time Monitoring
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Message</th>
                  <th className="px-8 py-4">Timestamp</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                      No crisis alerts detected. All systems are stable.
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert: any) => (
                    <tr key={alert._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{alert.userId?.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">{alert.userId?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">{alert.message}</p>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          alert.resolved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {alert.resolved ? 'Resolved' : 'Critical'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <button className="text-primary hover:text-primary/80 font-bold text-sm">
                          Review Chat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Analytics Mock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Feedback Submission */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center font-serif">
              <Send className="mr-2 h-5 w-5 text-primary" />
              Send Platform Feedback
            </h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share updates, tips, or feedback with all users..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]"
              />
              <button
                type="submit"
                disabled={submitting || !feedback.trim()}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Broadcast Feedback'}
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center font-serif">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Sentiment Distribution
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Positive', value: 45, color: 'bg-accent' },
                { label: 'Neutral', value: 30, color: 'bg-primary' },
                { label: 'Stress/Anxiety', value: 20, color: 'bg-primary/60' },
                { label: 'Crisis', value: 5, color: 'bg-red-500' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center font-serif">
              <Activity className="mr-2 h-5 w-5 text-accent" />
              System Health
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">API Status</p>
                <div className="flex items-center text-green-600 font-bold">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Healthy
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">DB Connection</p>
                <div className="flex items-center text-green-600 font-bold">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Active
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">AI Latency</p>
                <div className="flex items-center text-primary font-bold">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  1.2s
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Active Sockets</p>
                <div className="flex items-center text-teal-600 font-bold">
                  <UserCheck className="h-4 w-4 mr-1" />
                  {stats.userCount > 0 ? Math.floor(stats.userCount / 2) : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
