"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const cardData = [
  {
    id: 1,
    title: "Card Title 1",
    subtitle: "Subtitle 1",
    image: "/path/to/image1.png",
  },
  {
    id: 2,
    title: "Card Title 2",
    subtitle: "Subtitle 2",
    image: "/path/to/image2.png",
  },
  {
    id: 3,
    title: "Card Title 3",
    subtitle: "Subtitle 3",
    image: "/path/to/image3.png",
  },
  {
    id: 4,
    title: "Card Title 4",
    subtitle: "Subtitle 4",
    image: "/path/to/image4.png",
  },
  {
    id: 5,
    title: "Card Title 5",
    subtitle: "Subtitle 5",
    image: "/path/to/image5.png",
  },
  {
    id: 6,
    title: "Card Title 6",
    subtitle: "Subtitle 6",
    image: "/path/to/image6.png",
  },
  {
    id: 7,
    title: "Card Title 7",
    subtitle: "Subtitle 7",
    image: "/path/to/image7.png",
  },
  {
    id: 8,
    title: "Card Title 8",
    subtitle: "Subtitle 8",
    image: "/path/to/image8.png",
  },
  {
    id: 9,
    title: "Card Title 9",
    subtitle: "Subtitle 9",
    image: "/path/to/image9.png",
  },
];

const DocumentArray = ({ documents }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Issued Documents</h2>
      <Link href="/issuer/issued" passHref>
        <Button variant="link" className="text-blue-600">View All</Button>
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <motion.div key={doc.id} variants={cardVariants} whileHover="hover">
          <Card>
            <CardContent className="pt-6">
              <Image
                src="/sample.webp"
                alt={doc.title}
                width={200}
                height={100}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.subtitle}</CardDescription>
              </CardHeader>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);