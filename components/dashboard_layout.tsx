"use client"

import Link from 'next/link'
import { Book, Film, Tv, List, PlusCircle, User } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const COLORS = ['#0088FE', '#00B55F', '#FFBB28'];

export function DashboardLayout({total,list}) {
  // In a real application, you would fetch this data from your database
  // const totalBooks = 1250
  // const totalShows = 580
  // const totalMovies = 920

  const mediaData = [
    { name: 'Books', value: total.totalBooks },
    { name: 'Shows', value: total.totalShows },
    { name: 'Movies', value: total.totalMovies },
  ]

  const listDataa = [
    { name: 'Summer Reads 2023', type: 'Books', items: 12, lastUpdated: '2 days ago' },
    { name: 'Must-Watch Sci-Fi', type: 'Movies & Shows', items: 8, lastUpdated: '1 week ago' },
    { name: 'Classic Literature', type: 'Books', items: 20, lastUpdated: '3 days ago' },
    { name: 'Favorite Comedies', type: 'Movies & Shows', items: 15, lastUpdated: '5 days ago' },
    { name: 'Thriller Novels', type: 'Books', items: 10, lastUpdated: '1 day ago' },
  ]
  const listData = list.map((item) => {
    return {
      name: item?.listName,
      type: item?.type,
      items: item?.items?.length,
      lastUpdated: item?.updatedAt?.toDateString(),
    }
  })
  console.log(listData)

  return (
    <div className="min-h-screen ">
     

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Media Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Media Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mediaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mediaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 sam:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total.totalBooks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total.totalMovies}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
                <Tv className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total.totalShows}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Lists */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle>All Lists</CardTitle>
              
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Items</th>
                    <th className="text-left py-2 px-4">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((list, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{list.name}</td>
                      <td className="py-2 px-4">{list.type}</td>
                      <td className="py-2 px-4">{list.items}</td>
                      <td className="py-2 px-4">{list.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}