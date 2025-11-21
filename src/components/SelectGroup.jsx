import "../assets/styles/SelectGroup.css";

function SelectGroup({ title, options }) {
  return (
    <div className="p-1">
      <h2 className="h4 text-center mt-1">{title}</h2>
      <select className="form-select custom-select" aria-label={`Escolha ${title}`}>
        <option value="" selected disabled>Escolha uma opção</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectGroup;
