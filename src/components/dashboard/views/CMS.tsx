"use client";
import React from 'react';
import { PenTool, Search, Edit, Eye } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Assuming Badge is in src/components/dashboard/shared

interface Post {
  id: number;
  title: string;
  author: string;
  status: string;
  date: string;
  views: number;
}

interface CMSViewProps {
  posts: Post[];
}

const CMSView: React.FC<CMSViewProps> = ({ posts }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Content Management</h2>
        <p className="text-slate-500 text-sm">Manage blog posts, news, and site content.</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600">
        <PenTool className="w-4 h-4" /> New Post
      </button>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex gap-4">
          <button className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-4 -mb-4.5">All Posts</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-4">Drafts</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-4">Published</button>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search content..." className="pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none" />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Author</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4">Views</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-slate-50 transition">
              <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{post.title}</td>
              <td className="p-4 text-sm text-slate-600">{post.author}</td>
              <td className="p-4"><Badge status={post.status} /></td>
              <td className="p-4 text-sm text-slate-500">{post.date}</td>
              <td className="p-4 text-sm text-slate-600">{post.views}</td>
              <td className="p-4 text-right flex justify-end gap-2">
                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg"><Eye className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CMSView;