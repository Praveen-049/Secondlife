const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest'
];

function normaliseList(value) {
  if (Array.isArray(value)) return value.map(entry => String(entry).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,\n]/).map(entry => entry.trim()).filter(Boolean);
  return [];
}

function normaliseAiResult(raw = {}) {
  const workabilityScore = Number(raw.workabilityScore ?? raw.workability_score ?? 0);
  const confidence = Number(raw.confidence ?? raw.confidenceScore ?? 0);
  const suggestedUses = normaliseList(raw.suggestedUses ?? raw.suggested_uses ?? [
    'Reuse in a compatible prototype or repair project',
    'Test in a bench setup before integration'
  ]);
  const detectedDamage = normaliseList(raw.detectedDamage ?? raw.detected_damage ?? [
    'No major physical damage detected during AI inspection'
  ]);

  const fallbackCondition = workabilityScore >= 80 ? 'Good' : workabilityScore >= 60 ? 'Fair' : 'For parts';

  return {
    componentName: String(raw.componentName || raw.component_name || 'Unknown component').trim(),
    category: String(raw.category || 'Other').trim(),
    manufacturer: String(raw.manufacturer || 'Unknown manufacturer').trim(),
    partNumber: String(raw.partNumber || raw.part_identifier || raw.partIdentifier || 'N/A').trim(),
    packageType: String(raw.packageType || raw.package_type || 'Unknown package').trim(),
    condition: String(raw.condition || fallbackCondition).trim(),
    workabilityScore: Number.isFinite(workabilityScore) ? Math.min(100, Math.max(0, workabilityScore)) : 0,
    confidence: Number.isFinite(confidence) ? Math.min(100, Math.max(0, confidence)) : 0,
    description: String(raw.description || raw.physicalCondition || 'AI inspection completed.').trim(),
    suggestedUses,
    detectedDamage
  };
}

export async function analyzeComponentCondition(imageBase64, mimeType = 'image/jpeg') {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: 'Missing Gemini API key. Add VITE_GEMINI_API_KEY to your environment before running AI analysis.'
    };
  }

  const cleanBase64 = imageBase64.includes('base64,') ? imageBase64.split('base64,')[1] : imageBase64;

  const prompt = `You are a senior electronics failure analyst and procurement engineer. Inspect this component image and return ONLY valid JSON with no markdown fences.

Return this exact structure:
{
  "componentName": "Exact component name",
  "category": "Microcontroller / Sensor / Power / Display / Connector / Passive / IC / Other",
  "manufacturer": "Known manufacturer when visible or likely brand",
  "partNumber": "Part number or package marking if visible",
  "packageType": "SMD / QFN / SOIC / TO-220 / DIP / Radial / Through-hole / Unknown",
  "condition": "Good / Fair / For parts",
  "workabilityScore": 0,
  "confidence": 0,
  "description": "Short summary of appearance and condition",
  "suggestedUses": ["Use case 1", "Use case 2"],
  "detectedDamage": ["Damage 1", "Damage 2"]
}

Rules:
- Use realistic component naming and detect burn marks, soot, corrosion, cracked packages, or thermal damage.
- Keep workabilityScore between 0 and 100.
- Keep confidence between 0 and 100.
- If the image is unclear, set confidence low and note the uncertainty in description.
- Do not fabricate a specific manufacturer unless it is reasonably visible.
- Prefer concise but useful field values.`;

  let lastError = 'Gemini AI component inspection failed.';

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: cleanBase64 } }
          ]
        }],
        generationConfig: { response_mime_type: 'application/json' }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 200) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts
          ?.map(part => part.text || '')
          .join('')
          .trim();

        if (!text) {
          lastError = 'Gemini returned no usable content for this image.';
          continue;
        }

        const cleanedText = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        return { success: true, data: normaliseAiResult(parsed) };
      }

      const errorPayload = await response.json().catch(() => ({}));
      lastError = errorPayload.error?.message || `HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message || 'Gemini call failed.';
    }
  }

  return { success: false, error: lastError };
}
