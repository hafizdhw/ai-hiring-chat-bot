'use client'

import { useAuth } from '@/lib/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp,
  Star
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'

// Dummy data for HR analytics
const weeklyApplicants = [
  { week: 'Week 1', applicants: 45, interviews: 12, hired: 3 },
  { week: 'Week 2', applicants: 52, interviews: 18, hired: 5 },
  { week: 'Week 3', applicants: 38, interviews: 15, hired: 4 },
  { week: 'Week 4', applicants: 61, interviews: 22, hired: 6 },
  { week: 'Week 5', applicants: 47, interviews: 16, hired: 3 },
  { week: 'Week 6', applicants: 55, interviews: 20, hired: 7 },
  { week: 'Week 7', applicants: 43, interviews: 14, hired: 4 },
  { week: 'Week 8', applicants: 58, interviews: 19, hired: 5 },
]

const monthlyTrends = [
  { month: 'Jan', applicants: 180, interviews: 65, hired: 18 },
  { month: 'Feb', applicants: 220, interviews: 78, hired: 22 },
  { month: 'Mar', applicants: 195, interviews: 72, hired: 20 },
  { month: 'Apr', applicants: 250, interviews: 85, hired: 25 },
  { month: 'May', applicants: 280, interviews: 95, hired: 28 },
  { month: 'Jun', applicants: 320, interviews: 110, hired: 32 },
]

const departmentData = [
  { name: 'Engineering', applicants: 45, hired: 12, color: '#3B82F6' },
  { name: 'Marketing', applicants: 32, hired: 8, color: '#10B981' },
  { name: 'Sales', applicants: 28, hired: 6, color: '#F59E0B' },
  { name: 'HR', applicants: 15, hired: 3, color: '#EF4444' },
  { name: 'Finance', applicants: 22, hired: 5, color: '#8B5CF6' },
]

const experienceLevels = [
  { level: 'Entry Level', count: 45, percentage: 35 },
  { level: 'Mid Level', count: 52, percentage: 40 },
  { level: 'Senior Level', count: 25, percentage: 19 },
  { level: 'Executive', count: 8, percentage: 6 },
]

const topSkills = [
  { skill: 'JavaScript', count: 85, trend: '+12%' },
  { skill: 'Python', count: 72, trend: '+8%' },
  { skill: 'React', count: 68, trend: '+15%' },
  { skill: 'Node.js', count: 54, trend: '+5%' },
  { skill: 'AWS', count: 48, trend: '+20%' },
]

const timeToHire = [
  { stage: 'Application', days: 1 },
  { stage: 'Screening', days: 3 },
  { stage: 'Interview', days: 7 },
  { stage: 'Decision', days: 2 },
  { stage: 'Offer', days: 1 },
]

export default function DashboardPage() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getUsername = () => {
    return user?.user_metadata.full_name || 'User'
  }

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {getUsername()}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your recruitment process today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="glass-effect rounded-full px-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+12% last month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="glass-effect rounded-full px-2">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Hired This Month</p>
                    <p className="text-2xl font-bold text-gray-900">32</p>
                    <p className="text-sm text-green-600">+8% last month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="glass-effect rounded-full px-2">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                    <p className="text-2xl font-bold text-gray-900">14 days</p>
                    <p className="text-sm text-red-600">-2 days last month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="glass-effect rounded-full px-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">12.5%</p>
                    <p className="text-sm text-green-600">+1.2% last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Applicants Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Applicants Trend</h3>
                <p className="text-sm text-gray-600">Last 8 weeks</p>
              </div>
              <div className="card-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyApplicants}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applicants" fill="#3B82F6" name="Applicants" />
                    <Bar dataKey="interviews" fill="#10B981" name="Interviews" />
                    <Bar dataKey="hired" fill="#F59E0B" name="Hired" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
                <p className="text-sm text-gray-600">Year to date</p>
              </div>
              <div className="card-content">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="applicants" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="interviews" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="hired" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        {/* Department and Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Department Distribution */}
            <div className="card flex-1">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Department Distribution</h3>
                <p className="text-sm text-gray-600">Current openings</p>
              </div>
              <div className="card-content">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="applicants"
                      label={({ name }) => `${name}`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Experience Levels */}
              <div className="card flex-1">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Experience Levels</h3>
                  <p className="text-sm text-gray-600">Current applicants</p>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    {experienceLevels.map((level) => (
                      <div key={level.level} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium text-gray-700">{level.level}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{level.count}</p>
                          <p className="text-xs text-gray-500">{level.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Skills */}
              <div className="card flex-1">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Top Skills in Demand</h3>
                  <p className="text-sm text-gray-600">Most requested skills</p>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    {topSkills.map((skill) => (
                      <div key={skill.skill} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{skill.count}</p>
                          <p className="text-xs text-green-600">{skill.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Time to Hire Process */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Time to Hire Process</h3>
            <p className="text-sm text-gray-600">Average days per stage</p>
          </div>
          <div className="card-content">
            <div className="flex items-center justify-between">
              {timeToHire.map((stage, index) => (
                <div key={stage.stage} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <span className="text-sm font-semibold text-blue-600">{stage.days}</span>
                  </div>
                  <p className="text-xs text-gray-600 text-center">{stage.stage}</p>
                  {index < timeToHire.length - 1 && (
                    <div className="hidden md:block w-16 h-0.5 bg-gray-300 mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
