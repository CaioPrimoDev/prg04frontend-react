import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardFilm from "../../components/cardFilm";
import poster1 from "../../assets/images/Matrix-locandina.jpg";
import poster2 from "../../assets/images/interestelar.jpeg";
import poster3 from "../../assets/images/senhor-dos-aneis.jpeg";

function Home() {
  return (
    <>
      <Header />   {/* Header exclusivo da Home */}
      <main className="container mt-5">
        <div className="row justify-content-center g-4">
        <CardFilm
          image={poster1}
          title="Matrix"
          description="Um clássico da ficção científica."
        />
        <CardFilm
          image={poster2}
          title="Interestelar"
          description="Exploração espacial e emoção."
        />
        <CardFilm
          image={poster3}
          title="O Senhor dos Anéis"
          description="Uma jornada épica pela Terra Média."
        />
      </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
