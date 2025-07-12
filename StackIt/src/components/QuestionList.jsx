import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard.jsx';
import { questionsAPI } from '../services/api.js';

const QuestionList = ({ 
  questions = [], 
  currentUser, 
  onVote, 
  onAccept, 
  onDelete,
  onAnswerSubmit,
  onNavigate
}) => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);

  useEffect(() => {
    // Get all unique tags from questions
    const tags = [...new Set(questions.flatMap(q => q.tags || []))];
    setAvailableTags(tags);
  }, [questions]);

  // Load answers for all questions
  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const questionsWithAnswersData = await Promise.all(
          questions.map(async (question) => {
            const answers = await questionsAPI.getAnswers(question.id);
            return {
              ...question,
              answers: answers || []
            };
          })
        );
        setQuestionsWithAnswers(questionsWithAnswersData);
      } catch (error) {
        console.error('Error loading answers:', error);
        setQuestionsWithAnswers(questions.map(q => ({ ...q, answers: [] })));
      }
    };

    if (questions.length > 0) {
      loadAnswers();
    } else {
      setQuestionsWithAnswers([]);
    }
  }, [questions]);

  useEffect(() => {
    let filtered = [...questionsWithAnswers];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => 
        selectedTags.some(tag => q.tags.includes(tag))
      );
    }

    // Sort questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'votes':
          return b.votes - a.votes;
        case 'answers':
          return (b.answers?.length || 0) - (a.answers?.length || 0);
        case 'unanswered':
          const aHasAnswers = (a.answers?.length || 0) > 0;
          const bHasAnswers = (b.answers?.length || 0) > 0;
          if (!aHasAnswers && bHasAnswers) return -1;
          if (aHasAnswers && !bHasAnswers) return 1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    setFilteredQuestions(filtered);
  }, [questionsWithAnswers, sortBy, selectedTags, searchQuery]);

  const handleTagFilter = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Questions
            </h1>
            <p className="text-gray-600 mt-2">Find answers to your programming questions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            </div>
            {currentUser && (
              <button
                onClick={() => onNavigate('ask')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Ask Question
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Questions
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions, tags, or content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="votes">Most Votes</option>
                <option value="answers">Most Answers</option>
                <option value="unanswered">Unanswered</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Tag Filters */}
          {availableTags.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filter by tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagFilter(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery || selectedTags.length > 0 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Be the first to ask a question and help build our community!'
              }
            </p>
            {!currentUser && (
              <div className="mt-6">
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign in to ask a question
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              answers={question.answers || []}
              currentUser={currentUser}
              onVote={onVote}
              onAccept={onAccept}
              onDelete={onDelete}
              onAnswerSubmit={onAnswerSubmit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList; 