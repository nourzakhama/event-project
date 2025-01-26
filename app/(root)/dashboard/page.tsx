'use client';

import { useState, useEffect } from 'react';
import DashNav from "@/components/ui/shared/DashNav";
import StatCard from "@/components/ui/shared/StatCard";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const fetchDashboardStats = async () => {
  const response = await fetch('http://localhost:4000/dashboard/stats');
  if (!response.ok) throw new Error('Failed to fetch dashboard statistics');
  return response.json();
};

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    completedEvents: 0,
    saturatedEvents: 0,
    cancelledEvents: 0,
    totalParticipants: 0,
    allResources: 0,
    resourcesUsed: 0,
    allEmployes: 0,
    employesBusy: 0,
    satisfaction: 0,  // Add satisfaction data here
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await fetchDashboardStats();
        // Adjust mapping to the response fields
        setStatistics({
          completedEvents: stats.encourEvents, // Mapping completed events
          saturatedEvents: stats.saturatedEvents,
          cancelledEvents: stats.cancelledEvents,
          totalParticipants: stats.totalParticipants,
          allResources: stats.allResources,
          resourcesUsed: stats.resourcesUsed,
          allEmployes: stats.allEmployes,
          employesBusy: stats.employesBusy,
          satisfaction: stats.satisfaction, // Mapping satisfaction
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Events', 'Resources', 'Employees'],
    datasets: [
      {
        label: 'Capacity',
        data: [
          statistics.completedEvents + statistics.saturatedEvents + statistics.cancelledEvents,
          statistics.allResources,
          statistics.allEmployes
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Used',
        data: [
          statistics.completedEvents,
          statistics.resourcesUsed,
          statistics.employesBusy
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Doughnut chart for satisfaction
  const satisfactionData = {
    labels: ['Satisfaction', 'Remaining'],
    datasets: [
      {
        data: [statistics.satisfaction, statistics.totalParticipants - statistics.satisfaction],  // Satisfaction comes first
        backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(255, 0, 0, 0.6)'],  // Blue for Satisfaction, Red for Remaining
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] h-screen">
          <DashNav />
          <main className="p-4 overflow-auto">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Completed Events" value={statistics.completedEvents} />
              <StatCard title="Saturated Events" value={statistics.saturatedEvents} />
              <StatCard title="Cancelled Events" value={statistics.cancelledEvents} />
              <StatCard title="Total Participants" value={statistics.totalParticipants} />
              <StatCard title="All Resources" value={statistics.allResources} />
              <StatCard title="Resources in Use" value={statistics.resourcesUsed} />
              <StatCard title="All Employees" value={statistics.allEmployes} />
              <StatCard title="Busy Employees" value={statistics.employesBusy} />
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Participant Satisfaction</h2>
              <div className="w-[300px] h-[300px] mx-auto"> {/* Increase size here */}
                <Doughnut data={satisfactionData} />
              </div>
            {/* Capacity vs. Used Bar Chart */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Capacity vs. Used</h2>
              <Bar data={chartData} />
            </div>

            {/* Satisfaction Doughnut Chart */}
           
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
