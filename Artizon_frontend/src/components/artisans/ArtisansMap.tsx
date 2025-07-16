import { useEffect, useState } from 'react';
import { Users, Globe, MapPin, Package } from 'lucide-react';

// Charte graphique
const COLORS = {
  primary: '#14532d',      // Vert profond
  secondary: '#ff9800',    // Orange
  background: '#e6f4ea',   // Vert clair doux
  text: '#2d3a4a',         // Gris foncé
  error: '#e53935',        // Rouge
  success: '#43a047',      // Vert
};

// Add this style for the stat circle animation
const statCircleStyle = {
  border: `2px solid ${COLORS.primary}`,
  background: COLORS.background,
  borderRadius: '50%',
  width: 110,
  height: 110,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem',
  fontSize: '2.2rem',
  fontWeight: 700,
  color: COLORS.primary,
  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
  cursor: 'pointer',
};

export const ArtisansMap = () => {
  const [stats, setStats] = useState({
    artisans: 0,
    regions: 0,
    departments: 0,
    products: 0,
  });
  const [error, setError] = useState('');
  const [mapHovered, setMapHovered] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/artisans/stats/')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setError('Erreur de chargement des statistiques.'));
  }, []);

  return (
    <div style={{ background: COLORS.background, minHeight: '100vh', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Top Section */}
      <section className="text-center pt-12 pb-2">
        <h1
          style={{
            color: COLORS.primary,
            fontFamily: 'Pacifico, cursive',
            fontSize: '3.2rem',
            marginBottom: '0.2rem',
            letterSpacing: 1,
          }}
        >

        </h1>
        <div className="flex items-center justify-center gap-3 mb-6">
          <Users className="h-10 w-10 text-[#405B35]" />
          <span className="text-4xl md:text-5xl font-bold text-[#405B35]" style={{fontFamily: 'Montserrat, Arial, sans-serif'}}>
            Carte des artisans. Voir profils.
          </span>
          <span className="inline-block">
            <svg className="h-10 w-10 text-orange-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        </div>
        <div className="flex justify-center gap-16 mb-0">
          {[
            { label: 'ARTISANS', value: stats.artisans, icon: <Users size={38} style={{position:'absolute', bottom:10, right:10, opacity:0.18, color:COLORS.primary}} /> },
            { label: 'RÉGIONS', value: stats.regions, icon: <Globe size={38} style={{position:'absolute', bottom:10, right:10, opacity:0.18, color:COLORS.primary}} /> },
            { label: 'DÉPARTEMENTS', value: stats.departments, icon: <MapPin size={38} style={{position:'absolute', bottom:10, right:10, opacity:0.18, color:COLORS.primary}} /> },
            { label: 'PRODUITS', value: stats.products, icon: <Package size={38} style={{position:'absolute', bottom:10, right:10, opacity:0.18, color:COLORS.primary}} /> },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div
                style={{ ...statCircleStyle, position: 'relative' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {stat.value}
                {stat.icon}
              </div>
              <div
                style={{
                  color: COLORS.secondary,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        {error && <div style={{ color: COLORS.error, marginTop: 10 }}>{error}</div>}
      </section>

      {/* Main Section */}
      <section className="flex flex-row items-center justify-center w-full pt-6 pb-0" style={{maxWidth: 'none'}}>
        {/* Text/Sidebar */}
        <div className="max-w-lg w-full pr-8 text-left flex flex-col justify-center">
          <h3
            style={{
              color: COLORS.primary,
              fontSize: '2.2rem',
              fontWeight: 700,
              marginBottom: '1.2rem',
            }}
          >
            Tous nos artisans créateurs
          </h3>
          <p style={{ color: COLORS.text, fontSize: '1.1rem', marginBottom: '1.1rem', lineHeight: 1.6 }}>
            Afin de <b>vous aider à choisir</b> parmi tous les produits faits main de notre boutique d'artisans créateurs, nous avons développé cette carte.
          </p>
          <p style={{ color: COLORS.text, fontSize: '1.1rem', marginBottom: '1.1rem', lineHeight: 1.6 }}>
            Cette carte regroupe <b>tous les artisans créateurs partenaires</b>.
          </p>
          <p style={{ color: COLORS.text, fontSize: '1.1rem', marginBottom: '1.1rem', lineHeight: 1.6 }}>
            <b>Choisissez les départements qui vous intéressent</b> et découvrez leurs créations originales depuis leur boutique.
          </p>
          <p style={{ color: COLORS.text, fontSize: '1.1rem', marginBottom: '1.1rem', lineHeight: 1.6 }}>
            N'attendez plus pour découvrir ces <b>artisans créateurs talentueux</b> !
          </p>
        </div>
        {/* Map */}
        <div className="flex flex-col items-center justify-center">
          <img
            src="/lovable-uploads/Ouest.png"
            alt="Carte des départements"
            style={{
              width: 800,
              maxWidth: '80vw',
              border: 'none',
              borderRadius: 0,
              background: COLORS.background,
              boxShadow: 'none',
              transform: 'none',
              transition: 'none',
              cursor: 'pointer',
            }}
          />
      </div>
    </section>
    </div>
  );
};

export default ArtisansMap;
