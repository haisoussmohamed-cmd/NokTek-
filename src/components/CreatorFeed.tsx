import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import VideoPlayer from './VideoPlayer';
import { User } from 'firebase/auth';

interface Post {
  id: string;
  videoUrl: string;
  title: string;
  createdAt: any;
  likesCount: number;
}

interface CreatorFeedProps {
  user: User | null;
  openAuth: () => void;
}

export default function CreatorFeed({ user, openAuth }: CreatorFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({ 
            id: doc.id, 
            videoUrl: data.videoUrl, 
            title: data.title, 
            createdAt: data.createdAt, 
            likesCount: data.likesCount || 0 
        } as Post);
      });
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {posts.map((post) => (
        <VideoPlayer key={post.id} post={post} user={user} openAuth={openAuth} />
      ))}
    </div>
  );
}
