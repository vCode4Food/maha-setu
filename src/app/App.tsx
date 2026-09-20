import { AppRoutes } from './routes'
import { AuthProvider } from '@/context/AuthContext'
import { AppProvider } from '@/context/AppContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { ToastStack } from '@/components/ui/widgets'
import { AIChatWidget } from '@/features/chatbot/AIChatWidget'
import { SearchShortcut } from '@/features/search/SearchShortcut'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NotificationProvider>
          <AppRoutes />
          <SearchShortcut />
          <AIChatWidget />
          <ToastStack />
        </NotificationProvider>
      </AppProvider>
    </AuthProvider>
  )
}
