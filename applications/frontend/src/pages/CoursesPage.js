// applications/frontend/src/pages/CoursesPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const CourseCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CourseImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const CourseContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.gray[900]};
`;

const CourseDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.5;
`;

const CourseStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.gray[600]};

  h3 {
    font-size: 1.5rem;
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.gray[700]};
  }
`;

const CoursesPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockCourses = [
        {
          id: '1',
          title: 'Introduction to AWS Cloud Computing',
          description: 'Learn the fundamentals of AWS cloud services and architecture.',
          instructor: 'Dr. Sarah Johnson',
          students: 45,
          lessons: 12,
          duration: '8 weeks',
          icon: 'Cloud'
        },
        {
          id: '2',
          title: 'Advanced React Development',
          description: 'Master advanced React concepts including hooks, context, and performance optimization.',
          instructor: 'Prof. Michael Chen',
          students: 32,
          lessons: 15,
          duration: '10 weeks',
          icon: 'React'
        },
        {
          id: '3',
          title: 'Database Design and Management',
          description: 'Comprehensive course on database design, SQL, and database administration.',
          instructor: 'Dr. Emily Rodriguez',
          students: 28,
          lessons: 18,
          duration: '12 weeks',
          icon: 'Database'
        }
      ];

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourses(mockCourses);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    console.log('Opening course:', course.title);
    // Navigation logic would go here
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Courses - AWS Education Platform</title>
        </Helmet>
        <PageContainer>
          <PageTitle>My Courses</PageTitle>
          <LoadingSpinner>Loading courses...</LoadingSpinner>
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Courses - AWS Education Platform</title>
        </Helmet>
        <PageContainer>
          <PageTitle>My Courses</PageTitle>
          <EmptyState>
            <h3>Error Loading Courses</h3>
            <p>{error}</p>
          </EmptyState>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Courses - AWS Education Platform</title>
      </Helmet>
      <PageContainer>
        <PageTitle>My Courses</PageTitle>
        
        {courses.length === 0 ? (
          <EmptyState>
            <h3>No Courses Found</h3>
            <p>You haven't enrolled in any courses yet.</p>
          </EmptyState>
        ) : (
          <CoursesGrid>
            {courses.map(course => (
              <CourseCard key={course.id} onClick={() => handleCourseClick(course)}>
                <CourseImage>
                  {course.icon}
                </CourseImage>
                <CourseContent>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseDescription>{course.description}</CourseDescription>
                  <CourseStats>
                    <span>{course.students} students</span>
                    <span>{course.lessons} lessons</span>
                    <span>{course.duration}</span>
                  </CourseStats>
                </CourseContent>
              </CourseCard>
            ))}
          </CoursesGrid>
        )}
      </PageContainer>
    </>
  );
};

export default CoursesPage;
