import { FiBell, FiUser } from 'react-icons/fi'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Verifier Portal</h1>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <FiBell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="flex items-center max-w-xs bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu" aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  <FiUser className="h-8 w-8 rounded-full p-1 bg-gray-300 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
