import React from 'react';
import { render, screen } from '@testing-library/react';
import PollResultChart from '../../../components/polls/PollResultChart';
import { Poll } from '../../../lib/types';

// #File: PollResultChart.tsx - Edge Cases Tests
// #Docs: Tests for edge cases in the PollResultChart component

// Mock data for testing
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

const singleVotePoll: Poll = {
  id: 'poll-3',
  question: 'Which database do you prefer?',
  options: [
    { id: 'opt-7', text: 'MongoDB', votes: 1 },
    { id: 'opt-8', text: 'PostgreSQL', votes: 0 },
    { id: 'opt-9', text: 'MySQL', votes: 0 },
  ],
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  isActive: true,
};

const nullVotesPoll: Poll = {
  id: 'poll-4',
  question: 'Which cloud provider do you prefer?',
  options: [
    { id: 'opt-10', text: 'AWS', votes: null as unknown as number },
    { id: 'opt-11', text: 'Azure', votes: null as unknown as number },
    { id: 'opt-12', text: 'GCP', votes: null as unknown as number },
  ],
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  isActive: true,
};

describe('PollResultChart - Edge Cases', () => {
  it('displays a message when there are no votes (bar chart)', () => {
    render(<PollResultChart poll={emptyPoll} chartType="bar" />);
    
    // Check if the no votes message is displayed
    expect(screen.getByText('No votes yet')).toBeInTheDocument();
    
    // Check that no option details are displayed
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.queryByText('Vue')).not.toBeInTheDocument();
    expect(screen.queryByText('Angular')).not.toBeInTheDocument();
  });
  
  it('displays a message when there are no votes (pie chart)', () => {
    render(<PollResultChart poll={emptyPoll} chartType="pie" />);
    
    // Check if the no votes message is displayed
    expect(screen.getByText('No votes yet')).toBeInTheDocument();
    
    // Check that no pie chart is rendered
    expect(screen.queryByText('0 votes')).not.toBeInTheDocument();
  });
  
  it('handles a poll with only one vote correctly', () => {
    render(<PollResultChart poll={singleVotePoll} />);
    
    // Check if the component renders with the correct title
    expect(screen.getByText('Poll Results')).toBeInTheDocument();
    
    // Check if all options are displayed
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('MySQL')).toBeInTheDocument();
    
    // Check if the MongoDB option shows 100% with vote count
    expect(screen.getByText(/1 vote.*100%/)).toBeInTheDocument();
    
    // Check if the total votes are displayed correctly
    expect(screen.getByText('Total votes: 1')).toBeInTheDocument();
  });
  
  it('handles null votes as 0', () => {
    render(<PollResultChart poll={nullVotesPoll} />);
    
    // Check if the no votes message is displayed
    expect(screen.getByText('No votes yet')).toBeInTheDocument();
  });
  
  it('applies custom className when provided', () => {
    const { container } = render(<PollResultChart poll={singleVotePoll} className="custom-class" />);
    
    // Check if the custom class is applied to the container
    expect(container.firstChild).toHaveClass('custom-class');
  });
});