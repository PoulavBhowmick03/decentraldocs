"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, FileText, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Head = ({ user }) => (
  <header className="bg-white shadow-sm mb-8">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user}</h1>
          <p className="mt-1 text-sm text-gray-600">
            You can see your DecentralDocs issued documents here!
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <User className="mr-2 h-4 w-4" /> My Profile
          </Button>
          <Button variant="destructive" className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </div>
  </header>
);
export default Head;
