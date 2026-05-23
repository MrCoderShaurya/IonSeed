import { useMemo, useState } from 'react';
import seedMetrics from './seed_metrics.json';

const modelInfo = {
  name: 'Ion Treatment App',
  description: 'A simplified app-style form for selecting seed type, plasma input, and estimating growth time and rate.',
  version: '1.0',
  tags: ['seed', 'plasma', 'app', 'rate'],
};

const inputOptions = [
  { value: 'ion-treated-seed', label: 'Ion treated seed sample' },
  { value: 'ion-treated-water', label: 'Ion treated water sample' },
  { value: 'ion-treated-soil', label: 'Ion treated soil sample' },
  { value: 'ion-treated-air', label: 'Ion treated air sample' },
];

const seedTypes = Object.keys(seedMetrics).map((type) => ({ value: type, label: type }));

function App() {
  const [selectedOption, setSelectedOption] = useState(inputOptions[0].value);
  const [selectedSeedType, setSelectedSeedType] = useState(seedTypes[0].value);
  const [rate, setRate] = useState(120);
  const [quantity, setQuantity] = useState(1);
  const [output, setOutput] = useState('Select a seed type and run the model.');
  const [status, setStatus] = useState('Ready');

  const seedMetric = seedMetrics[selectedSeedType];

  const totalCost = useMemo(() => {
    const parsedRate = Number(rate);
    const parsedQty = Number(quantity);
    return Number.isFinite(parsedRate) && Number.isFinite(parsedQty)
      ? Math.max(0, parsedRate * parsedQty)
      : 0;
  }, [rate, quantity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Calculating...');

    setTimeout(() => {
      const resultText = [
        `Seed type: ${selectedSeedType}`,
        `Input type: ${inputOptions.find((item) => item.value === selectedOption)?.label}`,
        `Average grow time: ${seedMetric?.average_yield_days ?? 'N/A'} days`,
        `Growth rate: ${seedMetric?.growing_rate_g_per_day ?? 'N/A'} g/day`,
        `Plasma treatment time: ${seedMetric?.treatment_time_seconds ?? 'N/A'} sec`,
        `Expected germination: ${seedMetric?.expected_germination_rate ?? 'N/A'}%`,
        `Unit rate: ${rate} per unit`,
        `Quantity: ${quantity}`,
        `Estimated cost: ${totalCost}`,
      ].join('\n');

      setOutput(resultText);
      setStatus('Ready');
    }, 400);
  };

  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Seed Plasma App</p>
          <h1>{modelInfo.name}</h1>
          <p className="subtitle">Use the app-style form to choose a seed and estimate growing time, treatment, and cost.</p>
        </div>
        <div className="meta-card">
          <p><strong>Version</strong>: {modelInfo.version}</p>
          <p><strong>Tags</strong>: {modelInfo.tags.join(', ')}</p>
        </div>
      </header>

      <main className="app-grid">
        <section className="form-card">
          <h2>Input form</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Seed category
              <select value={selectedSeedType} onChange={(event) => setSelectedSeedType(event.target.value)}>
                {seedTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Treatment input
              <select value={selectedOption} onChange={(event) => setSelectedOption(event.target.value)}>
                {inputOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-row">
              <label>
                Unit rate
                <input
                  type="number"
                  min="0"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                />
              </label>

              <label>
                Units
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </label>
            </div>

            <button type="submit">Calculate</button>
          </form>
        </section>

        <section className="result-card">
          <div className="result-header">
            <h2>Results</h2>
            <span className="status-pill">{status}</span>
          </div>

          <div className="result-block">
            <p><strong>Grow time</strong> {seedMetric?.average_yield_days ?? 'N/A'} days</p>
            <p><strong>Growth rate</strong> {seedMetric?.growing_rate_g_per_day ?? 'N/A'} g/day</p>
            <p><strong>Treatment time</strong> {seedMetric?.treatment_time_seconds ?? 'N/A'} sec</p>
            <p><strong>Expected germination</strong> {seedMetric?.expected_germination_rate ?? 'N/A'}%</p>
            <p><strong>Estimated cost</strong> {totalCost}</p>
          </div>

          <div className="output-panel">
            <h3>Summary</h3>
            <pre>{output}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
