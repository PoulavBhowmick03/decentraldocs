"use client";

import Image from "next/image";
import Link from "next/link";

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

export const DocumentArray = () => {
  return (
    <div className="max-w-6xl py-4 pr-10 pl-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Your Issued Documents</h2>
        <Link href="/issuer/issued" className="text-blue-600 font-semibold">
          View All
        </Link>
      </div>
      <div className="overflow-x-scroll scrollbar-hide">
        <div className="grid grid-flow-col auto-cols-min grid-rows-2 gap-x-5 gap-y-8">
          {cardData.map((card, index) => (
            <div
              key={card.id}
              className={`min-w-[300px] p-4 min-h-[px] bg-white rounded-lg shadow-md flex-shrink-0 ${
                index % 2 === 0 ? "row-start-1" : "row-start-2"
              }`}
            >
              <Image
                src="/sample.webp"
                alt={card.title}
                // className="w-full h-24 object-contain mb-2"
                width={200}
                height={100}
              />
              <h3 className="text-sm font-semibold">{card.title}</h3>
              <p className="text-xs text-gray-600">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
