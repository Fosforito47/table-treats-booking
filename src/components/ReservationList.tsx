import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Users, MapPin, Phone, Mail, MessageSquare, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useBooking, Reservation } from '@/contexts/BookingContext';
import { toast } from '@/hooks/use-toast';

const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
  const { cancelReservation } = useBooking();

  const handleCancel = () => {
    cancelReservation(reservation.id);
    toast({
      title: 'Reservation Cancelled',
      description: `Reservation for ${reservation.customerName} has been cancelled.`,
    });
  };

  const getTablePreferenceLabel = (preference: string) => {
    const labels: Record<string, string> = {
      window: 'Window',
      patio: 'Patio',
      indoor: 'Indoor',
      no_preference: 'No Preference',
    };
    return labels[preference] || preference;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className={`shadow-soft hover:shadow-gold transition-smooth ${reservation.status === 'cancelled' ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display text-restaurant-brown">
            {reservation.customerName}
          </CardTitle>
          <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
            {reservation.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Reservation #{reservation.id.slice(-8)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(parseISO(reservation.date), 'MMMM do, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formatTime(reservation.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{getTablePreferenceLabel(reservation.tablePreference)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{reservation.email}</span>
          </div>
        </div>

        {reservation.specialRequests && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-start gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-muted-foreground">Special Requests:</p>
                <p className="text-foreground">{reservation.specialRequests}</p>
              </div>
            </div>
          </div>
        )}

        {reservation.status === 'confirmed' && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this reservation for {reservation.customerName}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Cancel Reservation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ReservationList = () => {
  const { getActiveReservations, state } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');

  const activeReservations = getActiveReservations();
  const allReservations = state.reservations;

  const filteredReservations = allReservations.filter(reservation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.customerName.toLowerCase().includes(searchLower) ||
      reservation.phone.includes(searchTerm) ||
      reservation.email.toLowerCase().includes(searchLower) ||
      reservation.date.includes(searchTerm)
    );
  });

  const sortedReservations = filteredReservations.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader className="bg-gradient-warm rounded-t-lg">
          <CardTitle className="text-2xl font-display text-restaurant-brown">Reservations</CardTitle>
          <CardDescription className="text-restaurant-brown/70">
            Manage your restaurant bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, email, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-smooth focus:shadow-gold"
              />
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground items-center whitespace-nowrap">
              <span>Total: {allReservations.length}</span>
              <span>•</span>
              <span>Active: {activeReservations.length}</span>
            </div>
          </div>

          {sortedReservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {searchTerm ? 'No matching reservations' : 'No reservations yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'Reservations will appear here once customers start booking.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};