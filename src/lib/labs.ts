export type LabId = 1 | 2 | 3 | 4 | 5;
export type Values = Record<string, number>;

export type Control = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
};

export type Lab = {
  id: LabId;
  slug: string;
  short: string;
  title: string;
  subtitle: string;
  tag: string;
  formula: string;
  theory: string;
  interpretation: string;
  controls: Control[];
  defaults: Values;
  file: string;
  code: string;
};

export type Metric = { label: string; value: string; unit: string };
export type Plot = { x: number[]; y: number[]; xlabel: string; ylabel: string; title: string; x0: number; x1: number; ymin: number; ymax: number; marker?: { x: number; y: number } };
export type Result = { metrics: Metric[]; plot: Plot; terminal: string[]; note: string };

export const LABS: Lab[] = [
  {
    id: 1, slug: "gauss", short: "Electrostatics", title: "The charge and the shield",
    subtitle: "Mapping the electric field around a uniformly charged sphere",
    tag: "CO 01 / GAUSS'S LAW", formula: "E(r) = Q / (4πε₀r²)",
    theory: "Outside a uniformly charged sphere, Gauss's law makes the field identical to that of a point charge at its center. The enclosure radius does not change the total electric flux; the field drops with the square of distance.",
    interpretation: "The result is an intense external electrostatic field. A continuous conducting enclosure can shield its interior in the electrostatic idealization, but openings, joints and practical geometry must be considered.",
    controls: [
      { key: "q", label: "Enclosed charge", min: 1, max: 12, step: 0.5, unit: "µC" },
      { key: "r", label: "Observation distance", min: 0.12, max: 0.5, step: 0.01, unit: "m" },
    ],
    defaults: { q: 8, r: 0.2 }, file: "01_gauss_law.py",
    code: `"""LLT1 Q1 · Electric field surrounding a charged sphere."""
import numpy as np
import matplotlib.pyplot as plt

epsilon_0 = 8.8541878128e-12  # F/m
Q = 8e-6                      # C
sphere_radius = 0.10          # m
observation_r = 0.20          # m

def electric_field(r):
    # Valid outside the sphere: r >= sphere_radius
    return Q / (4 * np.pi * epsilon_0 * r**2)

r = np.linspace(0.11, 0.60, 400)
E = electric_field(r)
target = electric_field(observation_r)
print(f"E at 0.20 m: {target / 1e6:.4f} MV/m")

plt.figure(figsize=(8, 4))
plt.plot(r, E / 1e6, color="#248b73", lw=2.5)
plt.scatter([observation_r], [target / 1e6], color="#e8a66b")
plt.xlabel("Distance r (m)")
plt.ylabel("Electric-field magnitude (MV/m)")
plt.title("Gauss's law: external spherical field")
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 2, slug: "biot-savart", short: "Magnetostatics", title: "Current through the coil",
    subtitle: "An air-core sensor modeled with the Biot–Savart law",
    tag: "CO 02 / BIOT–SAVART", formula: "B₀ = μ₀NI / (2R)",
    theory: "Each small segment of a circular current loop contributes a magnetic field at the center. Integration of Biot–Savart around all turns gives B₀ = μ₀NI/(2R), linear in current and number of turns.",
    interpretation: "For the specified 20-turn, 0.15 m coil, current is an effective control variable for sensor field strength: doubling the current doubles the central flux density in the ideal air-core model.",
    controls: [
      { key: "i", label: "Drive current", min: 0.5, max: 4, step: 0.1, unit: "A" },
      { key: "n", label: "Coil turns", min: 10, max: 40, step: 1, unit: "turns" },
      { key: "r", label: "Coil radius", min: 0.1, max: 0.25, step: 0.01, unit: "m" },
    ],
    defaults: { i: 2, n: 20, r: 0.15 }, file: "02_biot_savart.py",
    code: `"""LLT1 Q2 · Biot–Savart field at the center of a circular coil."""
import numpy as np
import matplotlib.pyplot as plt

mu_0 = 4 * np.pi * 1e-7  # H/m
N = 20                  # turns
R = 0.15                # m
current = 2.0           # A

def center_field(I):
    return mu_0 * N * I / (2 * R)

currents = np.linspace(0, 4, 200)
B_microtesla = center_field(currents) * 1e6
print(f"B at I = 2 A: {center_field(current)*1e6:.3f} µT")

plt.figure(figsize=(8, 4))
plt.plot(currents, B_microtesla, color="#248b73", lw=2.5)
plt.scatter([current], [center_field(current)*1e6], color="#e8a66b")
plt.xlabel("Current I (A)")
plt.ylabel("Central flux density B (µT)")
plt.title("Circular coil: magnetic field vs current")
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 3, slug: "maxwell", short: "Maxwell's equations", title: "The current that crosses no gap",
    subtitle: "Displacement current inside a charging capacitor",
    tag: "CO 03 / AMPÈRE–MAXWELL", formula: "∮ H · dl = Iᶜ + dΦᴰ/dt",
    theory: "The wire carries conduction current while the insulating gap carries no conduction charge. A changing electric displacement flux produces an equal displacement-current term, preserving Ampère's law for every surface spanning the loop.",
    interpretation: "At the stated charging current of 0.5 A, the displacement current through the dielectric is also 0.5 A. The field graph uses normalized radius because the case study does not specify plate dimensions.",
    controls: [
      { key: "i", label: "Charging current", min: 0.1, max: 1, step: 0.05, unit: "A" },
      { key: "rho", label: "Probe radius / plate radius", min: 0.1, max: 2.5, step: 0.1, unit: "r/a" },
    ],
    defaults: { i: 0.5, rho: 1 }, file: "03_displacement_current.py",
    code: `"""LLT1 Q3 · Ampère–Maxwell law for a charging capacitor."""
import numpy as np
import matplotlib.pyplot as plt

I_conduction = 0.5  # A, current in the lead wire
I_displacement = I_conduction
print(f"Displacement current = {I_displacement:.3f} A")

# Uniform circular plates; ignore fringing.
# Since plate radius is unspecified, use rho = r/a.
rho = np.linspace(0.01, 2.5, 350)
B_over_Bedge = np.where(rho <= 1, rho, 1/rho)

plt.figure(figsize=(8, 4))
plt.plot(rho, B_over_Bedge, color="#248b73", lw=2.5)
plt.axvline(1, color="#e8a66b", linestyle="--", label="Plate edge")
plt.xlabel("Normalized radial position r/a")
plt.ylabel("B_phi(r) / B_phi(a)")
plt.title("Displacement-current magnetic circulation")
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 4, slug: "standing-wave", short: "Transmission lines", title: "Where the reflected wave returns",
    subtitle: "Reflection coefficient, VSWR and the standing-wave envelope",
    tag: "CO 04 / LOSSLESS LINE", formula: "Γ = (Zᴸ − Z₀) / (Zᴸ + Z₀)",
    theory: "A mismatched termination sends a portion of the incident wave back toward the source. Interference between the forward and reflected waves creates voltage maxima and minima. VSWR is the ratio of those extrema.",
    interpretation: "At 100 + j50 Ω on a 50 Ω line, Γ = 0.4 + j0.2, |Γ| = 0.447 and VSWR = 2.618. Twenty percent of incident power is reflected, before source re-reflections.",
    controls: [
      { key: "r", label: "Load resistance", min: 20, max: 160, step: 5, unit: "Ω" },
      { key: "x", label: "Load reactance", min: -100, max: 100, step: 5, unit: "Ω" },
    ],
    defaults: { r: 100, x: 50 }, file: "04_reflections_vswr.py",
    code: `"""LLT1 Q4 · Reflection and standing-wave pattern on a 50-ohm line."""
import numpy as np
import matplotlib.pyplot as plt

Z0 = 50
ZL = 100 + 1j*50
Gamma = (ZL - Z0) / (ZL + Z0)
VSWR = (1 + abs(Gamma)) / (1 - abs(Gamma))
reflected_power = abs(Gamma)**2

print(f"Reflection coefficient = {Gamma:.4f}")
print(f"Magnitude = {abs(Gamma):.4f}, VSWR = {VSWR:.4f}")
print(f"Reflected power fraction = {reflected_power:.1%}")

z_wavelengths = np.linspace(0, 1, 600)
V = abs(1 + Gamma * np.exp(-1j*4*np.pi*z_wavelengths))

plt.figure(figsize=(8, 4))
plt.plot(z_wavelengths, V, color="#248b73", lw=2.5)
plt.axhline(1 + abs(Gamma), linestyle="--", color="#e8a66b")
plt.axhline(1 - abs(Gamma), linestyle="--", color="#7dbca7")
plt.xlabel("Distance from load (wavelengths)")
plt.ylabel("Normalized voltage amplitude")
plt.title("Standing wave on a lossless transmission line")
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 5, slug: "smith-chart", short: "Impedance matching", title: "Find the center of the chart",
    subtitle: "Complex reflection mapping and a two-stage RF match",
    tag: "CO 05 / SMITH CHART", formula: "zᴸ = 0.5 + j0.5; Γ = −0.2 + j0.4",
    theory: "The Smith chart maps normalized impedance onto the complex reflection-coefficient plane. An inductive load lies above the real axis. A series capacitor cancels +j25 Ω, then a quarter-wave section with impedance √(50×25) Ω matches the remaining 25 Ω at one design frequency.",
    interpretation: "The original 25 + j25 Ω termination has |Γ| = 0.447. The proposed series-capacitor/quarter-wave combination is a valid single-frequency match; capacitor value and physical line length require a specified operating frequency.",
    controls: [
      { key: "r", label: "Load resistance", min: 10, max: 120, step: 5, unit: "Ω" },
      { key: "x", label: "Load reactance", min: -80, max: 100, step: 5, unit: "Ω" },
    ],
    defaults: { r: 25, x: 25 }, file: "05_smith_matching.py",
    code: `"""LLT1 Q5 · Smith-chart coordinate and matching components."""
import numpy as np
import matplotlib.pyplot as plt

Z0 = 50.0
ZL = 25.0 + 1j*25.0
zL = ZL / Z0
Gamma = (zL - 1) / (zL + 1)

# Cancel the inductive load reactance with a series capacitor.
series_reactance = -ZL.imag  # -25 ohm
Z_after_capacitor = ZL + 1j*series_reactance
Z_transformer = np.sqrt(Z0 * Z_after_capacitor.real)

print(f"Normalized load: {zL:.4f}")
print(f"Reflection: {Gamma:.4f}, magnitude {abs(Gamma):.4f}")
print(f"Series capacitive reactance: {series_reactance:.1f} ohm")
print(f"Quarter-wave Zt: {Z_transformer:.3f} ohm")

# Smith chart: circle of all passive reflection coefficients.
t = np.linspace(0, 2*np.pi, 500)
plt.figure(figsize=(6, 6))
plt.plot(np.cos(t), np.sin(t), color="#4b6463")
plt.axhline(0, color="#a5b7ac", lw=0.8)
plt.axvline(0, color="#a5b7ac", lw=0.8)
plt.scatter([Gamma.real], [Gamma.imag], color="#248b73", s=90)
plt.scatter([0], [0], marker="x", color="#e8a66b", s=90)
plt.annotate("Load", (Gamma.real, Gamma.imag), xytext=(-.8, .6),
             arrowprops={"arrowstyle": "->"})
plt.axis("equal")
plt.xlim(-1.1, 1.1)
plt.ylim(-1.1, 1.1)
plt.title("Reflection-coefficient plane")
plt.xlabel("Re(Gamma)")
plt.ylabel("Im(Gamma)")
plt.grid(alpha=0.2)
plt.tight_layout()
plt.show()
`,
  },
];

const EPS0 = 8.8541878128e-12;
const MU0 = 4 * Math.PI * 1e-7;

function linspace(start: number, end: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => start + (end - start) * i / (count - 1));
}

export function reflection(resistance: number, reactance: number) {
  const a = resistance - 50;
  const b = reactance;
  const c = resistance + 50;
  const d = reactance;
  const denominator = c*c + d*d;
  const re = (a*c + b*d) / denominator;
  const im = (b*c - a*d) / denominator;
  const magnitude = Math.hypot(re, im);
  return { re, im, magnitude, vswr: (1 + magnitude) / (1 - magnitude) };
}

export function getResult(id: LabId, p: Values): Result {
  if (id === 1) {
    const e = (r: number) => p.q*1e-6 / (4*Math.PI*EPS0*r*r) / 1e6;
    const x = linspace(0.11, 0.6, 160);
    return {
      metrics: [
        { label: "FIELD AT PROBE", value: e(p.r).toFixed(3), unit: "MV/m" },
        { label: "CHARGE", value: p.q.toFixed(1), unit: "µC" },
        { label: "SPHERE RADIUS", value: "0.10", unit: "m" },
      ],
      plot: { x, y: x.map(e), title: "Field falloff / 1 over r squared", xlabel: "Distance from center (m)", ylabel: "MV/m", x0: 0.11, x1: 0.6, ymin: 0, ymax: e(0.11)*1.08, marker: { x: p.r, y: e(p.r) } },
      terminal: [`E(${p.r.toFixed(2)} m) = ${(e(p.r)*1e6).toFixed(0)} V/m`, "External-field Gauss model: PASS", "Reference: spherical a = 0.10 m"],
      note: "The graph is valid outside the sphere (r > 0.10 m).",
    };
  }
  if (id === 2) {
    const b = (i: number) => MU0*p.n*i/(2*p.r)*1e6;
    const x = linspace(0, 4.5, 160);
    return {
      metrics: [
        { label: "FIELD AT CENTER", value: b(p.i).toFixed(2), unit: "µT" },
        { label: "SENSITIVITY", value: b(1).toFixed(2), unit: "µT/A" },
        { label: "COIL TURNS", value: String(p.n), unit: "turns" },
      ],
      plot: { x, y: x.map(b), title: "Central field / current sweep", xlabel: "Coil current (A)", ylabel: "µT", x0: 0, x1: 4.5, ymin: 0, ymax: b(4.5)*1.08, marker: { x: p.i, y: b(p.i) } },
      terminal: [`B(center) = ${b(p.i).toFixed(3)} microtesla`, `dB/dI = ${b(1).toFixed(3)} microtesla/A`, "Biot-Savart circular-coil model: PASS"],
      note: "Assumes an ideal circular air-core coil with identical turns.",
    };
  }
  if (id === 3) {
    const f = (rho: number) => rho <= 1 ? rho : 1/rho;
    const x = linspace(0.01, 2.6, 160);
    return {
      metrics: [
        { label: "DISPLACEMENT CURRENT", value: p.i.toFixed(2), unit: "A" },
        { label: "B / B(edge)", value: f(p.rho).toFixed(3), unit: "ratio" },
        { label: "PROBE POSITION", value: p.rho.toFixed(1), unit: "r/a" },
      ],
      plot: { x, y: x.map(f), title: "Ideal plate / normalized magnetic field", xlabel: "Normalized radius (r/a)", ylabel: "B/B(edge)", x0: 0, x1: 2.6, ymin: 0, ymax: 1.1, marker: { x: p.rho, y: f(p.rho) } },
      terminal: [`I_displacement = ${p.i.toFixed(3)} A`, "I_conduction in external lead = I_displacement", "Ampere-Maxwell continuity: PASS"],
      note: "Plate radius was not given; the plotted field is dimensionless, with negligible fringing assumed.",
    };
  }
  if (id === 4) {
    const g = reflection(p.r, p.x);
    const v = (z: number) => Math.hypot(1 + g.re*Math.cos(4*Math.PI*z) + g.im*Math.sin(4*Math.PI*z), g.im*Math.cos(4*Math.PI*z) - g.re*Math.sin(4*Math.PI*z));
    const x = linspace(0, 1, 250);
    return {
      metrics: [
        { label: "REFLECTION |Γ|", value: g.magnitude.toFixed(3), unit: "" },
        { label: "VSWR", value: g.vswr.toFixed(3), unit: ":1" },
        { label: "POWER REFLECTED", value: (100*g.magnitude*g.magnitude).toFixed(1), unit: "%" },
      ],
      plot: { x, y: x.map(v), title: "Standing-wave voltage envelope", xlabel: "Distance from load (wavelengths)", ylabel: "|V| / |V+|", x0: 0, x1: 1, ymin: Math.max(0,1-g.magnitude-.1), ymax: 1+g.magnitude+.1 },
      terminal: [`Gamma = ${g.re.toFixed(4)} ${g.im < 0 ? "-" : "+"} j${Math.abs(g.im).toFixed(4)}`, `VSWR = ${g.vswr.toFixed(4)}`, `Reflected power = ${(100*g.magnitude**2).toFixed(2)}%`],
      note: "Lossless line and a single incident wave; source re-reflections are excluded.",
    };
  }
  const g = reflection(p.r,p.x);
  const x = linspace(-150, 150, 250);
  const y = x.map(xc => reflection(p.r, p.x+xc).magnitude);
  const zt = Math.sqrt(50*p.r);
  return {
    metrics: [
      { label: "NORMALIZED LOAD", value: `${(p.r/50).toFixed(2)} ${p.x < 0 ? "−" : "+"} j${Math.abs(p.x/50).toFixed(2)}`, unit: "" },
      { label: "REFLECTION |Γ|", value: g.magnitude.toFixed(3), unit: "" },
      { label: "TRANSFORMER Zₜ", value: zt.toFixed(2), unit: "Ω" },
    ],
    plot: { x, y, title: "Reflection after a series reactance", xlabel: "Added series reactance (Ω)", ylabel: "|Γ|", x0: -150, x1: 150, ymin: 0, ymax: 1, marker: { x: -p.x, y: Math.abs((p.r-50)/(p.r+50)) } },
    terminal: [`Load Γ = ${g.re.toFixed(4)} ${g.im < 0 ? "-" : "+"} j${Math.abs(g.im).toFixed(4)}`, `Cancel reactance: X_series = ${(-p.x).toFixed(1)} ohm`, `Quarter-wave Zt = ${zt.toFixed(3)} ohm`, "Matched at design frequency: ideal model"],
    note: "The series element is capacitive for positive load reactance, inductive for negative. Matching frequency is unspecified.",
  };
}
