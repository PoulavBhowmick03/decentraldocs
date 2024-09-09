"use client"
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Bell, UploadCloud } from "lucide-react";

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 bg-transparent min-h-screen"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-400"
      >
        Welcome back, {user?.name || "User"}
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MotionCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-transparent shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <FileText className="mr-2" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-400">12</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
              View All
            </Button>
          </CardContent>
        </MotionCard>

        <MotionCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-transparent shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Bell className="mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Birth Certificate verified",
                "Academic Transcript added",
                "Profile updated",
              ].map((activity, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center text-gray-500"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {activity}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </MotionCard>

        <MotionCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-transparent shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle className="flex items-center text-purple-600">
              <UploadCloud className="mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
              Upload New Document
            </Button>
            <Button
              className="w-full bg-white text-purple-600 border-purple-600 hover:bg-purple-50 transition-colors duration-300"
              variant="outline"
            >
              Request Verification
            </Button>
          </CardContent>
        </MotionCard>
      </div>
    </motion.div>
  );
}
