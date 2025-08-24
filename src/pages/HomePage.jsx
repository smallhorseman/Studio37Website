import Hero from '../components/Hero';
import ServicesHighlight from '../components/ServicesHighlight';
import PackagesHighlight from '../components/PackagesHighlight';
import PortfolioUnlock from '../components/PortfolioUnlock';

function HomePage() {
  return (
    <>
      <Hero />
      <ServicesHighlight />
      <PackagesHighlight />
      <PortfolioUnlock />
    </>
  );
}

export default HomePage;
