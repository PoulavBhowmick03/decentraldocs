import { FiAlertCircle } from 'react-icons/fi'

export default function Error({ message }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {message || 'An error occurred. Please try again later.'}
          </p>
        </div>
      </div>
    </div>
  )
}