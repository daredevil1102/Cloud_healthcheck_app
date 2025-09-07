// applications/frontend/src/pages/ProfilePage.js

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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  height: fit-content;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 600;
  margin: 0 auto ${props => props.theme.spacing.lg};
`;

const ProfileName = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProfileRole = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.gray[600]};
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.gray[900]};
`;

const SettingsCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[700]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.colors.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xl};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${props => props.variant === 'primary' && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.secondary};
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: ${props.theme.colors.gray[700]};
    border-color: ${props.theme.colors.gray[300]};
    
    &:hover {
      background: ${props.theme.colors.gray[50]};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    studentId: '',
    bio: '',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    gradeNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Mock profile data
      const mockData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        department: 'Computer Science',
        studentId: 'CS2024001',
        bio: 'Passionate about cloud computing and web development. Currently pursuing advanced studies in AWS technologies.',
        theme: 'light',
        emailNotifications: true,
        pushNotifications: true,
        courseUpdates: true,
        gradeNotifications: true
      };

      setProfileData(mockData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile updated:', profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchProfileData();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Profile - AWS Education Platform</title>
        </Helmet>
        <PageContainer>
          <PageTitle>My Profile</PageTitle>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading profile data...
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - AWS Education Platform</title>
      </Helmet>
      <PageContainer>
        <PageTitle>My Profile</PageTitle>
        
        <ProfileGrid>
          <ProfileCard>
            <Avatar>
              {getInitials(profileData.firstName, profileData.lastName)}
            </Avatar>
            <ProfileName>
              {profileData.firstName} {profileData.lastName}
            </ProfileName>
            <ProfileRole>Student</ProfileRole>
            
            <ProfileInfo>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{profileData.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{profileData.phone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Department</InfoLabel>
                <InfoValue>{profileData.department}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Student ID</InfoLabel>
                <InfoValue>{profileData.studentId}</InfoValue>
              </InfoItem>
            </ProfileInfo>
          </ProfileCard>

          <SettingsCard>
            <SectionTitle>Profile Settings</SectionTitle>
            
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Department</Label>
              <Select
                value={profileData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Bio</Label>
              <Input
                as="textarea"
                rows="4"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </FormGroup>

            <SectionTitle style={{ marginTop: '2rem' }}>Preferences</SectionTitle>

            <FormGroup>
              <Label>Theme</Label>
              <Select
                value={profileData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Notifications</Label>
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    checked={profileData.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  />
                  Email notifications
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    checked={profileData.pushNotifications}
                    onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                  />
                  Push notifications
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    checked={profileData.courseUpdates}
                    onChange={(e) => handleInputChange('courseUpdates', e.target.checked)}
                  />
                  Course updates
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    checked={profileData.gradeNotifications}
                    onChange={(e) => handleInputChange('gradeNotifications', e.target.checked)}
                  />
                  Grade notifications
                </CheckboxItem>
              </CheckboxGroup>
            </FormGroup>

            <ButtonGroup>
              <Button variant="secondary" onClick={handleReset} disabled={saving}>
                Reset
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </SettingsCard>
        </ProfileGrid>
      </PageContainer>
    </>
  );
};

export default ProfilePage;