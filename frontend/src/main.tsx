import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Videos from '@/scenes/Videos'
import Home from '@/scenes/Home'

import './index.css'
import Layout from './Layout'
import VideoPlayer from '@/scenes/VideoPlayer'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/videos',
        Component: Videos,
      },
      {
        path: '/videos/:videoId',
        Component: VideoPlayer,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
