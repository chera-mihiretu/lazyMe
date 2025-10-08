import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SideCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const SideCard: React.FC<SideCardProps> = ({
  image,
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image - Full Width */}
      <div className="w-full h-32 bg-gray-100 relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h4>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
        
        {/* Button */}
        <div className="flex justify-end">
          <Link href={buttonLink}>
            <motion.button
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{buttonText}</span>
              <ExternalLink className="w-3 h-3" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SideCard;
