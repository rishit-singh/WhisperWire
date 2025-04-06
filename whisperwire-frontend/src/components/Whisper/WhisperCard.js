import React, { useState } from 'react';
import './WhisperCard.css';
import ReplyForm from './ReplyForm';

const WhisperCard = ({ whisper, onReply, onDelete, isReply, parentWhisper }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const handleReplySubmit = (text, vibeTags) => {
    onReply(whisper._id, text, vibeTags);
    setHasReplied(true);
    setShowReplyForm(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this whisper?')) {
      setIsDeleting(true);
      onDelete(whisper._id);
    }
  };
  
  // Get random vibe color from one of the vibes or use a default
  const getVibeColor = () => {
    if (!whisper.vibeTags || whisper.vibeTags.length === 0) {
      return 'var(--primary-color)';
    }
    
    // Map standard vibes to our CSS variables
    const vibeColorMap = {
      'chaotic': 'var(--vibe-chaotic)',
      'chill': 'var(--vibe-chill)',
      'excited': 'var(--vibe-excited)',
      'pensive': 'var(--vibe-pensive)',
      'unhinged': 'var(--vibe-unhinged)',
      'sentimental': 'var(--vibe-sentimental)'
    };
    
    const vibeTag = whisper.vibeTags[0].toLowerCase();
    return vibeColorMap[vibeTag] || 'var(--primary-color)';
  };
  
  // If whisper is being deleted, show a faded version
  if (isDeleting) {
    return (
      <div className="whisper-card whisper-deleting">
        <p>Deleting whisper...</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`whisper-card ${isReply ? 'whisper-reply' : ''}`}
      style={{ '--whisper-color': getVibeColor() }}
    >
      {isReply && parentWhisper && (
        <div className="reply-indicator">
          <div className="reply-icon">↩</div>
          <div className="replying-to">
            <div className="replying-to-label">Replying to:</div>
            <div className="parent-whisper-preview">{parentWhisper.text.substring(0, 60)}...</div>
          </div>
        </div>
      )}
      
      <div className="whisper-content">
        <p className="whisper-text">{whisper.text}</p>
        <div className="whisper-meta">
          <div className="whisper-time">{formatDate(whisper.timestamp)}</div>
          {whisper.vibeTags && whisper.vibeTags.length > 0 && (
            <div className="whisper-vibes">
              {whisper.vibeTags.map((vibe, index) => (
                <span key={`${vibe}-${index}-${whisper._id}`} className="whisper-vibe-tag">{vibe}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="whisper-actions">
        <button 
          className="reply-button"
          onClick={() => setShowReplyForm(!showReplyForm)}
          disabled={hasReplied}
        >
          {hasReplied ? 'Replied' : 'Reply'}
        </button>
        <button 
          className="delete-button"
          onClick={handleDelete}
        >
          Delete
        </button>
        <div className="reply-count">
          {whisper.replyCount ? `${whisper.replyCount} ${whisper.replyCount === 1 ? 'reply' : 'replies'}` : 'No replies'}
        </div>
      </div>
      
      {showReplyForm && (
        <ReplyForm onSubmit={handleReplySubmit} />
      )}
      
      {whisper.replies && whisper.replies.length > 0 && (
        <div className="whisper-replies">
          {whisper.replies.map((reply, index) => (
            <WhisperCard 
              key={reply._id || `reply-${index}-${whisper._id}`} 
              whisper={reply} 
              onReply={onReply}
              onDelete={onDelete}
              isReply={true}
              parentWhisper={whisper}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WhisperCard; 