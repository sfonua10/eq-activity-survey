import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import SurveyPage from './pages/SurveyPage.tsx'
import ResultsPage from './pages/ResultsPage.tsx'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SurveyPage /> },
      { path: 'results', element: <ResultsPage /> },
    ],
  },
], { basename: '/eq-activity-survey/' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexProvider>
  </StrictMode>,
)
