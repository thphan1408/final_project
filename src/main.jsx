import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'

import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext/UserContext.jsx'
import { Provider } from 'react-redux'
import { store } from './layouts/AdminLayout/redux/index.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: true,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <BrowserRouter>
        <UserProvider>
          <Provider store={store}>
            <Suspense>
              <App />
            </Suspense>
          </Provider>
        </UserProvider>
      </BrowserRouter>
    </HelmetProvider>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
)
