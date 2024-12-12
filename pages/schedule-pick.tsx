"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "react-hot-toast";
import OrderService from "@/app/services/orderService";
import { useRouter } from "next/navigation";
import { de } from "date-fns/locale";
import { GetServerSideProps } from "next";
import { getI18nProps } from "@/utils/server-side-translation";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/app/components/Loader/Loader";
import { useTranslation } from "next-i18next";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return getI18nProps(locale);
};
interface SchedulePickupProps {
  onBack: () => void;
}

const SchedulePickup = ({ onBack }: SchedulePickupProps) => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  // const [selectedTime, setSelectedTime] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const { t } = useTranslation("common");
  const [instructions, setInstructions] = useState("");

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push({
        date: date.toISOString().split("T")[0],
        day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
          date
        ),
        dateNum: date.getDate(),
        month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
          date
        ),
      });
    }
    return days;
  };

  // Time slots - commented out
  /*
  const timeSlots = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '12:00 PM', available: true },
    { id: '5', time: '01:00 PM', available: true },
    { id: '6', time: '02:00 PM', available: true },
    { id: '7', time: '03:00 PM', available: false },
    { id: '8', time: '04:00 PM', available: true },
    { id: '9', time: '05:00 PM', available: true },
  ];
  */

  const handleSchedule = () => {
    if (!selectedDate) {
      toast.error("Please select date");
      return;
    }
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      toast.error("Please fill in the required address fields");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      if (!orderData) {
        toast.error("Order data not found");
        return;
      }

      // Format date for pickup
      // const pickupDateTime = `${selectedDate} ${convertTo24Hour(selectedTime)}`;

      // Calculate delivery time (24 hours after pickup) - commented out
      /*
      const pickupDate = new Date(selectedDate + ' ' + convertTo24Hour(selectedTime));
      const deliveryDate = new Date(pickupDate);
      deliveryDate.setHours(deliveryDate.getHours() + 24);
      */

      const orderPayload = {
        shop_id: orderData.shop.id,
        items: orderData.items.map((item: any) => ({
          type: item.type,
          count: item.count,
        })),
        pickup_date: selectedDate,
        // pickup_time: pickupDateTime,
        // delivery_time: formatDateTime(deliveryDate),
        total_amount: orderData.totalAmount,
        status: "pending" as const,
        pickup_address: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        special_instructions: instructions || undefined,
      };

      // Helper functions commented out
      /*
      function convertTo24Hour(time12h: string) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (hours === '12') {
          hours = '00';
        }
        
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12 + '';
        }
        
        return `${hours.padStart(2, '0')}:${minutes}:00`;
      }
  
      function formatDateTime(date: Date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      }
      */

      console.log("Sending order payload:", orderPayload);

      const response = await OrderService.createOrder(orderPayload);
      toast.success("Order placed successfully!");
      sessionStorage.removeItem("currentOrder");
      router.push("/");
    } catch (error: any) {
      console.error("Failed to place order:", error);
      toast.error(error.response?.data?.error || "Failed to place order");
    }
  };

  useEffect(() => {
    // Retrieve the order data when component mounts
    const savedOrderData = sessionStorage.getItem("currentOrder");
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    }
  }, []);

  // Confirmation Modal
  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {t("schedule-pickup.schedule-pickup")}
          </h3>
          <button onClick={() => setShowConfirmation(false)}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Shop Info */}
          <div>
            <p className="text-sm text-gray-600">{t("schedule-pickup.shop")}</p>
            <p className="font-medium">{orderData?.shop.name}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-sm text-gray-600">
              {t("schedule-pickup.items")}
            </p>
            {orderData?.items.map((item: any, index: number) => (
              <p key={index} className="font-medium">
                {item.count}x {item.type}
              </p>
            ))}
          </div>

          {/* Pickup Details */}
          <div>
            <p className="text-sm text-gray-600">
              {t("schedule-pickup.pickupDate")}
            </p>
            <p className="font-medium">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {/* at {selectedTime} */}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-600">
              {t("schedule-pickup.pickupAddress")}
            </p>
            <p className="font-medium">
              {address.street}
              <br />
              {address.landmark && `${address.landmark}, `}
              {address.city}, {address.state} {address.pincode}
            </p>
          </div>

          {/* Instructions */}
          {instructions && (
            <div>
              <p className="text-sm text-gray-600">
                {t("schedule-pickup.specialInstructions")}
              </p>
              <p className="font-medium">{instructions}</p>
            </div>
          )}

          {/* Total Amount */}
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <p className="font-medium">{t("schedule-pickup.totalAmount")}</p>
              <p className="font-medium">₹{orderData?.totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {t("schedule-pickup.confirmOrder")}
          </button>
          <button
            onClick={() => setShowConfirmation(false)}
            className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200"
          >
            {t("schedule-pickup.editDetails")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">
              {t("schedule-pickup.schedulePickup")}
            </h1>
          </div>
        </div>
      </div>

      <div className="pt-16 pb-20">
        <main className="max-w-2xl mx-auto px-4">
          {/* Date Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 mt-6">
              {t("schedule-pickup.selectDate")}
            </h2>
            <div className="grid grid-cols-4 gap-3 md:grid-cols-7">
              {getAvailableDates().map((date) => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  className={`p-3 rounded-lg flex flex-col items-center ${
                    selectedDate === date.date
                      ? "bg-blue-600 text-white"
                      : "bg-white border hover:border-blue-600"
                  }`}
                >
                  <span className="text-sm">{date.day}</span>
                  <span className="text-lg font-semibold">{date.dateNum}</span>
                  <span className="text-sm">{date.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection - commented out
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Select Time</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    !slot.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : selectedTime === slot.time
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border hover:border-blue-600'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{slot.time}</span>
                </button>
              ))}
            </div>
          </div>
          */}

          {/* Address Form */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">
              {t("schedule-pickup.pickupAddress")}
            </h2>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t("schedule-pickup.streetAddress")}
              </label>
              <input
                type="text"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter street address"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t("schedule-pickup.landmark")} ({t("schedule-pickup.optional")}
                )
              </label>
              <input
                type="text"
                value={address.landmark}
                onChange={(e) =>
                  setAddress({ ...address, landmark: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Near..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t("schedule-pickup.city")}
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t("schedule-pickup.state")}
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t("schedule-pickup.pinCode")}
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {t("schedule-pickup.specialInstructions")} (
                {t("schedule-pickup.optional")})
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Add any special instructions..."
              />
            </div>

            <button
              onClick={handleSchedule}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {t("schedule-pickup.schedulePickup")}
            </button>
          </div>
        </main>
      </div>

      {showConfirmation && <ConfirmationModal />}
    </div>
  );
};

export default SchedulePickup;
