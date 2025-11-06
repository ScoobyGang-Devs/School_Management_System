import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from '@/components/ui/button.jsx'
import {AppSidebar} from '@/components/app-sidebar.jsx'
import { SidebarProvider } from './components/ui/sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SidebarProvider> 
         <AppSidebar />
    </SidebarProvider>


    

    </>
  )
}

export default App
