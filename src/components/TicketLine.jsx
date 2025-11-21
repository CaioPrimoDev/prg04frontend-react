function TicketLine({ type, value }) {
  let taxa = value * 0.1; // Exemplo: 10% de taxa

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);


  return (
    <div className="p-2">
      <div className="d-flex align-items-center">
        <select className="form-select custom-select" style={{ width: "25%" }}>
          <option value="" selected disabled>0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>

        <span className="ms-2">R$ {formatCurrency(value)}</span>
        <span className="ms-4">{type}</span>
      </div>

      <div className="d-flex mt-2">
        <span className="me-4">SUB-TOTAL: R$ {formatCurrency(value + taxa)}</span>
        <span>TAXAS: R$ {formatCurrency(taxa)}</span>
      </div>
    </div>
  );
}

export default TicketLine;
