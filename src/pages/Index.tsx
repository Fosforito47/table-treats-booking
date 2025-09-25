import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingProvider } from '@/contexts/BookingContext';
import { RestaurantHeader } from '@/components/RestaurantHeader';
import { BookingForm } from '@/components/BookingForm';
import { ReservationList } from '@/components/ReservationList';

const Index = () => {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        <RestaurantHeader />
        
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="booking" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-restaurant-warm shadow-soft">
              <TabsTrigger 
                value="booking" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
              >
                Make Reservation
              </TabsTrigger>
              <TabsTrigger 
                value="reservations"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
              >
                View Reservations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="animate-fade-in">
              <BookingForm />
            </TabsContent>

            <TabsContent value="reservations" className="animate-fade-in">
              <ReservationList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BookingProvider>
  );
};

export default Index;