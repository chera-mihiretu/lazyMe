import React from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";

interface PostSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  onAddPost: () => void;
  onSearchSubmit?: () => void;
}

const PostSearchBar: React.FC<PostSearchBarProps> = ({ 
  search, 
  setSearch, 
  onAddPost, 
  onSearchSubmit 
}) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search Input */}
          <motion.div
            className="relative flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campus posts, events, or announcements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && onSearchSubmit) onSearchSubmit();
              }}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
            />
          </motion.div>

          {/* Add Post Button */}
          <motion.button
            onClick={onAddPost}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group min-w-[160px]"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Post</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostSearchBar;