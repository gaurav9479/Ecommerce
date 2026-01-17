import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';


import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const CheckoutDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        timeSlot: ""
    });
    

    const [position, setPosition] = useState({ lat: 19.0760, lng: 72.8777 });

    const timeSlots = [
        "09:00 AM - 12:00 PM",
        "12:00 PM - 03:00 PM",
        "03:00 PM - 06:00 PM",
        "06:00 PM - 09:00 PM"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate('/payment', { 
            state: { 
                shippingAddress: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zip}`,
                timeSlot: formData.timeSlot,
                coordinates: position
            } 
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 section-padding pt-24">
            <div className="container-custom max-w-4xl w-full mx-auto">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-4xl font-extrabold gradient-text mb-3">Delivery Details</h1>
                    <p className="text-slate-400">Pin your location and choose a preferred delivery window.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">

                    <div className="glass-strong rounded-3xl overflow-hidden border border-slate-700/50 animate-slideInLeft h-[500px] sticky top-24">
                        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                            <span className="text-white font-bold flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                Pin your location
                            </span>
                            <span className="text-xs text-slate-500 uppercase font-black">OpenStreetMap</span>
                        </div>
                        <MapContainer 
                            center={[position.lat, position.lng]} 
                            zoom={13} 
                            scrollWheelZoom={true}
                            style={{ height: 'calc(100% - 56px)', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationPicker position={position} setPosition={setPosition} />
                        </MapContainer>
                        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700 text-xs text-slate-300 z-[1000]">
                            Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                        </div>
                    </div>


                    <div className="glass-strong rounded-3xl p-8 md:p-10 border border-slate-700/50 relative overflow-hidden animate-slideInRight">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Street Address</label>
                                        <input 
                                            type="text" 
                                            placeholder="123 Luxury Lane" 
                                            className="input-field" 
                                            required
                                            value={formData.street}
                                            onChange={(e) => setFormData({...formData, street: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">City</label>
                                            <input 
                                                type="text" 
                                                placeholder="Mumbai" 
                                                className="input-field" 
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">State</label>
                                            <input 
                                                type="text" 
                                                placeholder="Maharashtra" 
                                                className="input-field" 
                                                required
                                                value={formData.state}
                                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Zip Code</label>
                                        <input 
                                            type="text" 
                                            placeholder="400001" 
                                            className="input-field" 
                                            required
                                            value={formData.zip}
                                            onChange={(e) => setFormData({...formData, zip: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    Delivery Time Slot
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {timeSlots.map((slot) => (
                                        <label 
                                            key={slot} 
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-center ${
                                                formData.timeSlot === slot 
                                                ? 'bg-purple-500/10 border-purple-500 text-white shadow-glow' 
                                                : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="timeSlot" 
                                                className="hidden" 
                                                required
                                                onChange={() => setFormData({...formData, timeSlot: slot})}
                                            />
                                            <span className="font-semibold text-sm">{slot}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg group">
                                    Proceed to Payment
                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutDetails;
