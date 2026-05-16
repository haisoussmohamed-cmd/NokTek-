/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { functions, db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, limit, orderBy, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface Post {
  id: string;
  videoUrl: string;
  title: string;
  likesCount: number;
}

interface VideoPlayerProps {
  post: Post;
  key?: string;
  user: User | null;
  openAuth: () => void;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

export default function VideoPlayer({ post, user, openAuth }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  
  const watchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
            setIsPlaying(true);
            startWatchTimer(post.id);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
            clearWatchTimer();
          }
        });
      },
      { threshold: 0.7 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [post.id]);

  useEffect(() => {
    if (!isCommentsOpen) return;

    const q = query(
      collection(db, 'posts', post.id, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: Comment[] = [];
      snapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
    });
    
    return () => unsubscribe();
  }, [isCommentsOpen, post.id]);

  const startWatchTimer = (postId: string) => {
    const now = Date.now();
    const lastReward = localStorage.getItem(`reward_${postId}`);
    
    if (lastReward && now - parseInt(lastReward) < 86400000) return; // 24h

    watchTimeout.current = setTimeout(async () => {
      if (!user) return;
      try {
        const rewardView = httpsCallable(functions, 'rewardView');
        await rewardView({ postId, userId: user.uid });
        localStorage.setItem(`reward_${postId}`, now.toString());
      } catch (error) {
        console.error("Error calling rewardView:", error);
      }
    }, 45000);
  };

  const clearWatchTimer = () => {
    if (watchTimeout.current) {
      clearTimeout(watchTimeout.current);
      watchTimeout.current = null;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async () => {
    if (!user) { openAuth(); return; }
    if (isLiking) return;
    
    // Optimistic Update
    setIsLiking(true);
    setLikes(prev => prev + 1);
    
    try {
        const toggleLike = httpsCallable(functions, 'toggleLike');
        await toggleLike({ postId: post.id, userId: user.uid });
    } catch (error) {
        console.error("Error toggling like:", error);
        setLikes(prev => prev - 1); // Revert
    } finally {
        setTimeout(() => setIsLiking(false), 1000);
    }
  };

  const submitComment = async () => {
    if (!newCommentText.trim() || !user || newCommentText.length > 200) return;
    
    try {
        const addComment = httpsCallable(functions, 'addComment');
        await addComment({ postId: post.id, userId: user.uid, text: newCommentText});
        
        // Optimistic append
        setComments(prev => [{id: 'temp', text: newCommentText, userId: user.uid, createdAt: new Date()}, ...prev]);
        setNewCommentText('');
    } catch (error) {
        console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group">
        <video
          ref={videoRef}
          src={post.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        />
        
        {/* Interaction Buttons - Right side overlay */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="text-white p-2 rounded-full hover:bg-black/70 bg-black/50"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart size={24} className={isLiking || likes > post.likesCount ? "fill-red-500 text-red-500" : ""} />
            <span className="text-xs">{likes}</span>
          </button>
          
          <button 
            className="text-white p-2 rounded-full hover:bg-black/70 bg-black/50"
            onClick={() => user ? setIsCommentsOpen(!isCommentsOpen) : openAuth()}
          >
            <MessageCircle size={24} />
          </button>
          
          <button className="text-white p-2 bg-black/50 rounded-full hover:bg-black/70" onClick={() => {/* ... share logic */}}>
            <Share2 size={24} />
          </button>
        </div>

        {/* Play/Pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-white p-2 bg-black/50 rounded-full" onClick={togglePlay}>
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
        </div>

        {/* Mute overlay & Title */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-white p-2 bg-black/50 rounded-full" onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <div className="absolute bottom-4 left-4 text-white font-bold">{post.title}</div>
      </div>

      {!user && (
        <div className="mt-2 text-red-500 text-center text-xs cursor-pointer" onClick={openAuth}>Login to earn rewards and interact</div>
      )}

      {isCommentsOpen && (
        <div className="mt-4 p-4 bg-[#111111] rounded-xl border border-[#1f1f1f]">
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value.substring(0,200))}
                    placeholder="Add a comment... (max 200 chars)"
                    className="flex-1 bg-[#1a1a1a] text-white p-2 rounded-lg outline-none"
                />
                <button 
                  onClick={submitComment} 
                  className="text-[#f27d26]"
                >
                    <Send />
                </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1a1a1a] p-2 rounded-lg text-xs text-white">
                        {comment.text}
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
