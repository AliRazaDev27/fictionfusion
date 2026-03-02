"use client"

import { Book, Film, Tv, TrendingUp, Calendar, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { motion } from 'framer-motion'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function DashboardLayout({ total, list }: { total: any, list: any[] }) {
  const mediaData = [
    { name: 'Books', value: total.totalBooks },
    { name: 'Shows', value: total.totalShows },
    { name: 'Movies', value: total.totalMovies },
  ]

  const listData = list?.map((item) => {
    let dateStr = "N/A";
    if (item?.updatedAt) {
      dateStr = new Date(item.updatedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return {
      name: item?.listName || "Untitled List",
      type: item?.type || "Unknown",
      items: item?.items?.length || 0,
      lastUpdated: dateStr,
    }
  }) || []

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      className="min-h-screen space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="mb-8">
        <motion.h1
          className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          variants={itemVariants}
        >
          Dashboard
        </motion.h1>
        <motion.p
          className="text-muted-foreground mt-2"
          variants={itemVariants}
        >
          Overview of your media consumption and lists.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={total.totalBooks}
          icon={<Book className="h-5 w-5 text-blue-500" />}
          variants={itemVariants}
        />
        <StatsCard
          title="Total Movies"
          value={total.totalMovies}
          icon={<Film className="h-5 w-5 text-green-500" />}
          variants={itemVariants}
        />
        <StatsCard
          title="Total Shows"
          value={total.totalShows}
          icon={<Tv className="h-5 w-5 text-amber-500" />}
          variants={itemVariants}
        />
        <StatsCard
          title="Active Lists"
          value={list.length}
          icon={<Activity className="h-5 w-5 text-purple-500" />}
          variants={itemVariants}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Media Distribution Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className='h-full border-white/10 bg-black/40 backdrop-blur-xl shadow-xl'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Distribution
              </CardTitle>
              <CardDescription>Breakdown by media type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mediaData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {mediaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Lists */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className='h-full border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Lists
              </CardTitle>
              <CardDescription>Your latest curated collections</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white/5 text-xs uppercase text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4 rounded-tr-lg">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {listData.length > 0 ? (
                      listData.map((list, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 font-medium text-white group-hover:text-primary transition-colors">
                            {list.name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${list.type === 'book' ? 'bg-blue-500/10 text-blue-500' :
                                list.type === 'movie' ? 'bg-green-500/10 text-green-500' :
                                  list.type === 'show' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}
                                                `}>
                              {list.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{list.items}</td>
                          <td className="px-6 py-4 text-muted-foreground">{list.lastUpdated}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                          No lists found. Start creating some!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

function StatsCard({ title, value, icon, variants }: { title: string, value: number, icon: React.ReactNode, variants: any }) {
  return (
    <motion.div variants={variants}>
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-lg hover:bg-black/50 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
            {title}
          </CardTitle>
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}