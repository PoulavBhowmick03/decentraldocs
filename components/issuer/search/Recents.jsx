const recent = [
  {
    id: 1,
    title: "Title 1",
    subtitle: "Subtitle 1",
    image: "/sample.webp",
  },
  {
    id: 2,
    title: "Title 2",
    subtitle: "Subtitle 2",
    image: "/sample.webp",
  },
  {
    id: 3,
    title: "Title 3",
    subtitle: "Subtitle 3",
    image: "/sample.webp",
  },
];

export default function Recents() {
  return (
    <div className="flex flex-col gap-4 mt-16 max-w-6xl mx-auto w-full">
      <h2 className="text-xl py-5 font-bold text-black">Recent Documents</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm">
            <div
              className="h-40 bg-gray-200 rounded-t-lg"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-black">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
