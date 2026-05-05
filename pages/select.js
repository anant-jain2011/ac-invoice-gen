import { useRouter } from "next/router";
import { useState } from "react";

const templates = [
  {
    id: "type3",
    name: "By Rail Invoice",
    description: "Used for railway transport billing",
    icon: "🚆",
  },
  {
    id: "type2",
    name: "By Road Invoice",
    description: "Used for road logistics billing",
    icon: "🚚",
  },
  {
    id: "type1",
    name: "Special Messenger",
    description: "Used for urgent/special delivery",
    icon: "📦",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select Invoice Template</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              setSelected(template.id);
              router.push("table?type=" + template.id);
            }}
            className={`cursor-pointer rounded-2xl p-5 border transition-all
              ${
                selected === template.id
                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 hover:shadow-md"
              }
            `}
          >
            <div className="text-4xl mb-3">{template.icon}</div>

            <h3 className="text-lg font-semibold">{template.name}</h3>

            <p className="text-sm text-gray-500 mt-1">{template.description}</p>

            {selected === template.id && (
              <div className="mt-3 text-blue-600 font-medium">Selected ✓</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 p-4 border rounded-xl bg-gray-50">
          <h3 className="font-semibold">Selected Template:</h3>
          <p className="capitalize">{selected}</p>

          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl">
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
