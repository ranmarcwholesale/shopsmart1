import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MapboxGl from 'mapbox-gl';
import './Payment.css';

const mapboxToken = 'pk.eyJ1Ijoic2hvcHNtYXJ0IiwiYSI6ImNsenE2MHZnbzFmNDAyam9jZDB3cnowcjYifQ.gQutFHgAC9GNhpbMk_FfUg'; // Replace with your actual Mapbox access token

MapboxGl.accessToken = mapboxToken;

function Payment() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({ lng: -73.935242, lat: 40.730610 });
  const [address, setAddress] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');

  useEffect(() => {
    const mapInstance = new MapboxGl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [location.lng, location.lat],
      zoom: 12,
    });

    mapInstance.on('click', (event) => {
      const { lngLat } = event;
      setLocation({ lng: lngLat.lng, lat: lngLat.lat });
      reverseGeocode(lngLat.lng, lngLat.lat);
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const reverseGeocode = async (lng, lat) => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`);
    const data = await response.json();
    const place = data.features[0];
    setAddress(place.place_name);

    const addressParts = place.place_name.split(', ');
    setStreet(addressParts[0] || '');
    setCity(addressParts[1] || '');

    // Extract state and zipcode more robustly
    if (addressParts.length > 2) {
      const stateZipcode = addressParts[2];
      const stateZipcodeParts = stateZipcode.split(' ');
      
      // Find index of first numeric character to separate state and zipcode
      const index = stateZipcodeParts.findIndex(part => /^\d/.test(part));
      
      if (index >= 0) {
        setState(stateZipcodeParts.slice(0, index).join(' ') || '');
        setZipcode(stateZipcodeParts.slice(index).join(' ') || '');
      } else {
        setState(stateZipcodeParts.join(' ') || '');
        setZipcode('');
      }
    } else {
      setState('');
      setZipcode('');
    }
  };

  const handleCompletePurchase = () => {
    navigate('/stripe-payment'); // Navigate to the StripePayment route
  };

  return (
    <div className="payment">
      <div id="map" className="payment__map"></div>
      <div className="payment__details">
        <h2>Delivery Address</h2>
        <p className="payment__address">{address}</p>
        <label>
          <span>Street</span>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Enter street address"
          />
        </label>
        <label>
          <span>City</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </label>
        <label>
          <span>State</span>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
          />
        </label>
        <label>
          <span>Zipcode</span>
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="Enter zipcode"
          />
        </label>
        <h2>Payment Options</h2>
        <div className="payment__options">
          <label>
            <input type="radio" name="payment" value="credit" />
            Credit Card
          </label>
          <label>
            <input type="radio" name="payment" value="paypal" />
            PayPal
          </label>
        </div>
        <button className="payment__button" onClick={handleCompletePurchase}>Complete Purchase</button>
      </div>
    </div>
  );
}

export default Payment;
