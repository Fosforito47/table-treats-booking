import React from 'react';
import { Clock, Phone, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const RestaurantHeader = () => {
  return (
    <div className="relative text-white" style={{backgroundColor: '#485F57'}}>
      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4" style={{color: '#F4CF15'}}>
            Little Lemon
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-elegant">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Hours</h3>
              <p className="text-sm text-primary-foreground/80">
                Mon-Thu: 11:00 AM - 10:00 PM<br />
                Fri-Sat: 11:00 AM - 11:00 PM<br />
                Sun: 12:00 PM - 9:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-elegant">
            <CardContent className="p-4 text-center">
              <Phone className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Contact</h3>
              <p className="text-sm text-primary-foreground/80">
                (555) 123-4567<br />
                info@littlelemon.com
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-elegant">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-sm text-primary-foreground/80">
                123 Gourmet Street<br />
                Culinary District, CA 90210
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Now accepting reservations up to 3 months in advance</span>
          </div>
        </div>
      </div>
    </div>
  );
};