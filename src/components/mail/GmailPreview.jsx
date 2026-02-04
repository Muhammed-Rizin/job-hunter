import { Check, FileText, Link as LinkIcon, Paperclip, Send, Trash2, X } from "lucide-react";

const GmailPreview = ({ content, profile, handleSend }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-700 flex flex-col h-full max-h-[85vh] md:max-h-full"
    >
      <div
        className="px-4 py-3 flex items-center justify-between shrink-0 bg-[#f2f2f2] text-gray-700 dark:bg-[#202124] dark:text-gray-200"
      >
        <div className="text-sm font-bold tracking-tight">New Message</div>
        <div className="flex gap-2">
          <X size={16} />
        </div>
      </div>
      <div
        className="p-5 flex-1 flex flex-col overflow-y-auto bg-white text-gray-800 dark:bg-[#1b1b1b] dark:text-gray-200"
      >
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center border-b border-gray-500/20 pb-2">
            <span className="text-[10px] uppercase font-bold opacity-50 w-16 tracking-wider">
              To
            </span>
            <span className="text-sm font-medium">recruiter@company.com</span>
          </div>
          <div className="flex items-center border-b border-gray-500/20 pb-2">
            <span className="text-[10px] uppercase font-bold opacity-50 w-16 tracking-wider">
              Subject
            </span>
            <span className="text-sm font-bold truncate">{content.sub || "(No Subject)"}</span>
          </div>
        </div>

        <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed font-sans mb-6">
          {content.body}
        </div>

        {profile.resumeName ? (
          <div
            className="mt-auto mb-4 flex items-center gap-3 p-3 rounded-xl border w-full max-w-sm bg-gray-50 border-gray-200 dark:bg-zinc-800/50 dark:border-zinc-700"
          >
            <div className="p-2.5 bg-red-500/10 rounded-lg text-red-500">
              <FileText size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{profile.resumeName}</p>
              <p className="text-[10px] opacity-50 uppercase tracking-wider font-bold">
                PDF Document - 145 KB
              </p>
            </div>
            <Check size={16} className="text-green-500 mr-2" />
          </div>
        ) : null}
      </div>
      <div
        className="p-4 flex items-center justify-between border-t shrink-0 bg-white border-gray-100 dark:bg-[#1b1b1b] dark:border-zinc-800"
      >
        <div className="flex gap-4 items-center">
          <button
            onClick={handleSend}
            className="px-8 py-2.5 rounded-full bg-[#0b57d0] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            Send <Send size={14} className="opacity-80" />
          </button>
          <div className="flex items-center gap-4 opacity-60">
            <Paperclip size={20} className="hover:opacity-100 cursor-pointer" />
            <LinkIcon size={20} className="hover:opacity-100 cursor-pointer" />
          </div>
        </div>
        <Trash2 size={20} className="opacity-40 hover:opacity-100 cursor-pointer" />
      </div>
    </div>
  );
};

export default GmailPreview;
