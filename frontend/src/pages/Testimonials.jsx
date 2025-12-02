import Navbar from '../components/Navbar';
import Card from '../components/Card';

const Testimonials = () => {
  const items = [
    { name: 'TechNova', text: 'We hired 3 amazing engineers via this portal.' },
    { name: 'BrightWorks', text: 'Posting and screening candidates was seamless.' },
    { name: 'CloudSpark', text: 'The candidate quality and speed were excellent.' },
  ];
  return (
    <div className="min-h-screen bg-[#0D0F13]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <Card key={idx}>
              <h3 className="text-white font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-300">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
