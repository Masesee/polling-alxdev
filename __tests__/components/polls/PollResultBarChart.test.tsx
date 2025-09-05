import React from 'react';
import { render, screen } from '@testing-library/react';
import PollResultChart from '../../../components/polls/PollResultChart';
import { Poll } from '../../../lib/types';

// #File: PollResultChart.tsx - Bar Chart Tests
// #Docs: Tests specifically for the bar chart implementation of PollResultChart

// Mock data for testing
const mockPoll: Poll = {
  id: 'poll-1',
  question: 'What is your favorite programming language?',
  options: [
    { id: 'opt-1', text: 'JavaScript', votes: 10 },
    { id: 'opt-2', text: 'Python', votes: 5 },
    { id: 'opt-3', text: 'Java', votes: 3 },
  ],
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  isActive: true,
};

describe('PollResultChart - Bar Chart', () => {
  it('renders the bar chart with correct structure', () => {
    const { container } = render(<PollResultChart poll={mockPoll} chartType="bar" />);
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Poll Results')).toBeInTheDocument();
    
    // Check if all options are displayed
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    
    // Check if the progress bars are rendered
    const progressBars = container.querySelectorAll('div[style*="width:"]');
    expect(progressBars.length).toBe(3);
    
    // Check if the first bar (JavaScript) has the correct width (10/18 ≈ 56%)
    expect(progressBars[0]).toHaveStyle('width: 56%');
    
    // Check if the second bar (Python) has the correct width (5/18 ≈ 28%)
    expect(progressBars[1]).toHaveStyle('width: 28%');
    
    // Check if the third bar (Java) has the correct width (3/18 ≈ 17%)
    expect(progressBars[2]).toHaveStyle('width: 17%');
  });
  
  it('displays vote counts and percentages correctly', () => {
    render(<PollResultChart poll={mockPoll} chartType="bar" />);
    
    // Check if vote counts and percentages are displayed as a combined string
    expect(screen.getByText(/10 votes.*56%/)).toBeInTheDocument();
    expect(screen.getByText(/5 votes.*28%/)).toBeInTheDocument();
    expect(screen.getByText(/3 votes.*17%/)).toBeInTheDocument();
  });
  
  it('hides percentages when showPercentage is false', () => {
    render(<PollResultChart poll={mockPoll} chartType="bar" showPercentage={false} />);
    
    // Check that percentages are not displayed
    expect(screen.queryByText('56%')).not.toBeInTheDocument();
    expect(screen.queryByText('28%')).not.toBeInTheDocument();
    expect(screen.queryByText('17%')).not.toBeInTheDocument();
    
    // But vote counts should still be displayed
    expect(screen.getByText('10 votes')).toBeInTheDocument();
    expect(screen.getByText('5 votes')).toBeInTheDocument();
    expect(screen.getByText('3 votes')).toBeInTheDocument();
  });
  
  it('hides vote counts when showVoteCount is false', () => {
    render(<PollResultChart poll={mockPoll} chartType="bar" showVoteCount={false} />);
    
    // Check that vote counts are not displayed
    expect(screen.queryByText('10 votes')).not.toBeInTheDocument();
    expect(screen.queryByText('5 votes')).not.toBeInTheDocument();
    expect(screen.queryByText('3 votes')).not.toBeInTheDocument();
    
    // But percentages should still be displayed
    expect(screen.getByText('56%')).toBeInTheDocument();
    expect(screen.getByText('28%')).toBeInTheDocument();
    expect(screen.getByText('17%')).toBeInTheDocument();
  });
  
  it('displays total votes correctly', () => {
    render(<PollResultChart poll={mockPoll} chartType="bar" />);
    
    // Check if total votes are displayed
    expect(screen.getByText('Total votes: 18')).toBeInTheDocument();
  });
});