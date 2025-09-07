// applications/frontend/src/pages/MarksPage.js

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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SummaryCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const SummaryLabel = styled.div`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

const CoursesContainer = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const CourseCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const CourseHeader = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const CourseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const GradeOverview = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const GradeCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  color: white;
  
  ${props => {
    const grade = parseFloat(props.grade);
    if (grade >= 90) return `background: ${props.theme.colors.success};`;
    if (grade >= 80) return `background: ${props.theme.colors.info};`;
    if (grade >= 70) return `background: ${props.theme.colors.warning};`;
    return `background: ${props.theme.colors.error};`;
  }}
`;

const AssignmentsTable = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} 0;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const GradeBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    const grade = parseFloat(props.grade);
    if (grade >= 90) return `
      background: ${props.theme.colors.success}20;
      color: ${props.theme.colors.success};
    `;
    if (grade >= 80) return `
      background: ${props.theme.colors.info}20;
      color: ${props.theme.colors.info};
    `;
    if (grade >= 70) return `
      background: ${props.theme.colors.warning}20;
      color: ${props.theme.colors.warning};
    `;
    return `
      background: ${props.theme.colors.error}20;
      color: ${props.theme.colors.error};
    `;
  }}
`;

const MarksPage = () => {
  const { user } = useAuth();
  const [coursesData, setCoursesData] = useState([]);
  const [summary, setSummary] = useState({
    overallGPA: 0,
    totalCourses: 0,
    completedAssignments: 0,
    averageGrade: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarksData();
  }, [user]);

  const fetchMarksData = async () => {
    try {
      setLoading(true);
      
      // Mock marks data
      const mockData = [
        {
          id: '1',
          title: 'Introduction to AWS Cloud Computing',
          instructor: 'Dr. Sarah Johnson',
          overallGrade: 88.5,
          assignments: [
            { name: 'Quiz 1: AWS Basics', grade: 92, maxGrade: 100, dueDate: '2024-01-10' },
            { name: 'Assignment 1: EC2 Setup', grade: 85, maxGrade: 100, dueDate: '2024-01-15' },
            { name: 'Midterm Exam', grade: 88, maxGrade: 100, dueDate: '2024-01-20' },
            { name: 'Final Project', grade: 90, maxGrade: 100, dueDate: '2024-01-25' }
          ]
        },
        {
          id: '2',
          title: 'Advanced React Development',
          instructor: 'Prof. Michael Chen',
          overallGrade: 92.3,
          assignments: [
            { name: 'Component Design Quiz', grade: 95, maxGrade: 100, dueDate: '2024-01-12' },
            { name: 'Hooks Assignment', grade: 88, maxGrade: 100, dueDate: '2024-01-18' },
            { name: 'State Management Project', grade: 94, maxGrade: 100, dueDate: '2024-01-22' }
          ]
        },
        {
          id: '3',
          title: 'Database Design and Management',
          instructor: 'Dr. Emily Rodriguez',
          overallGrade: 76.8,
          assignments: [
            { name: 'SQL Basics Quiz', grade: 82, maxGrade: 100, dueDate: '2024-01-08' },
            { name: 'Database Design Project', grade: 75, maxGrade: 100, dueDate: '2024-01-16' },
            { name: 'Normalization Assignment', grade: 74, maxGrade: 100, dueDate: '2024-01-24' }
          ]
        }
      ];

      // Calculate summary statistics
      const totalCourses = mockData.length;
      const totalAssignments = mockData.reduce((sum, course) => sum + course.assignments.length, 0);
      const averageGrade = mockData.reduce((sum, course) => sum + course.overallGrade, 0) / totalCourses;
      const overallGPA = (averageGrade / 100) * 4.0; // Convert to 4.0 scale

      setCoursesData(mockData);
      setSummary({
        overallGPA: overallGPA.toFixed(2),
        totalCourses,
        completedAssignments: totalAssignments,
        averageGrade: averageGrade.toFixed(1)
      });
    } catch (error) {
      console.error('Error fetching marks data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Marks & Grades - AWS Education Platform</title>
        </Helmet>
        <PageContainer>
          <PageTitle>Marks & Grades</PageTitle>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading grades data...
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Marks & Grades - AWS Education Platform</title>
      </Helmet>
      <PageContainer>
        <PageTitle>Marks & Grades</PageTitle>
        
        <SummaryGrid>
          <SummaryCard>
            <SummaryValue>{summary.overallGPA}</SummaryValue>
            <SummaryLabel>Overall GPA</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{summary.totalCourses}</SummaryValue>
            <SummaryLabel>Total Courses</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{summary.completedAssignments}</SummaryValue>
            <SummaryLabel>Completed Assignments</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{summary.averageGrade}%</SummaryValue>
            <SummaryLabel>Average Grade</SummaryLabel>
          </SummaryCard>
        </SummaryGrid>

        <CoursesContainer>
          {coursesData.map(course => (
            <CourseCard key={course.id}>
              <CourseHeader>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseInfo>
                  <span>Instructor: {course.instructor}</span>
                  <GradeOverview>
                    <span>Overall Grade:</span>
                    <GradeCircle grade={course.overallGrade}>
                      {course.overallGrade.toFixed(0)}%
                    </GradeCircle>
                  </GradeOverview>
                </CourseInfo>
              </CourseHeader>
              
              <AssignmentsTable>
                <TableHeader>
                  <div>Assignment</div>
                  <div>Grade</div>
                  <div>Max Points</div>
                  <div>Due Date</div>
                </TableHeader>
                {course.assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <div>{assignment.name}</div>
                    <div>
                      <GradeBadge grade={assignment.grade}>
                        {assignment.grade}%
                      </GradeBadge>
                    </div>
                    <div>{assignment.maxGrade}</div>
                    <div>{formatDate(assignment.dueDate)}</div>
                  </TableRow>
                ))}
              </AssignmentsTable>
            </CourseCard>
          ))}
        </CoursesContainer>
      </PageContainer>
    </>
  );
};

export default MarksPage;