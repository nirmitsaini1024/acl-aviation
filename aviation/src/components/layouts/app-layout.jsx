import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import BotUI from '../bot'

const AppLayout = ({ user, isBotOpen, setIsBotOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  console.log('applayout')

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
      </div>
      <div
        className={`flex-1 transition-all duration-300 overflow-auto ${collapsed ? "ml-16" : "ml-72"
          }`}
      >
        <div className="flex flex-col w-full">
          <DashboardHeader user={user} />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <BotUI isBotOpen={isBotOpen} setIsBotOpen={setIsBotOpen}/>
    </div>
  )
}

export default AppLayout