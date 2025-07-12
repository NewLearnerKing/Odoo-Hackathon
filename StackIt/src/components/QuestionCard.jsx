import { useState } from 'react';
import AnswerForm from './AnswerForm.jsx';
import AnswerCard from './AnswerCard.jsx';

const QuestionCard = ({ 
  question, 
  answers = [], 
  currentUser, 
  onVote, 
  onAccept, 
  onDelete,
  onAnswerSubmit,
  onShowAnswers,
  onHideAnswers
}) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canVote = currentUser && !currentUser.banned;
  const canAnswer = currentUser && !currentUser.banned;
  const canDelete = currentUser && (currentUser.role === 'admin' || currentUser.id === question.userId) && !currentUser.banned;

  // Get user's current vote for this question (simplified for now)
  const getUserVote = () => {
    if (!currentUser) return null;
    // For now, return null - this would need to be implemented with the API
    return null;
  };

  const userVote = getUserVote();

  const handleVote = async (voteType) => {
    if (!canVote) return;
    
    setIsVoting(true);
    try {
      await onVote(question.id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(question.id);
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAnswerSubmit = async (answerData) => {
    try {
      await onAnswerSubmit(answerData);
      setShowAnswerForm(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
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

  const acceptedAnswer = answers.find(a => a.accepted);
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.accepted && !b.accepted) return -1;
    if (!a.accepted && b.accepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-6 overflow-hidden card">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
          {/* Voting Section */}
          <div className="flex lg:flex-col items-center justify-center lg:justify-start space-x-4 lg:space-x-0 lg:space-y-2">
            <button
              onClick={() => handleVote('up')}
              disabled={!canVote || isVoting}
              className={`p-2 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                userVote?.voteType === 'up' 
                  ? 'text-green-600 bg-green-50 shadow-sm' 
                  : canVote 
                  ? 'text-gray-600 hover:text-green-600 hover:shadow-sm' 
                  : 'text-gray-400'
              }`}
              title={userVote?.voteType === 'up' ? 'Remove upvote' : 'Upvote'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <span className={`text-xl font-bold px-3 py-1 rounded-lg ${
              question.votes > 0 
                ? 'text-green-600 bg-green-50' 
                : question.votes < 0 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-600 bg-gray-50'
            }`}>
              {question.votes}
            </span>
            
            <button
              onClick={() => handleVote('down')}
              disabled={!canVote || isVoting}
              className={`p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                userVote?.voteType === 'down' 
                  ? 'text-red-600 bg-red-50 shadow-sm' 
                  : canVote 
                  ? 'text-gray-600 hover:text-red-600 hover:shadow-sm' 
                  : 'text-gray-400'
              }`}
              title={userVote?.voteType === 'down' ? 'Remove downvote' : 'Downvote'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">
                    {question.username ? question.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {question.username || 'Unknown User'}
                  </span>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(question.timestamp)}
                  </div>
                </div>
              </div>
              
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Delete this question"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {question.title}
            </h3>
            
            <div 
              className="prose max-w-none mb-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Answer Stats and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{answers.length} {answers.length === 1 ? 'answer' : 'answers'}</span>
                </div>
                {acceptedAnswer && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Answered</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {canAnswer && (
                  <button
                    onClick={() => setShowAnswerForm(!showAnswerForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {showAnswerForm ? 'Cancel' : 'Answer'}
                  </button>
                )}
                
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all duration-200"
                >
                  {showAnswers ? 'Hide Answers' : `View ${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Form */}
      {showAnswerForm && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <AnswerForm
            onSubmit={handleAnswerSubmit}
            onCancel={() => setShowAnswerForm(false)}
            questionId={question.id}
          />
        </div>
      )}

      {/* Answers Section */}
      {showAnswers && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h4>
            
            {sortedAnswers.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAnswers.map((answer) => (
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    currentUser={currentUser}
                    onVote={onVote}
                    onAccept={onAccept}
                    onDelete={onDelete}
                    questionUserId={question.userId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard; 