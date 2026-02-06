import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { FaMapMarkerAlt, FaTimes, FaInfoCircle } from 'react-icons/fa';

const SchemeMap = () => {
  const { currentLanguage } = useLanguage();
  const [schemeLocations, setSchemeLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const scriptLoadedRef = useRef(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

  useEffect(() => {
    fetchSchemeLocations();
    loadGoogleMapsScript();
    
    return () => {
      // Cleanup markers on unmount
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, []);

  useEffect(() => {
    if (schemeLocations.length > 0 && mapsLoaded && mapRef.current && window.google) {
      initializeMap();
    }
  }, [schemeLocations, mapsLoaded]);

  const loadGoogleMapsScript = () => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapsLoaded(true));
      return;
    }

    // Create callback function
    window.initGoogleMaps = () => {
      setMapsLoaded(true);
      delete window.initGoogleMaps;
    };

    // Load script with callback
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setError('Failed to load Google Maps. Please check your API key.');
      setLoading(false);
    };
    document.head.appendChild(script);
  };

  const fetchSchemeLocations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schemes/map/locations');
      setSchemeLocations(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch scheme locations:', err);
      setError('Failed to load scheme locations');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.log('Map initialization delayed - waiting for Google Maps API');
      return;
    }

    // Don't reinitialize if map already exists
    if (googleMapRef.current) {
      console.log('Map already initialized, updating markers only');
      updateMarkers();
      return;
    }

    try {
      // Initialize map centered on New Delhi (shows Pan-India schemes)
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 28.6139, lng: 77.2090 }, // New Delhi
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      googleMapRef.current = map;
      updateMarkers();
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  };

  const updateMarkers = () => {
    if (!googleMapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each location
    schemeLocations.forEach((locationData) => {
      const marker = new window.google.maps.Marker({
        position: locationData.coordinates,
        map: googleMapRef.current,
        title: locationData.location,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#C2410C',
          fillOpacity: 0.8,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        label: {
          text: String(locationData.schemes.length),
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });

      marker.addListener('click', () => {
        setSelectedLocation(locationData);
        setSelectedScheme(null);
      });

      markersRef.current.push(marker);
    });
  };

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme);
  };

  const closeModal = () => {
    setSelectedLocation(null);
    setSelectedScheme(null);
  };

  if (loading || !mapsLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {!mapsLoaded 
              ? (currentLanguage === 'english' ? 'Loading Google Maps...' : 'Google मैप्स लोड हो रहा है...')
              : (currentLanguage === 'english' ? 'Loading scheme map...' : 'योजना मानचित्र लोड हो रहा है...')
            }
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-600">
          <FaInfoCircle className="text-4xl mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Map Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {currentLanguage === 'english' ? 'Government Schemes Map' : 'सरकारी योजना मानचित्र'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentLanguage === 'english' 
            ? 'Click on any marker to view schemes available in that state' 
            : 'उस राज्य में उपलब्ध योजनाओं को देखने के लिए किसी भी मार्कर पर क्लिक करें'}
        </p>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-700"
          style={{ minHeight: '400px' }}
        />

        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {currentLanguage === 'english' ? 'Quick Stats' : 'त्वरित आंकड़े'}
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-primary-600">{schemeLocations.length}</span> {currentLanguage === 'english' ? 'Locations' : 'स्थान'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-primary-600">
                {schemeLocations.reduce((sum, loc) => sum + loc.schemes.length, 0)}
              </span> {currentLanguage === 'english' ? 'Total Schemes' : 'कुल योजनाएं'}
            </p>
          </div>
        </div>
      </div>

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-primary-600 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-2xl" />
                <h3 className="text-xl font-bold">{selectedLocation.location}</h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-white hover:bg-primary-700 rounded-full p-2 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {!selectedScheme ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentLanguage === 'english' 
                      ? `${selectedLocation.schemes.length} schemes available in this location` 
                      : `इस स्थान पर ${selectedLocation.schemes.length} योजनाएं उपलब्ध हैं`}
                  </p>
                  <div className="grid gap-3">
                    {selectedLocation.schemes.map((scheme) => (
                      <div
                        key={scheme.id}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleSchemeClick(scheme)}
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {scheme.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {scheme.purpose}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded">
                            {scheme.gov_name}
                          </span>
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            {currentLanguage === 'english' ? 'View Details →' : 'विवरण देखें →'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Scheme Details View */}
                  <button
                    onClick={() => setSelectedScheme(null)}
                    className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
                  >
                    ← {currentLanguage === 'english' ? 'Back to schemes' : 'योजनाओं पर वापस जाएं'}
                  </button>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedScheme.name}
                      </h4>
                      <div className="flex gap-2 mb-4">
                        <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full">
                          {selectedScheme.gov_name}
                        </span>
                        <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
                          {selectedScheme.purpose}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {currentLanguage === 'english' ? 'Description' : 'विवरण'}
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedScheme.description}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`/user/schemes?scheme=${selectedScheme.id}`}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-center"
                      >
                        {currentLanguage === 'english' ? 'Apply Now' : 'अभी आवेदन करें'}
                      </a>
                      <button
                        onClick={closeModal}
                        className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        {currentLanguage === 'english' ? 'Close' : 'बंद करें'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeMap;
