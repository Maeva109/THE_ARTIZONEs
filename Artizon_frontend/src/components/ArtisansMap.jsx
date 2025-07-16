import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Charte graphique
const COLORS = {
  primary: '#14532d',      // Vert profond
  secondary: '#ff9800',    // Orange
  background: '#e6f4ea',   // Vert clair doux
  text: '#2d3a4a',         // Gris foncé
  error: '#e53935',        // Rouge
  success: '#43a047',      // Vert
};

const Wrapper = styled.div`
  background: ${COLORS.background};
  min-height: 100vh;
  font-family: 'Montserrat', Arial, sans-serif;
`;

const TopSection = styled.section`
  text-align: center;
  padding: 48px 0 24px 0;
`;

const Title = styled.h1`
  color: ${COLORS.primary};
  font-size: 3rem;
  font-family: 'Pacifico', cursive;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  color: ${COLORS.secondary};
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  font-family: 'Montserrat', Arial, sans-serif;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatCircle = styled.div`
  border: 2px solid ${COLORS.primary};
  background: ${COLORS.background};
  border-radius: 50%;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  position: relative;
`;

const StatNumber = styled.span`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${COLORS.primary};
`;

const StatLabel = styled.div`
  color: ${COLORS.secondary};
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0.5rem;
  letter-spacing: 1px;
`;

const MainSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 1400px;
  padding: 40px 0;
`;

const Sidebar = styled.div`
  flex: 1.2;
  padding-right: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SidebarTitle = styled.h3`
  color: ${COLORS.primary};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const SidebarText = styled.p`
  color: ${COLORS.text};
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  line-height: 1.6;
`;

const MapContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapImage = styled.img`
  width: 600px;
  max-width: 100%;
  border: 2px solid ${COLORS.primary};
  border-radius: 12px;
  background: ${COLORS.background};
`;

export default function ArtisansMap() {
  const [stats, setStats] = useState({
    artisans: 0,
    regions: 0,
    departments: 0,
    products: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/artisans/stats/')
      .then(res => setStats(res.data))
      .catch(() => setError('Erreur de chargement des statistiques.'));
  }, []);

  return (
    <Wrapper>
      <TopSection>
        <Title>Nos artisans créateurs</Title>
        <Subtitle>qui sont-ils ?</Subtitle>
        <StatsRow>
          <StatCard>
            <StatCircle>
              <StatNumber>{stats.artisans}</StatNumber>
            </StatCircle>
            <StatLabel>ARTISANS</StatLabel>
          </StatCard>
          <StatCard>
            <StatCircle>
              <StatNumber>{stats.regions}</StatNumber>
            </StatCircle>
            <StatLabel>RÉGIONS</StatLabel>
          </StatCard>
          <StatCard>
            <StatCircle>
              <StatNumber>{stats.departments}</StatNumber>
            </StatCircle>
            <StatLabel>DÉPARTEMENTS</StatLabel>
          </StatCard>
          <StatCard>
            <StatCircle>
              <StatNumber>{stats.products}</StatNumber>
            </StatCircle>
            <StatLabel>PRODUITS</StatLabel>
          </StatCard>
        </StatsRow>
        {error && <div style={{ color: COLORS.error, marginTop: 10 }}>{error}</div>}
      </TopSection>
      <MainSection>
        <Sidebar>
          <SidebarTitle>Tous nos artisans créateurs</SidebarTitle>
          <SidebarText>
            Afin de <b>vous aider à choisir</b> parmi tous les produits faits main de notre boutique d'artisans créateurs, nous avons développé cette carte.
          </SidebarText>
          <SidebarText>
            Cette carte regroupe <b>tous les artisans créateurs partenaires</b>.
          </SidebarText>
          <SidebarText>
            <b>Choisissez les régions et départements qui vous intéressent</b> et découvrez leurs créations originales depuis leur boutique.
          </SidebarText>
          <SidebarText>
            N'attendez plus pour découvrir ces <b>artisans créateurs talentueux</b> !
          </SidebarText>
        </Sidebar>
        <MapContainer>
          <MapImage src="/lovable-uploads/Ouest%20.png" alt="Carte des départements" />
        </MapContainer>
      </MainSection>
    </Wrapper>
  );
} 