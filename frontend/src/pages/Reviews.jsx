import Navbar from '../components/Navbar';
import Card from '../components/Card';

const Reviews = () => {
  const items = [
    { author: 'Aisha K.', text: 'Great platform to discover roles and apply easily.' },
    { author: 'Rahul S.', text: 'Posting jobs and managing applications is straightforward.' },
    { author: 'Maya P.', text: 'Clean UI and fast responses. Loved the experience.' },
  ];
  return (
    <div className="min-h-screen bg-[#0D0F13]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <Card key={idx}>
              <p className="text-gray-300 mb-3">{item.text}</p>
              <div className="text-sm text-gray-500">— {item.author}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
