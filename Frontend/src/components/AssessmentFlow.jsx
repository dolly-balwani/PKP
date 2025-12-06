// src/components/AssessmentFlow.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import Sidebar from './Sidebar';
import { 
  Brain, 
  Heart, 
  ArrowLeft, 
  Menu,
  Loader2,
  MessageCircle,
  Shield,
  Users,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AssessmentFlow() {
  const [step, setStep] = useState('context'); // 'context', 'questions', 'result'
  const [assessmentType, setAssessmentType] = useState('PHQ9');
  const [context, setContext] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load questions when context is submitted
  const handleStartAssessment = async () => {
    setLoading(true);
    setLoadingMessage('Preparing your personalized questions...');
    try {
      console.log("Sending request to:", `${API_BASE}/assess`);
      console.log("Request data:", {
        assessment_type: assessmentType,
        context: context.trim()
      });
      
      const response = await axios.post(`${API_BASE}/assess`, {
        assessment_type: assessmentType,
        context: context.trim()
      });
      
      console.log("Response received:", response.data);
      setQuestions(response.data);
      setStep('questions');
    } catch (error) {
      console.error("Failed to load questions", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(`Failed to start assessment: ${error.response?.data?.error || error.message}. Please try again.`);
    }
    setLoading(false);
    setLoadingMessage('');
  };

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMessage('Processing your responses and calculating results...');
    try {
      const responses = questions.map((q, idx) => ({
        q_id: q.q_id,
        answer: answers[idx] || 0
      }));

      console.log("Submitting assessment with data:", {
        int_id: "x9f3k2m8",
        assessment_type: assessmentType,
        responses,
        context
      });

      const response = await axios.post(`${API_BASE}/submit`, {
        int_id: "x9f3k2m8", // In real app: get from auth context
        assessment_type: assessmentType,
        responses,
        context
      });

      console.log("Submit response received:", response.data);
      setResult(response.data);
      setStep('result');
    } catch (error) {
      console.error("Failed to submit", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(`Failed to submit assessment: ${error.response?.data?.error || error.message}. Please try again.`);
    }
    setLoading(false);
    setLoadingMessage('');
  };

  const handleRestart = () => {
    setStep('context');
    setContext('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaf1f5] lg:pl-72">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between" style={{borderColor:'#c8ced1'}}>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors"
          >
            <Menu className="w-6 h-6 text-[#2e2f34]" />
          </button>
          <h1 className="text-lg font-bold text-[#2e2f34]">Assessment</h1>
          <div className="w-10" />
        </div>

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border rounded-xl p-12 text-center" style={{borderColor:'#c8ced1'}}>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-[#3d9098] rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#2e2f34]">Processing Your Assessment</h2>
                  <p className="text-[#767272] mt-1">{loadingMessage || 'Please wait while we process your responses...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf1f5] lg:pl-72">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between" style={{borderColor:'#c8ced1'}}>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#2e2f34]" />
        </button>
        <h1 className="text-lg font-bold text-[#2e2f34]">Assessment</h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header - Desktop */}
          <div className="hidden lg:flex items-center space-x-3 mb-6">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 rounded-lg hover:bg-white transition-colors" 
              style={{background:'#c8ced1'}}
            >
              <ArrowLeft className="w-5 h-5 text-[#2e2f34]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#2e2f34]">Mental Health Assessment</h1>
              <p className="text-[#767272]">Personalized questions to understand your mental wellness</p>
            </div>
          </div>

          {step === 'context' && (
            <div className="bg-white border rounded-xl p-8 mb-8" style={{borderColor:'#c8ced1'}}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#3d9098] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#2e2f34] mb-2">How are you feeling today?</h2>
                <p className="text-[#767272]">Share what's on your mind - this is completely anonymous and confidential</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#2e2f34] mb-3">Tell us about your current situation</label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., Struggling with exam pressure, feeling isolated, family conflicts, work stress..."
                    className="w-full p-4 border rounded-xl focus:outline-none focus:border-[#3d9098] focus:ring-2 focus:ring-[#3d9098]/20 resize-none"
                    style={{borderColor:'#c8ced1'}}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2e2f34] mb-3">Assessment Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setAssessmentType('PHQ9')}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        assessmentType === 'PHQ9' 
                          ? 'border-[#3d9098] bg-[#f2f7eb] ring-2 ring-[#3d9098]/20' 
                          : 'border-[#c8ced1] hover:border-[#3d9098]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#3d9098] rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#2e2f34]">Depression (PHQ-9)</div>
                          <div className="text-sm text-[#767272]">9 questions about mood and feelings</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setAssessmentType('GAD7')}
                      className={`p-4 border rounded-xl text-left transition-all ${
                        assessmentType === 'GAD7' 
                          ? 'border-[#3d9098] bg-[#f2f7eb] ring-2 ring-[#3d9098]/20' 
                          : 'border-[#c8ced1] hover:border-[#3d9098]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#3d9098] rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#2e2f34]">Anxiety (GAD-7)</div>
                          <div className="text-sm text-[#767272]">7 questions about anxiety and worry</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleStartAssessment}
                    disabled={!context.trim()}
                    className="w-full px-6 py-4 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Start Assessment →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'questions' && currentQuestion && (
            <QuestionScreen
              question={currentQuestion}
              selected={answers[currentQuestionIndex]}
              onSelect={handleAnswerSelect}
              onBack={handleBack}
              onSkip={handleNext}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
              progress={progress}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />
          )}

          {step === 'result' && result && (
            <ResultScreen result={result} onRestart={handleRestart} />
          )}
        </div>
      </div>
    </div>
  );
}