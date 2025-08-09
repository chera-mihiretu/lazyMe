import React from "react";
import { motion } from "framer-motion";
import { User, UserPlus, Check, Loader2, GraduationCap, Users } from "lucide-react";
import Image from "next/image";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
  follow_count: number;
  acedemic_year: number;
}

const UserCard: React.FC<UserCardProps> = React.memo(({
  id,
  name,
  email,
  profile_image_url,
  follow_count,
  acedemic_year,
}) => {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConnect = async () => {
    if (sent || loading) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connections/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ connectee_id: id }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to send connection request");
      }
      setSent(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="group bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        {/* Top Section - Avatar and Connect Button */}
        <div className="flex items-start justify-between mb-3">
          {/* Avatar */}
          <motion.div
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-purple-300 transition-colors duration-300">
              {profile_image_url ? (
                <Image
                  src={profile_image_url}
                  alt={`${name} avatar`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Connect Button */}
          <motion.button
            onClick={handleConnect}
            disabled={sent || loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex-shrink-0 ${
              sent
                ? 'bg-green-100 text-green-700 cursor-default'
                : loading
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-sm hover:shadow-md'
            }`}
            whileHover={{ scale: sent || loading ? 1 : 1.05 }}
            whileTap={{ scale: sent || loading ? 1 : 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="whitespace-nowrap">Sending...</span>
              </>
            ) : sent ? (
              <>
                <Check className="w-3 h-3" />
                <span className="whitespace-nowrap">Sent</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" />
                <span className="whitespace-nowrap">Connect</span>
              </>
            )}
          </motion.button>
        </div>

        {/* User Information Section */}
        <div className="space-y-2">
          {/* Name */}
          <motion.h4
            className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-purple-700 transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            title={name} // Tooltip for full name if truncated
          >
            {name}
          </motion.h4>

          {/* Academic Year & Followers Row */}
          <motion.div
            className="flex items-center justify-between gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {acedemic_year && (
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                <GraduationCap className="w-3 h-3" />
                <span className="whitespace-nowrap">Year {acedemic_year}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
              <Users className="w-3 h-3" />
              <span className="whitespace-nowrap">{follow_count}</span>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            className="pt-2 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p 
              className="text-xs text-gray-400 break-all leading-tight"
              title={email} // Tooltip for full email
            >
              {email}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

UserCard.displayName = "UserCard";

export default UserCard;
