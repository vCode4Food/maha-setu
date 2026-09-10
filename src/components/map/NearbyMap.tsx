import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';
import { mapCenter, nearbyLocations, maharashtraCities, type ServiceLocation } from '../../data/locations';
import { Card, Button } from '../common';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

const typeColors: Record<ServiceLocation['type'], string> = {
  employment: '#0F6F73',
  skill_development: '#D79A22',
  education: '#0B2745',
  government_service: '#A8563A',
  citizen_facilitation: '#1a5f9e',
};

interface NearbyMapProps {
  compact?: boolean;
}

export function NearbyMap({ compact = false }: NearbyMapProps) {
  const { language } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [selected, setSelected] = useState<ServiceLocation | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [city, setCity] = useState<string>('Pune');
  const [hasLocationNote, setHasLocationNote] = useState(false);
  const cityLabel = (value: string) => t(`map.city.${value}`, language);
  const locationName = (location: ServiceLocation) => t(`map.location.${location.id}.name`, language);
  const locationType = (location: ServiceLocation) => t(`map.type.${location.type}`, language);
  const locationAddress = (location: ServiceLocation) => t(`map.location.${location.id}.address`, language);
  const locationHours = (location: ServiceLocation) => t(`map.location.${location.id}.hours`, language);

  const visible = useMemo(
    () => nearbyLocations.filter((loc) => loc.city === city),
    [city]
  );

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: 13,
      zoomControl: !compact,
      scrollWheelZoom: !compact,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstance.current = null;
      layerRef.current = null;
    };
  }, [compact]);

  useEffect(() => {
    if (!mapInstance.current || !layerRef.current) return;
    layerRef.current.clearLayers();

    visible.forEach((loc) => {
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 8,
        fillColor: typeColors[loc.type],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(layerRef.current!);

      marker.on('click', () => setSelected(loc));
      marker.on('mouseover', () => marker.setRadius(10));
      marker.on('mouseout', () => marker.setRadius(8));
    });

    if (visible[0]) {
      mapInstance.current.setView([visible[0].lat, visible[0].lng], city === 'Pune' ? 13 : 12);
    }
  }, [visible, city]);

  useEffect(() => {
    if (!mapInstance.current || !selected) return;
    mapInstance.current.flyTo([selected.lat, selected.lng], 15, { duration: 0.6 });
  }, [selected]);

  const useMyLocation = () => {
    setCity('Pune');
    setHasLocationNote(true);
    const first = nearbyLocations.find((l) => l.city === 'Pune');
    if (first) setSelected(first);
  };

  return (
    <section id="nearby-map" className={`nearby-map-section ${compact ? 'nearby-map-compact' : ''}`}>
      <div className="nearby-map-header">
        <div>
          <h2 className="section-title">{t('map.title', language)}</h2>
          <p className="section-subtitle">{t('map.subtitle', language)}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={useMyLocation}>
          <LocateFixed size={14} /> {t('map.useLocation', language)}
        </Button>
      </div>

      <div className="map-city-row">
        {maharashtraCities.map((c) => (
          <button
            key={c}
            type="button"
            className={`map-city-chip ${city === c ? 'active' : ''}`}
            onClick={() => {
              setCity(c);
              setSelected(null);
            }}
          >
            {cityLabel(c)}
          </button>
        ))}
      </div>
      {hasLocationNote && <p className="section-subtitle">{t('map.locationNote', language)}</p>}

      <div className="nearby-map-layout">
        <div className="nearby-map-container">
          {!mapReady && (
            <div className="nearby-map-loading">{t('map.loading', language)}</div>
          )}
          <div ref={mapRef} className="nearby-map-canvas" aria-label={t('map.label', language)} />
        </div>

        <div className="nearby-map-list">
          <h3 className="nearby-list-title">{t('map.centres', language, { city: cityLabel(city) })}</h3>
          {visible.map((loc) => (
            <button
              key={loc.id}
              type="button"
              className={`nearby-list-item ${selected?.id === loc.id ? 'selected' : ''}`}
              onClick={() => setSelected(loc)}
            >
              <span
                className="nearby-list-dot"
                style={{ background: typeColors[loc.type] }}
                aria-hidden="true"
              />
              <div className="nearby-list-content">
                <span className="nearby-list-name">{locationName(loc)}</span>
                <span className="nearby-list-distance">{locationType(loc)} · {loc.distance}</span>
              </div>
            </button>
          ))}

          {selected && (
            <Card className="nearby-detail-card animate-fade-in">
              <div className="nearby-detail-type">{locationType(selected)}</div>
              <h4 className="nearby-detail-name">{locationName(selected)}</h4>
              <div className="nearby-detail-meta">
                <span className={selected.openToday ? 'nearby-open' : 'nearby-closed'}>
                  {selected.openToday ? t('map.open', language) : t('map.closed', language)}
                </span>
                <span>{locationHours(selected)}</span>
              </div>
              <p className="nearby-detail-address">{locationAddress(selected)}</p>
              <p className="nearby-detail-distance">{t('map.listing', language, { city: cityLabel(selected.city) })}</p>
              <Button variant="secondary" size="sm" block onClick={() => {}}>
                {t('common.viewDetails', language)}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
