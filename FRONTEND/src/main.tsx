import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthContextProvider } from './Context/UserContext.tsx'
import { ToggleProvider } from './Context/ToogleContext.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
  <ToggleProvider>


    <App />
 

  </ToggleProvider>
  </AuthContextProvider>,
)
