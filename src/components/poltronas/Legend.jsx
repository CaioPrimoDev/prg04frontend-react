function Legend() {
  return (
    <div className="guia">
      <div className="guia-poltrona"><div className="poltrona ocupada"></div><h4>Ocupada</h4></div>
      <div className="guia-poltrona"><div className="poltrona livre"></div><h4>Livre</h4></div>
      <div className="guia-poltrona"><div className="poltrona bloqueada"></div><h4>Bloqueada</h4></div>
      <div className="guia-poltrona"><div className="poltrona selecionada"></div><h4>Selecionada</h4></div>
    </div>
  );
}

export default Legend;
