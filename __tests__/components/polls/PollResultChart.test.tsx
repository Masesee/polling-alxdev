import React from 'react';
import { render, screen } from '@testing-library/react';
import PollResultChart from '../../../components/polls/PollResultChart';
import { Poll } from '../../../lib/types';

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

const emptyPoll: Poll = {
  id: 'poll-2',
  question: 'Which framework do you prefer?',
  options: [
    { id: 'opt-4', text: 'React', votes: 0 },
    { id: 'opt-5', text: 'Vue', votes: 0 },
    { id: 'opt-6', text: 'Angular', votes: 0 },
  ],
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  isActive: true,
};

// #File: PollResultChart.tsx
// #Docs: Tests for the PollResultChart component

describe('PollResultChart', () => {
  it('renders the bar chart by default', () => {
    render(<PollResultChart poll={mockPoll} />);
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Poll Results')).toBeInTheDocument();
    
    // Check if all options are displayed
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    
    // Check if vote counts and percentages are displayed as a combined string
    expect(screen.getByText('10 votes · 56%')).toBeInTheDocument();
    expect(screen.getByText('5 votes · 28%')).toBeInTheDocument();
    expect(screen.getByText('3 votes · 17%')).toBeInTheDocument();
    
    // Check if total votes are displayed
    expect(screen.getByText('Total votes: 18')).toBeInTheDocument();
  });
  
  it('renders the pie chart when chartType is pie', () => {
    render(<PollResultChart poll={mockPoll} chartType="pie" />);
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Poll Results')).toBeInTheDocument();
    
    // Check if all options are displayed in the legend
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    
    // Check if the total votes are displayed in the center of the pie chart
    expect(screen.getByText('18 votes')).toBeInTheDocument();
  });
  
  it('displays percentages when showPercentage is true', () => {
    render(<PollResultChart poll={mockPoll} showPercentage={true} />);
    
    // Check if percentages are displayed
    // Percentages are combined with vote counts in the format "X votes · Y%"
    expect(screen.getByText(/10 votes.*56%/)).toBeInTheDocument(); // JavaScript: 10/18 ≈ 56%
    expect(screen.getByText(/5 votes.*28%/)).toBeInTheDocument(); // Python: 5/18 ≈ 28%
    expect(screen.getByText(/3 votes.*17%/)).toBeInTheDocument(); // Java: 3/18 ≈ 17%
  });
  
  it('hides percentages when showPercentage is false', () => {
    render(<PollResultChart poll={mockPoll} showPercentage={false} />);
    
    // Check that percentages are not displayed
    expect(screen.queryByText('56%')).not.toBeInTheDocument();
    expect(screen.queryByText('28%')).not.toBeInTheDocument();
    expect(screen.queryByText('17%')).not.toBeInTheDocument();
  });
  
  it('hides vote counts when showVoteCount is false', () => {
    render(<PollResultChart poll={mockPoll} showVoteCount={false} />);
    
    // Check that vote counts are not displayed
    expect(screen.queryByText('10 votes')).not.toBeInTheDocument();
    expect(screen.queryByText('5 votes')).not.toBeInTheDocument();
    expect(screen.queryByText('3 votes')).not.toBeInTheDocument();
  });
  
  it('displays a message when there are no votes', () => {
    render(<PollResultChart poll={emptyPoll} />);
    
    // Check if the no votes message is displayed
    expect(screen.getByText('No votes yet')).toBeInTheDocument();
  });
  
  it('applies custom className when provided', () => {
    const { container } = render(<PollResultChart poll={mockPoll} className="custom-class" />);
    
    // Check if the custom class is applied to the container
    expect(container.firstChild).toHaveClass('custom-class');
  });
});