// applications/frontend/src/pages/AttendancePage.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.gray[900]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const AttendanceTable = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => props.status === 'present' && `
    background: ${props.theme.colors.success}20;
    color: ${props.theme.colors.success};
  `}
  
  ${props => props.status === 'absent' && `
    background: ${props.theme.colors.error}20;
    color: ${props.theme.colors.error};
  `}
  
  ${props => props.status === 'late' && `
    background: ${props.theme.colors.warning}20;
    color: ${props.theme.colors.warning};
  `}
`;

const AttendancePage = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, [user]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Mock attendance data
      const mockData = [
        {
          id: '1',
          course: 'Introduction to AWS Cloud Computing',
          date: '2024-01-15',
          time: '09:00 AM',
          status: 'present'
        },
        {
          id: '2',
          course: 'Advanced React Development',
          date: '2024-01-14',
          time: '02:00 PM',
          status: 'present'
        },
        {
          id: '3',
          course: 'Database Design and Management',
          date: '2024-01-13',
          time: '11:00 AM',
          status: 'late'
        },
        {
          id: '4',
          course: 'Introduction to AWS Cloud Computing',
          date: '2024-01-12',
          time: '09:00 AM',
          status: 'absent'
        },
        {
          id: '5',
          course: 'Advanced React Development',
          date: '2024-01-11',
          time: '02:00 PM',
          status: 'present'
        }
      ];

      // Calculate stats
      const totalClasses = mockData.length;
      const present = mockData.filter(item => item.status === 'present').length;
      const absent = mockData.filter(item => item.status === 'absent').length;
      const attendanceRate = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

      setAttendanceData(mockData);
      setStats({
        totalClasses,
        present,
        absent,
        attendanceRate
      });
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Attendance - AWS Education Platform</title>
        </Helmet>
        <PageContainer>
          <PageTitle>Attendance Tracking</PageTitle>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading attendance data...
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Attendance - AWS Education Platform</title>
      </Helmet>
      <PageContainer>
        <PageTitle>Attendance Tracking</PageTitle>
        
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalClasses}</StatValue>
            <StatLabel>Total Classes</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.present}</StatValue>
            <StatLabel>Classes Attended</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.absent}</StatValue>
            <StatLabel>Classes Missed</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.attendanceRate}%</StatValue>
            <StatLabel>Attendance Rate</StatLabel>
          </StatCard>
        </StatsGrid>

        <AttendanceTable>
          <TableHeader>Recent Attendance</TableHeader>
          <TableRow style={{ fontWeight: '600', background: '#f9fafb' }}>
            <div>Course</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
          </TableRow>
          {attendanceData.map(record => (
            <TableRow key={record.id}>
              <div>{record.course}</div>
              <div>{formatDate(record.date)}</div>
              <div>{record.time}</div>
              <div>
                <StatusBadge status={record.status}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </StatusBadge>
              </div>
            </TableRow>
          ))}
        </AttendanceTable>
      </PageContainer>
    </>
  );
};

export default AttendancePage;