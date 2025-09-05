import React from 'react';
import { render, screen } from '@testing-library/react';
import PollResultChart from '../../../components/polls/PollResultChart';
import { Poll } from '../../../lib/types';

// #File: PollResultChart.tsx - Pie Chart Tests
// #Docs: Tests specifically for the pie chart implementation of PollResultChart

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

describe('PollResultChart - Pie Chart', () => {
  it('renders the pie chart with correct structure', () => {
    const { container } = render(<PollResultChart poll={mockPoll} chartType="pie" />);
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Poll Results')).toBeInTheDocument();
    
    // Check if the pie chart is rendered
    // The pie chart is implemented with absolute positioned divs
    const pieSegments = container.querySelectorAll('div[style*="clip-path:"]');
    expect(pieSegments.length).toBe(3); // One for each option
    
    // Check if the center circle with total votes is rendered
    expect(screen.getByText(/18 votes/)).toBeInTheDocument();
  });
  
  it('renders the legend with correct options', () => {
    render(<PollResultChart poll={mockPoll} chartType="pie" />);
    
    // Check if all options are displayed in the legend
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
  });
  
  it('displays vote counts and percentages in the legend', () => {
    render(<PollResultChart poll={mockPoll} chartType="pie" />);
    
    // Check if percentages and vote counts are displayed as a combined string
    expect(screen.getByText(/55.6%.*10 votes/)).toBeInTheDocument(); // JavaScript: 10/18 ≈ 55.6%
    expect(screen.getByText(/27.8%.*5 votes/)).toBeInTheDocument(); // Python: 5/18 ≈ 27.8%
    expect(screen.getByText(/16.7%.*3 votes/)).toBeInTheDocument(); // Java: 3/18 ≈ 16.7%
  });
  
  it('hides percentages when showPercentage is false', () => {
    render(<PollResultChart poll={mockPoll} chartType="pie" showPercentage={false} />);
    
    // Check that percentages are not displayed
    expect(screen.queryByText('55.6%')).not.toBeInTheDocument();
    expect(screen.queryByText('27.8%')).not.toBeInTheDocument();
    expect(screen.queryByText('16.7%')).not.toBeInTheDocument();
    
    // But vote counts should still be displayed
    expect(screen.getByText('10 votes')).toBeInTheDocument();
    expect(screen.getByText('5 votes')).toBeInTheDocument();
    expect(screen.getByText('3 votes')).toBeInTheDocument();
  });
  
  it('hides vote counts when showVoteCount is false', () => {
    render(<PollResultChart poll={mockPoll} chartType="pie" showVoteCount={false} />);
    
    // Check that vote counts are not displayed
    expect(screen.queryByText('10 votes')).not.toBeInTheDocument();
    expect(screen.queryByText('5 votes')).not.toBeInTheDocument();
    expect(screen.queryByText('3 votes')).not.toBeInTheDocument();
    
    // But percentages should still be displayed
    expect(screen.getByText('55.6%')).toBeInTheDocument();
    expect(screen.getByText('27.8%')).toBeInTheDocument();
    expect(screen.getByText('16.7%')).toBeInTheDocument();
  });
  
  it('uses the correct colors for pie segments', () => {
    const { container } = render(<PollResultChart poll={mockPoll} chartType="pie" />);
    
    // Check if the pie segments have the correct colors
    const pieSegments = container.querySelectorAll('div[style*="clip-path:"]');
    
    // The colors array in the component is:
    // ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', ...]
    expect(pieSegments[0]).toHaveClass('bg-blue-500');
    expect(pieSegments[1]).toHaveClass('bg-green-500');
    expect(pieSegments[2]).toHaveClass('bg-yellow-500');
  });
});