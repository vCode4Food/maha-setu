import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppRoutes } from './routes/AppRoutes';
import { ThemeProvider } from './components/theme/ThemeProvider';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
