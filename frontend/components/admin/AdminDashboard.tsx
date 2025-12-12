'use client'

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%' },
    { title: 'Active Programs', value: '45', change: '+5%' },
    { title: 'Revenue', value: '$12,345', change: '+18%' },
    { title: 'Completion Rate', value: '87%', change: '+3%' }
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Recent activity will appear here
        </p>
      </div>
    </div>
  )
}
