let currentUnit = 'metric';

function setUnit(unit) {
  currentUnit = unit;
  const toggle = document.getElementById('unitToggle');
  toggle.classList.toggle('imperial', unit === 'imperial');

  toggle.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === unit);
  });

  document.getElementById('heightMetric').style.display = unit === 'metric' ? 'flex' : 'none';
  document.getElementById('heightImperial').style.display = unit === 'imperial' ? 'flex' : 'none';
  document.getElementById('weightMetric').style.display = unit === 'metric' ? 'flex' : 'none';
  document.getElementById('weightImperial').style.display = unit === 'imperial' ? 'flex' : 'none';
}

function getHeightInCm() {
  if (currentUnit === 'metric') {
    return parseFloat(document.getElementById('heightCm').value);
  }
  const ft = parseFloat(document.getElementById('heightFt').value) || 0;
  const inches = parseFloat(document.getElementById('heightIn').value) || 0;
  return (ft * 12 + inches) * 2.54;
}

function getWeightInKg() {
  if (currentUnit === 'metric') {
    return parseFloat(document.getElementById('weightKg').value);
  }
  return parseFloat(document.getElementById('weightLbs').value) * 0.453592;
}

function validateInputs() {
  let valid = true;
  const inputs = currentUnit === 'metric'
    ? ['heightCm', 'weightKg']
    : ['heightFt', 'weightLbs'];

  document.querySelectorAll('input').forEach(i => i.classList.remove('error'));

  inputs.forEach(id => {
    const el = document.getElementById(id);
    const val = parseFloat(el.value);
    if (isNaN(val) || val <= 0) {
      el.classList.add('error');
      el.closest('.input-group, .input-row')?.classList.add('shake');
      setTimeout(() => el.closest('.input-group, .input-row')?.classList.remove('shake'), 400);
      valid = false;
    }
  });

  return valid;
}

function getCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', cls: 'category-underweight', band: 'bandUnderweight' };
  if (bmi < 25) return { label: 'Normal', cls: 'category-normal', band: 'bandNormal' };
  if (bmi < 30) return { label: 'Overweight', cls: 'category-overweight', band: 'bandOverweight' };
  return { label: 'Obese', cls: 'category-obese', band: 'bandObese' };
}

function getScalePercent(bmi) {
  const clamped = Math.max(15, Math.min(40, bmi));
  return ((clamped - 15) / 25) * 100;
}

function calculate() {
  if (!validateInputs()) return;

  const heightCm = getHeightInCm();
  const weightKg = getWeightInKg();

  if (heightCm <= 0 || weightKg <= 0) return;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  const panel = document.getElementById('resultPanel');
  const bmiEl = document.getElementById('resultBmi');
  const catEl = document.getElementById('resultCategory');
  const marker = document.getElementById('scaleMarker');

  bmiEl.textContent = rounded.toFixed(1);

  const cat = getCategory(rounded);
  catEl.textContent = cat.label;
  catEl.className = 'result-category ' + cat.cls;

  marker.style.left = getScalePercent(rounded) + '%';

  document.querySelectorAll('.band-item').forEach(b => b.classList.remove('active'));
  document.getElementById(cat.band).classList.add('active');

  panel.classList.add('visible');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calculate();
});
