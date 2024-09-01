"use client"
import { useState } from 'react'
import { FiFileText, FiCheckCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi'

const initialNotifications = [
  { id: 1, type: 'new_document', message: 'New document submitted for verification', time: '2 minutes ago', read: false },
  { id: 2, type: 'verification_complete', message: 'Document #1234 has been successfully verified', time: '1 hour ago', read: false },
  { id: 3, type: 'verification_failed', message: 'Document #5678 failed verification', time: '3 hours ago', read: true },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const getIcon = (type) => {
    switch(type) {
      case 'new_document': return <FiFileText className="text-blue-500" />
      case 'verification_complete': return <FiCheckCircle className="text-green-500" />
      case 'verification_failed': return <FiAlertCircle className="text-red-500" />
      default: return <FiFileText className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li key={notification.id} className={`px-4 py-4 sm:px-6 ${notification.read ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}