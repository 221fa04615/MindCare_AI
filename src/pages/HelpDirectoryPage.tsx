import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Star, Phone, Mail, Globe, Filter, Users } from 'lucide-react';

const HelpDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const therapists = [
    {
      id: 1,
      name: "Dr. Niharika Adigoppula",
      specialization: "Anxiety & Depression",
      location: "Guntur Ind, ",
      rating: 4.9,
      image: "https://images.pexels.com/photos/32032487/pexels-photo-32032487.jpeg?cs=srgb&dl=pexels-ahmad-shalbaf-3446858-32032487.jpg&fm=jpg",
      phone: "+91 8498935089",
      email: "niharika.a@mindcare.ai"
    },
    {
      id: 2,
      name: "Dr. Abhishek sharma",
      specialization: "Academic & Career Counseling",
      location: "Punjab, Ind",
      rating: 4.8,
      image: "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2025/05/05133449/abhishek-sharma-1600x900.jpg",
      phone: "+91 8946524800",
      email: "abhi.s@mindcare.ai"
    },
    {
      id: 3,
      name: "Dr. Kavya Kanna",
      specialization: "Trauma & PTSD",
      location: "Lalpuram, Ind",
      rating: 5.0,
      image: "https://images.pexels.com/photos/31566377/pexels-photo-31566377.jpeg?cs=srgb&dl=pexels-manish-jain-1176829519-31566377.jpg&fm=jpg",
      phone: "+91 9121324380",
      email: "kavya.k@mindcare.ai"
    },
    {
      id: 4,
      name: "Dr. Virat Kohli",
      specialization: "Behavioral Therapy",
      location: "Delhi, Ind",
      rating: 4.7,
      image: "https://static01.nyt.com/athletic/uploads/wp/2025/05/10092152/virat-kohli-scaled-e1746883367691-1024x681.jpg?width=1248&quality=70&auto=webp",
      phone: "+91 9298765432",
      email: "v.k@mindcare.ai"
    },
    {
      id: 5,
      name: "Dr. Mounika Podili",
      specialization: "Child Psychology",
      location: "Tenali, Ind",
      rating: 4.9,
      image: "https://img.freepik.com/premium-photo/woman-home-beauty-portrait-happy-random-scenes_425671-1833.jpg",
      phone: "+91 6305045678",
      email: "mounika.p@mindcare.ai"
    },
    {
      id: 6,
      name: "Dr. Ishaan Kishan",
      specialization: "Family Therapy",
      location: "Bihar, India",
      rating: 4.6,
      image: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/lsci/db/PICTURES/CMS/331100/331165.1.png",
      phone: "+91 9312345678",
      email: "i.kishan@mindcare.ai"
    },
    {
      id: 7,
      name: "Dr. Deepika R",
      specialization: "Behavioral Therapy",
      location: "Hyderabad, Ind",
      rating: 4.9,
      image: "https://img.freepik.com/premium-photo/asian-woman-home-beauty-portrait-happy-random-scenes_425671-1822.jpg",
      phone: "+91 7123495678",
      email: "r.deepika@mindcare.ai"
    },
    {
      id: 8,
      name: "Dr. Rohith Sharma",
      specialization: "Child Psychology",
      location: "Kolkata, Ind",
      rating: 4.9,
      image: "https://thenewsmen.co.in/public/upload/news/story_image_1706100416.jpg",
      phone: "+91 8412345678",
      email: "ro.hit@mindcare.ai"
    },
    {
      id: 9,
      name: "Dr. Vaishnavi",
      specialization: "Family Therapy",
      location: "Chennai, Ind",
      rating: 4.9,
      image: "https://hotpot.ai/images/site/testimonials/social/linkedin_jane_petra_scott/gallery2.jpg",
      phone: "+91 7123475678",
      email: "Yshnavi.r@mindcare.ai"
    },
    {
      id: 10,
      name: "Dr. Dev Padikkal",
      specialization: "Child Psychology",
      location: "Banglore, Ind",
      rating: 4.9,
      image: "https://ik.imagekit.io/j83rchiauw/seo_popular_master/202404241941_QytQNmqMl4hgzPjR.jpg",
      phone: "+91 6923415678",
      email: "dev.p@mindcare.ai"
    },
    {
      id: 11,
      name: "Dr. Divija P",
      specialization: "Child Psychology",
      location: "Tenali, Ind",
      rating: 4.9,
      image: "https://sti.mfstat.net/3/single-women/single-woman-35-years.webp",
      phone: "+91 9123465678",
      email: "divija.p@mindcare.ai"
    },
    {
      id: 12,
      name: "Dr. Tilak Verma",
      specialization: "Behavioral Therapy",
      location: "Hyderabad, Ind",
      rating: 4.9,
      image: "https://www.m9.news/wp-content/uploads/2025/10/tilak-verma-opens-up-about-fatal-illness.jpg",
      phone: "+91 6902345678",
      email: "v.tilak@mindcare.ai"
    }
  ];

  const filteredTherapists = therapists.filter(t => 
    (filter === 'All' || t.specialization.includes(filter)) &&
    (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Professional Help Directory</h1>
          <p className="text-gray-500 mt-2">Connect with verified mental health professionals who can support you.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none font-medium text-gray-700 font-serif"
            >
              <option value="All">All Specializations</option>
              <option value="Anxiety">Anxiety</option>
              <option value="Depression">Depression</option>
              <option value="Academic">Academic & Career Counseling</option>
              <option value="Trauma">Trauma</option>
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTherapists.map((therapist, i) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-serif">{therapist.name}</h3>
                    <p className="text-primary font-medium text-sm">{therapist.specialization}</p>
                    <div className="flex items-center text-accent mt-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-bold">{therapist.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {therapist.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    {therapist.phone}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    {therapist.email}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10">
                    Book Session
                  </button>
                  <button className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                    <Globe className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTherapists.length === 0 && (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No professionals found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpDirectoryPage;
