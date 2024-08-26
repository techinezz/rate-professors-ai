import { useState } from 'react';
import { MagicCard } from "@/components/magicui/magic-card"; 
import { useTheme } from "next-themes";

interface ProfessorData {
  name: string;
  rating: string;
  description: string;
  pros: string[];
  cons: string[];
}

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [professorsData, setProfessorsData] = useState<ProfessorData[]>([]);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ role: 'user', content: input }]),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      result += decoder.decode(value);
    }

    try {
      const parsedResponse = JSON.parse(result);
      const parsedData: ProfessorData[] = parsedResponse.professors || [];
      setProfessorsData(parsedData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    setInput(''); // Clear input after submission
  };

  return (
    <div className="chat-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the names of the professors..."
          className="text-area"
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <div className="professors-container flex flex-wrap gap-4">
        {professorsData.map((professor, index) => (
          <MagicCard
            key={index}
            className="cursor-pointer flex-col items-center justify-center shadow-2xl p-4 text-center"
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
          >
            <h3 className="text-2xl font-bold">{professor.name}</h3>
            <p className="text-lg italic mb-4">{professor.description}</p>
            <h4 className="font-semibold">Pros:</h4>
            <ul className="list-disc text-left">
              {professor.pros.map((pro: string, idx: number) => (
                <li key={idx}>{pro}</li>
              ))}
            </ul>
            {professor.cons.length > 0 && (
              <>
                <h4 className="font-semibold mt-2">Cons:</h4>
                <ul className="list-disc text-left">
                  {professor.cons.map((con: string, idx: number) => (
                    <li key={idx}>{con}</li>
                  ))}
                </ul>
              </>
            )}
          </MagicCard>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;
