import Link from 'next/link'
import { FiFileText, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi'

const recentActivity = [
  { id: 1, type: 'new_document', message: 'New document submitted for verification', time: '2 minutes ago' },
  { id: 2, type: 'verification_complete', message: 'Document #1234 has been successfully verified', time: '1 hour ago' },
  { id: 3, type: 'verification_failed', message: 'Document #5678 failed verification', time: '3 hours ago' },
]

export default function VerifierDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Verifier Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Pending Verifications" value="12" icon={FiClock} color="text-yellow-600" bgColor="bg-yellow-100" />
        <DashboardCard title="Verified Documents" value="48" icon={FiCheckCircle} color="text-green-600" bgColor="bg-green-100" />
        <DashboardCard title="Failed Verifications" value="3" icon={FiAlertCircle} color="text-red-600" bgColor="bg-red-100" />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <li key={activity.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {activity.message}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/verifier/documents" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              View All Documents
            </Link>
            <Link href="/verifier/notifications" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              Check Notifications
            </Link>
            <Link href="/verifier/settings" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Update Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className={`${bgColor} overflow-hidden shadow rounded-lg`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}