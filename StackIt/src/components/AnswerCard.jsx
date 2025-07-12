import { useState } from 'react';
import { mockData } from '../data/mockData.js';

const AnswerCard = ({ 
  answer, 
  questionOwnerId, 
  currentUser, 
  onVote, 
  onAccept, 
  onDelete 
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canVote = currentUser && !currentUser.banned;
  const canAccept = currentUser && currentUser.id === questionOwnerId && !currentUser.banned;
  const canDelete = currentUser && (currentUser.role === 'admin' || currentUser.id === answer.userId) && !currentUser.banned;

  // Get user's current vote for this answer
  const getUserVote = () => {
    if (!currentUser) return null;
    return mockData.getUserAnswerVote(answer.id, currentUser.id);
  };

  const userVote = getUserVote();

  const handleVote = async (voteType) => {
    if (!canVote) return;
    
    setIsVoting(true);
    try {
      await onVote(answer.id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAccept = async () => {
    if (!canAccept) return;
    
    setIsAccepting(true);
    try {
      await onAccept(answer.id);
    } catch (error) {
      console.error('Error accepting answer:', error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    
    if (!confirm('Are you sure you want to delete this answer?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(answer.id);
    } catch (error) {
      console.error('Error deleting answer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${
      answer.accepted ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex space-x-4">
        {/* Voting Section */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => handleVote('up')}
            disabled={!canVote || isVoting}
            className={`p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote?.voteType === 'up' 
                ? 'text-green-600 bg-green-50' 
                : canVote 
                ? 'text-gray-600 hover:text-green-600' 
                : 'text-gray-400'
            }`}
            title={userVote?.voteType === 'up' ? 'Remove upvote' : 'Upvote'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className={`text-lg font-semibold ${
            answer.votes > 0 ? 'text-green-600' : answer.votes < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {answer.votes}
          </span>
          
          <button
            onClick={() => handleVote('down')}
            disabled={!canVote || isVoting}
            className={`p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              userVote?.voteType === 'down' 
                ? 'text-red-600 bg-red-50' 
                : canVote 
                ? 'text-gray-600 hover:text-red-600' 
                : 'text-gray-400'
            }`}
            title={userVote?.voteType === 'down' ? 'Remove downvote' : 'Downvote'}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Answer Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {answer.username ? answer.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {answer.username || 'Unknown User'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatTimestamp(answer.timestamp)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {answer.accepted && (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Accepted</span>
                </div>
              )}
              
              {canAccept && !answer.accepted && (
                <button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Accept this answer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete this answer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard; 