"use client";
import React from 'react';
import {
  MessageCircle,
  Search,
  Phone,
  MoreHorizontal,
  CheckCircle,
  Send,
  Paperclip,
  Smile,
} from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Corrected import path
import { Chat } from '@/lib/types'; // Imported Chat interface

interface WhatsAppViewProps {
  chats: Chat[];
  setActiveTab: (tab: string) => void;
}

const WhatsAppView: React.FC<WhatsAppViewProps> = ({ chats, setActiveTab }) => (
  <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
    {/* Left: Chat List */}
    <div className="w-1/3 border-r border-slate-100 flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-slate-900">WhatsApp</h3>
          </div>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Connected</span>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500 transition" />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div key={chat.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition flex gap-3 relative group">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg">
                {chat.avatar}
              </div>
              {chat.online && <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute bottom-0 right-0"></div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-slate-900 truncate">{chat.user}</h4>
                <span className="text-[10px] text-slate-400">{chat.time}</span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Right: Active Chat */}
    <div className="w-2/3 flex flex-col bg-[#efeae2]">
      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
            {chats[0].avatar}
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{chats[0].user}</h4>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-full"><Phone className="w-4 h-4 text-slate-500" /></button>
          <button className="p-2 hover:bg-slate-100 rounded-full"><MoreHorizontal className="w-4 h-4 text-slate-500" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <div className="flex justify-center"><span className="bg-white/50 text-slate-500 text-[10px] px-2 py-1 rounded shadow-sm">Yesterday</span></div>
        <div className="flex justify-start">
          <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm max-w-xs">
            <p className="text-sm text-slate-800">Hello! I saw the Luxury Villa on your site.</p>
            <span className="text-[10px] text-slate-400 block text-right mt-1">10:28 AM</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-green-100 p-3 rounded-tl-xl rounded-br-xl rounded-bl-xl shadow-sm max-w-xs">
            <p className="text-sm text-slate-800">Hi Somsack! Yes, it is currently available for viewing.</p>
            <span className="text-[10px] text-green-700 block text-right mt-1">10:29 AM <CheckCircle className="w-3 h-3 inline ml-1" /></span>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm max-w-xs">
            <p className="text-sm text-slate-800">Is the villa still available?</p>
            <span className="text-[10px] text-slate-400 block text-right mt-1">10:30 AM</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-3">
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Smile className="w-5 h-5" /></button>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Paperclip className="w-5 h-5" /></button>
        <input type="text" placeholder="Type a message" className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
        <button className="p-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  </div>
);

export default WhatsAppView;