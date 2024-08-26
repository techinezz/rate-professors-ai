import { useState } from 'react';

interface ProfessorData {
  name: string;
  rating: string;
  pros: string[];
  cons: string[];
}

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [professorsData, setProfessorsData] = useState<ProfessorData[]>([]);

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
      const parsedData: ProfessorData[] = parsedResponse.professors || []; // Access the professors array
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
      <div className="professors-container">
  {Array.isArray(professorsData) && professorsData.map((professor, index) => (
    <div key={index} className="professor-box">
      <h3>{professor.name}</h3>
      <p>{professor.rating}</p>
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
