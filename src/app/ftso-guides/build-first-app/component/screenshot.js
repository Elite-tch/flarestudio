"use client"
import Image from "next/image"
import { motion } from "framer-motion"

export function Screenshot({ src, alt, caption }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm">terminal</span>
        </div>
        <div className="relative  rounded border border-gray-600 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>
      {caption && (
        <p className="text-center text-gray-600 text-sm mt-2">{caption}</p>
      )}
    </motion.div>
  )
}