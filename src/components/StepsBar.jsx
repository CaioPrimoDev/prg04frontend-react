import "../assets/styles/StepsBar.css";

function StepsBar({ currentStep, doneSteps = [] }) {
  const steps = ["Filme", "Ingresso", "Poltrona", "Resumo", "Fim"];

  return (
    <header className="nav-steps container-fluid">
      <nav className="nav-steps-left">
        <ul className="steps-h">
          {steps.map((step, index) => {
            let className = "";
            if (index === currentStep) className = "current"; // azul
            if (doneSteps.includes(index)) className = "done"; // verde

            return <li key={index} className={className}>{step}</li>;
          })}
        </ul>
      </nav>
    </header>
  );
}

export default StepsBar;
