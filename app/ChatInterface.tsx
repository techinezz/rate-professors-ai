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
    <div className="chat-container flex flex-col items-center mt-8"> {/* Set up a flex column layout */}
      <form onSubmit={handleSubmit} className="flex items-center mb-8"> {/* Add margin-bottom to create space below */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the names of the professors...(ex: John Doe at NYU, Jane Smith at NYU)"
          style={{ width: '800px' }}
          className="text-area resize-none p-2 h-12 border-2 border-transparent rounded-md"
        />
        <button type="submit" className="submit-button ml-2 p-2 h-12 bg-black text-white rounded-md">
          Submit
        </button>
      </form>
      <div className="professors-container flex gap-4 justify-center flex-wrap">
        {professorsData.map((professor, index) => (
          <div key={index} className="professor-box">
            <h3>{professor.name}</h3>
            <p>{professor.description}</p>
            <h4>Pros:</h4>
            <ul>
              {professor.pros.map((pro: string, idx: number) => (
                <li key={idx}>{pro}</li>
              ))}
            </ul>
            {professor.cons.length > 0 && (
              <>
                <h4>Cons:</h4>
                <ul>
                  {professor.cons.map((con: string, idx: number) => (
                    <li key={idx}>{con}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;



