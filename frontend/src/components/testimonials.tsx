import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at TechStart',
    content: 'BuilderHub transformed our development process. What used to take months now takes weeks. The AI-generated code is production-ready and follows best practices.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Lead Developer at InnovateCo',
    content: 'The real-time collaboration features are game-changing. Our team can work together seamlessly, and the code quality is consistently excellent.',
    rating: 5,
  },
  {
    name: 'Emily Johnson',
    role: 'Founder at StartupXYZ',
    content: 'As a non-technical founder, BuilderHub allowed me to bring my vision to life without hiring a large development team. It\'s been invaluable for our growth.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by teams worldwide
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what our customers have to say about their experience with BuilderHub.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="pt-8 sm:inline-block sm:w-full sm:px-4"
              >
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                  <StarRating rating={testimonial.rating} />
                  <blockquote className="mt-4 text-gray-900">
                    <p className="text-lg leading-7">{testimonial.content}</p>
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </figcaption>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}